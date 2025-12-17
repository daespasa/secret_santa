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
  
  const minParticipants = await prisma.group.findUnique({
    where: { id: groupId },
    select: { minParticipants: true },
  });

  if (participants.length < minParticipants.minParticipants) {
    throw new Error(
      `Se requieren al menos ${minParticipants.minParticipants} participantes para sortear`
    );
  }
  
  const shuffled = shuffle(participants);
  const assignments = shuffled.map((entry, idx) => {
    const receiver = shuffled[(idx + 1) % shuffled.length];
    if (entry.id === receiver.id) {
      throw new Error("Asignación inválida detectada");
    }
    return {
      groupId,
      giverParticipantId: entry.id,
      receiverParticipantId: receiver.id,
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
