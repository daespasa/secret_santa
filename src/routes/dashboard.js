import express from "express";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", ensureAuth, async (req, res, next) => {
  try {
    const memberships = await prisma.groupUser.findMany({
      where: { userId: req.user.id },
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

    // Get assignment where user is giver (to show their current gifts to give)
    const myAssignments = await prisma.assignment.findMany({
      where: { giverUserId: req.user.id },
      include: {
        receiver: true,
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
