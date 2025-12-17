import express from "express";
import passport, { bcrypt } from "../auth.js";
import prisma from "../prisma.js";

const router = express.Router();

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const redirectTo = req.session.returnTo || "/dashboard";
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
);

// Local Auth - Register
router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("auth/register", { csrfToken: req.csrfToken() });
});

router.post("/register", async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  // Validation
  if (!email || !name || !password || !passwordConfirm) {
    req.flash("error", "Por favor completa todos los campos");
    return res.redirect("/register");
  }

  if (password !== passwordConfirm) {
    req.flash("error", "Las contraseñas no coinciden");
    return res.redirect("/register");
  }

  if (password.length < 6) {
    req.flash("error", "La contraseña debe tener al menos 6 caracteres");
    return res.redirect("/register");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      req.flash("error", "Este email ya está registrado");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "¡Cuenta creada y sesión iniciada correctamente!");
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error al crear la cuenta");
    res.redirect("/register");
  }
});

// Local Auth - Login
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("auth/login", { csrfToken: req.csrfToken() });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "¡Bienvenido!");
    const redirectTo = req.session.returnTo || "/dashboard";
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

export default router;
