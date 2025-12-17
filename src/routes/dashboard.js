import express from "express";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", ensureAuth, async (req, res, next) => {
  try {
    const memberships = await prisma.groupUser.findMany({
      where: {
        userId: req.user.id,
        group: {
          archived: false,
        },
      },
      include: {
        group: {
          include: {
            participants: true,
          },
        },
      },
      orderBy: {
        group: {
          createdAt: "desc",
        },
      },
    });

    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      icon: m.group.icon,
      color: m.group.color,
      participantCount: m.group.participants.length,
      drawn: Boolean(m.group.drawnAt),
      isAdmin: m.group.adminUserId === req.user.id,
      invitationCode: m.group.invitationCode,
      createdAt: m.group.createdAt,
    }));

    // Get user statistics
    const totalGroups = groups.length;
    const adminGroups = groups.filter((g) => g.isAdmin).length;
    const drawnGroups = groups.filter((g) => g.drawn).length;
    const pendingGroups = totalGroups - drawnGroups;

    // Get user's participant IDs
    const userParticipants = await prisma.groupUser.findMany({
      where: { userId: req.user.id },
      select: { id: true },
    });
    const participantIds = userParticipants.map((p) => p.id);

    // Get assignment where user is giver (to show their current gifts to give)
    const myAssignments = await prisma.assignment.findMany({
      where: { giverParticipantId: { in: participantIds } },
      include: {
        receiver: { include: { user: true } },
        group: true,
      },
    });

    const stats = {
      totalGroups,
      adminGroups,
      drawnGroups,
      pendingGroups,
    };

    res.render("dashboard", { groups, stats, myAssignments });
  } catch (err) {
    next(err);
  }
});

export default router;
