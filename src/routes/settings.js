import express from "express";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/settings", ensureAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    res.render("settings", { user });
  } catch (err) {
    next(err);
  }
});

router.post("/settings", ensureAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      req.flash("error", "El nombre no puede estar vacío");
      return res.redirect("/settings");
    }
    await prisma.user.update({
      where: { id: req.user.id },
      data: { name: name.trim() },
    });
    req.flash("success", "Perfil actualizado");
    res.redirect("/settings");
  } catch (err) {
    next(err);
  }
});

export default router;
