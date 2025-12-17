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
    });

    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      participantCount: m.group.participants.length,
      drawn: Boolean(m.group.drawnAt),
      isAdmin: m.group.adminUserId === req.user.id,
    }));

    res.render("dashboard", { groups });
  } catch (err) {
    next(err);
  }
});

export default router;
