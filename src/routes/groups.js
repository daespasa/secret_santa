import express from "express";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";
import { performDraw } from "../services/draw.js";
import { sendAssignmentEmail } from "../services/email.js";
import { config } from "../config.js";

const router = express.Router();

function buildGroupInviteLink(token) {
  return `${config.baseUrl}/join/${token}`;
}

async function assertMembership(userId, groupId) {
  const membership = await prisma.groupUser.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  return Boolean(membership);
}

router.get("/groups/new", ensureAuth, (req, res) => {
  res.render("groups/new");
});

router.post("/groups", ensureAuth, async (req, res, next) => {
  try {
    const {
      name,
      description,
      price_max: priceMax,
      event_date: eventDate,
      draw_deadline: drawDeadline,
      rules,
      icon,
      color,
    } = req.body;

    if (!name) {
      req.flash("error", "El nombre es obligatorio");
      return res.redirect("/groups/new");
    }

    const joinToken = nanoid(12);
    const group = await prisma.$transaction(async (tx) => {
      const created = await tx.group.create({
        data: {
          name,
          description: description || null,
          priceMax: priceMax ? Number(priceMax) : null,
          eventDate: eventDate ? new Date(eventDate) : null,
          drawDeadline: drawDeadline ? new Date(drawDeadline) : null,
          rules: rules || null,
          icon: icon || null,
          color: color || null,
          adminUserId: req.user.id,
          joinToken,
        },
      });
      await tx.groupUser.create({
        data: { groupId: created.id, userId: req.user.id },
      });
      return created;
    });

    res.render("groups/created", {
      group,
      inviteLink: buildGroupInviteLink(joinToken),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/groups/:id", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const isMember = await assertMembership(req.user.id, groupId);
    if (!isMember) {
      req.flash("error", "No perteneces a este grupo");
      return res.redirect("/dashboard");
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        admin: true,
        participants: { include: { user: true } },
        assignments: { include: { giver: true, receiver: true } },
      },
    });

    if (!group) {
      return res
        .status(404)
        .render("error", { message: "Grupo no encontrado" });
    }

    const participantNames = group.participants.map((p) => p.user.name);
    const userAssignment = group.assignments.find(
      (a) => a.giverUserId === req.user.id
    );
    const receiver = userAssignment ? userAssignment.receiver : null;

    res.render("groups/show", {
      group,
      participants: group.participants,
      participantNames,
      receiver,
      receiverName: receiver ? receiver.name : null,
      dayjs,
      config,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/join/:token", ensureAuth, async (req, res, next) => {
  const { token } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { joinToken: token },
    });
    if (!group) {
      req.flash("error", "Invitación no válida");
      return res.redirect("/dashboard");
    }
    if (group.drawnAt) {
      req.flash("error", "El grupo ya fue sorteado");
      return res.redirect("/dashboard");
    }
    if (group.drawDeadline && dayjs().isAfter(group.drawDeadline)) {
      req.flash("error", "La fecha límite de inscripción ha pasado");
      return res.redirect("/dashboard");
    }

    const existing = await prisma.groupUser.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: req.user.id } },
    });
    if (!existing) {
      await prisma.groupUser.create({
        data: { groupId: group.id, userId: req.user.id },
      });
      req.flash("success", "Te has unido al grupo");
    } else {
      req.flash("info", "Ya formas parte del grupo");
    }

    return res.redirect(`/groups/${group.id}`);
  } catch (err) {
    next(err);
  }
});

router.post("/groups/:id/draw", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { participants: { include: { user: true } } },
    });
    if (!group) {
      req.flash("error", "Grupo no encontrado");
      return res.redirect("/dashboard");
    }
    if (group.adminUserId !== req.user.id) {
      req.flash("error", "Solo el admin puede iniciar el sorteo");
      return res.redirect(`/groups/${groupId}`);
    }
    if (group.drawnAt) {
      req.flash("info", "El grupo ya fue sorteado");
      return res.redirect(`/groups/${groupId}`);
    }

    const { assignments } = await performDraw(groupId);

    // Send emails best-effort; failures logged
    if (config.email.mode === "smtp" || config.email.mode === "dev") {
      await Promise.all(
        assignments.map(async (a) => {
          const giver = group.participants.find(
            (p) => p.userId === a.giverUserId
          )?.user;
          const receiver = group.participants.find(
            (p) => p.userId === a.receiverUserId
          )?.user;
          if (!giver || !receiver) return null;
          try {
            await sendAssignmentEmail({
              to: giver.email,
              groupName: group.name,
              receiverName: receiver.name,
              priceMax: group.priceMax,
              groupUrl: `${config.baseUrl}/groups/${groupId}`,
            });
          } catch (err) {
            console.error("Error enviando email", err);
          }
          return null;
        })
      );
    }

    req.flash("success", "Sorteo realizado");
    res.redirect(`/groups/${groupId}`);
  } catch (err) {
    next(err);
  }
});

export default router;
