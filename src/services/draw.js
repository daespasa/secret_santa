import crypto from "crypto";
import prisma from "../prisma.js";

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(crypto.randomInt(0, i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export async function performDraw(groupId) {
  const participants = await prisma.groupUser.findMany({
    where: { groupId },
    include: { user: true },
  });
  if (participants.length < 3) {
    throw new Error("Se requieren al menos 3 participantes para sortear");
  }
  const shuffled = shuffle(participants);
  const assignments = shuffled.map((entry, idx) => {
    const receiver = shuffled[(idx + 1) % shuffled.length];
    if (entry.userId === receiver.userId) {
      throw new Error("Asignación inválida detectada");
    }
    return {
      groupId,
      giverUserId: entry.userId,
      receiverUserId: receiver.userId,
    };
  });

  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.group.update({
      where: { id: groupId, drawnAt: null },
      data: { drawnAt: new Date() },
    });

    await tx.assignment.createMany({ data: assignments });
    return { group, assignments };
  });

  return result;
}
