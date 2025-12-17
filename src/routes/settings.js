import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prisma from "../prisma.js";
import { ensureAuth } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../..", "public/uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PNG, JPG o WebP"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

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

router.post("/settings", ensureAuth, upload.single("profilePhoto"), async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      req.flash("error", "El nombre no puede estar vacío");
      return res.redirect("/settings");
    }

    const updateData = { name: name.trim() };

    // Handle photo upload
    if (req.file) {
      // Delete old photo if exists
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      if (user.profilePhoto) {
        const oldPath = path.join(__dirname, "../..", "public", user.profilePhoto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.profilePhoto = `/uploads/${req.file.filename}`;
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    req.flash("success", "Perfil actualizado");
    res.redirect("/settings");
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

export default router;
