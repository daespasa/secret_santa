import express from "express";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";
import { performDraw } from "../services/draw.js";
import { sendAssignmentEmail } from "../services/email.js";
import { config } from "../config.js";
import { createGroupLimiter, drawLimiter } from "../middleware/rate-limit.js";

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

router.post(
  "/groups",
  ensureAuth,
  createGroupLimiter,
  async (req, res, next) => {
    try {
      const {
        name,
        description,
        price_max: priceMax,
        min_participants: minParticipants,
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
            minParticipants: minParticipants
              ? Math.max(2, Number(minParticipants))
              : 2,
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
  }
);

router.get("/groups/:id", async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        admin: true,
        participants: { include: { user: true } },
        assignments: {
          include: {
            giver: { include: { user: true } },
            receiver: { include: { user: true } },
          },
        },
      },
    });

    if (!group) {
      return res
        .status(404)
        .render("error", { message: "Grupo no encontrado" });
    }

    // Check if user is authenticated or guest with cookie
    let currentParticipant = null;
    let isGuest = false;
    let guestInfo = null;

    if (req.user) {
      // Logged in user - check membership
      const isMember = await assertMembership(req.user.id, groupId);
      if (!isMember && group.adminUserId !== req.user.id) {
        req.flash("error", "No perteneces a este grupo");
        return res.redirect("/dashboard");
      }

      currentParticipant = group.participants.find(
        (p) => p.userId === req.user.id
      );
    } else {
      // Check if guest has cookie for this group
      const guestCookie = req.cookies[`guest_${groupId}`];
      if (guestCookie) {
        try {
          guestInfo = JSON.parse(guestCookie);
          currentParticipant = group.participants.find(
            (p) => p.id === guestInfo.participantId && p.isGuest
          );
          if (currentParticipant) {
            isGuest = true;
          }
        } catch (e) {
          console.error("Error parsing guest cookie:", e);
        }
      }

      // If no guest cookie or invalid, redirect to login
      if (!isGuest) {
        req.flash(
          "error",
          "Debes iniciar sesión o unirte como invitado para ver este grupo"
        );
        return res.redirect("/");
      }
    }

    const participantNames = group.participants.map((p) =>
      p.isGuest ? p.guestName : p.user.name
    );

    const userAssignment = currentParticipant
      ? group.assignments.find(
          (a) => a.giverParticipantId === currentParticipant.id
        )
      : null;

    const receiver = userAssignment ? userAssignment.receiver : null;
    const receiverName = receiver
      ? receiver.isGuest
        ? receiver.guestName
        : receiver.user.name
      : null;

    res.render("groups/show", {
      group,
      participants: group.participants,
      participantNames,
      receiver,
      receiverName,
      dayjs,
      config,
      isGuest,
      guestInfo,
    });
  } catch (err) {
    next(err);
  }
});

// Join page - shows choice between guest or register/login
router.get("/join/:token", async (req, res, next) => {
  const { token } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { joinToken: token },
      include: {
        admin: true,
        participants: { include: { user: true } },
      },
    });

    if (!group) {
      req.flash("error", "Invitación no válida");
      return res.redirect("/");
    }
    if (group.drawnAt) {
      req.flash(
        "error",
        "El grupo ya fue sorteado, no se pueden unir más participantes"
      );
      return res.redirect("/");
    }
    if (group.drawDeadline && dayjs().isAfter(group.drawDeadline)) {
      req.flash("error", "La fecha límite de inscripción ha pasado");
      return res.redirect("/");
    }

    // If user is logged in, join directly
    if (req.user) {
      console.log(
        `User ${req.user.id} (${req.user.email}) attempting to join group ${group.id} (${group.name})`
      );
      try {
        const existing = await prisma.groupUser.findUnique({
          where: { groupId_userId: { groupId: group.id, userId: req.user.id } },
        });
        if (!existing) {
          await prisma.groupUser.create({
            data: { groupId: group.id, userId: req.user.id },
          });
          console.log(
            `User ${req.user.id} successfully joined group ${group.id}`
          );
          req.flash("success", `¡Te has unido al grupo "${group.name}"!`);
        } else {
          console.log(
            `User ${req.user.id} is already a member of group ${group.id}`
          );
          req.flash("info", "Ya formas parte de este grupo");
        }
      } catch (err) {
        console.error("Error joining group:", err);
        req.flash("error", "Error al unirse al grupo");
      }
      return res.redirect(`/groups/${group.id}`);
    }

    // Show join page with options
    res.render("groups/join", {
      group,
      token,
      dayjs,
      config,
    });
  } catch (err) {
    next(err);
  }
});

// Join as guest - POST
router.post("/join/:token/guest", async (req, res, next) => {
  const { token } = req.params;
  const { guestName, guestEmail } = req.body;

  try {
    const group = await prisma.group.findUnique({
      where: { joinToken: token },
    });

    if (!group) {
      req.flash("error", "Invitación no válida");
      return res.redirect("/");
    }
    if (group.drawnAt) {
      req.flash("error", "El grupo ya fue sorteado");
      return res.redirect("/");
    }

    // Validate inputs
    if (!guestName || !guestEmail) {
      req.flash("error", "Nombre y correo son requeridos");
      return res.redirect(`/join/${token}`);
    }

    // Check if email already used in this group (guest or user)
    const existingGuest = await prisma.groupUser.findFirst({
      where: {
        groupId: group.id,
        guestEmail: guestEmail.toLowerCase(),
      },
    });

    const existingUser = await prisma.groupUser.findFirst({
      where: {
        groupId: group.id,
        user: { email: guestEmail.toLowerCase() },
      },
      include: { user: true },
    });

    if (existingGuest || existingUser) {
      req.flash("error", "Este correo ya está registrado en el grupo");
      return res.redirect(`/join/${token}`);
    }

    // Create guest participant
    const guestParticipant = await prisma.groupUser.create({
      data: {
        groupId: group.id,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        isGuest: true,
      },
    });

    // Store guest info in cookie for future access (expires in 30 days)
    const guestData = {
      participantId: guestParticipant.id,
      groupId: group.id,
      name: guestName,
      email: guestEmail.toLowerCase(),
    };

    // Set cookie with guest data (httpOnly for security, signed)
    res.cookie(`guest_${group.id}`, JSON.stringify(guestData), {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: "lax",
    });

    req.flash(
      "success",
      `¡Bienvenido ${guestName}! Te hemos añadido al grupo.`
    );
    return res.redirect(`/groups/${group.id}`);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/groups/:id/draw",
  ensureAuth,
  drawLimiter,
  async (req, res, next) => {
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

      // Reload group with assignments to get participant details
      const updatedGroup = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          participants: { include: { user: true } },
          assignments: {
            include: {
              giver: { include: { user: true } },
              receiver: { include: { user: true } },
            },
          },
        },
      });

      // Send emails best-effort; failures logged
      if (config.email.mode === "smtp" || config.email.mode === "dev") {
        await Promise.all(
          updatedGroup.assignments.map(async (assignment) => {
            const giver = assignment.giver;
            const receiver = assignment.receiver;

            // Determine email and names (could be registered user or guest)
            const giverEmail = giver.isGuest
              ? giver.guestEmail
              : giver.user.email;
            const giverName = giver.isGuest ? giver.guestName : giver.user.name;
            const receiverName = receiver.isGuest
              ? receiver.guestName
              : receiver.user.name;

            if (!giverEmail) {
              console.error("No email for giver", giver);
              return null;
            }

            try {
              await sendAssignmentEmail({
                to: giverEmail,
                groupName: updatedGroup.name,
                receiverName,
                priceMax: updatedGroup.priceMax,
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
  }
);

// Edit group GET
router.get("/groups/:id/edit", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      return res
        .status(404)
        .render("error", { message: "Grupo no encontrado" });
    }
    if (group.adminUserId !== req.user.id) {
      req.flash("error", "Solo el admin puede editar el grupo");
      return res.redirect(`/groups/${groupId}`);
    }

    res.render("groups/edit", { group, dayjs });
  } catch (err) {
    next(err);
  }
});

// Edit group POST
router.post("/groups/:id/edit", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      req.flash("error", "Grupo no encontrado");
      return res.redirect("/dashboard");
    }
    if (group.adminUserId !== req.user.id) {
      req.flash("error", "Solo el admin puede editar el grupo");
      return res.redirect(`/groups/${groupId}`);
    }

    const {
      name,
      description,
      price_max: priceMax,
      min_participants: minParticipants,
      event_date: eventDate,
      draw_deadline: drawDeadline,
      rules,
      icon,
      color,
    } = req.body;

    if (!name) {
      req.flash("error", "El nombre es obligatorio");
      return res.redirect(`/groups/${groupId}/edit`);
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description: description || null,
        priceMax: priceMax ? Number(priceMax) : null,
        minParticipants: minParticipants
          ? Math.max(2, Number(minParticipants))
          : 2,
        eventDate: eventDate ? new Date(eventDate) : null,
        drawDeadline: drawDeadline ? new Date(drawDeadline) : null,
        rules: rules || null,
        icon: icon || null,
        color: color || null,
      },
    });

    req.flash("success", "Grupo actualizado");
    res.redirect(`/groups/${groupId}`);
  } catch (err) {
    next(err);
  }
});

// Delete group POST
router.post("/groups/:id/delete", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      req.flash("error", "Grupo no encontrado");
      return res.redirect("/dashboard");
    }
    if (group.adminUserId !== req.user.id) {
      req.flash("error", "Solo el admin puede eliminar el grupo");
      return res.redirect(`/groups/${groupId}`);
    }

    const { action } = req.body;

    if (action === "archive") {
      await prisma.group.update({
        where: { id: groupId },
        data: { archived: true },
      });
      req.flash("success", "Grupo archivado");
    } else if (action === "delete") {
      // Delete related data first
      await prisma.assignment.deleteMany({
        where: { groupId },
      });
      await prisma.groupUser.deleteMany({
        where: { groupId },
      });
      await prisma.group.delete({
        where: { id: groupId },
      });
      req.flash("success", "Grupo eliminado");
    }

    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});

// Leave group POST
router.post("/groups/:id/leave", ensureAuth, async (req, res, next) => {
  const groupId = Number(req.params.id);
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { participants: true },
    });
    if (!group) {
      req.flash("error", "Grupo no encontrado");
      return res.redirect("/dashboard");
    }

    // Check if user is admin - admins cannot leave
    if (group.adminUserId === req.user.id) {
      req.flash(
        "error",
        "El admin no puede dejar el grupo. Elimina o archiva el grupo."
      );
      return res.redirect(`/groups/${groupId}`);
    }

    // Check if user is member
    const isMember = await assertMembership(req.user.id, groupId);
    if (!isMember) {
      req.flash("error", "No perteneces a este grupo");
      return res.redirect("/dashboard");
    }

    // Find the participant record
    const participant = await prisma.groupUser.findUnique({
      where: { groupId_userId: { groupId, userId: req.user.id } },
    });

    // Remove user from group
    await prisma.groupUser.delete({
      where: { groupId_userId: { groupId, userId: req.user.id } },
    });

    // If group has draw, also remove user's assignment
    if (group.drawnAt && participant) {
      await prisma.assignment.deleteMany({
        where: {
          groupId,
          OR: [
            { giverParticipantId: participant.id },
            { receiverParticipantId: participant.id },
          ],
        },
      });
    }

    req.flash("success", "Has dejado el grupo");
    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});

export default router;
