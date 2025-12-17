import express from "express";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import flash from "connect-flash";
import passport from "./auth.js";
import { config } from "./config.js";
import { attachUserToLocals } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import dashboardRoutes from "./routes/dashboard.js";
import settingsRoutes from "./routes/settings.js";
import pagesRoutes from "./routes/pages.js";
import { renderIcon, renderGroupIcon } from "./icons.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(attachUserToLocals);
app.use((req, res, next) => {
  res.locals.csrfToken = "csrf-disabled";
  res.locals.renderIcon = renderIcon;
  res.locals.renderGroupIcon = renderGroupIcon;
  next();
});

app.get("/", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return res.render("landing");
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(settingsRoutes);
app.use(groupRoutes);
app.use(pagesRoutes);

// 404 handler for non-existent routes
app.use((req, res) => {
  res.status(404).render("not-found");
});

// Error handler middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "EBADCSRFTOKEN" || err.message?.includes("csrf")) {
    return res.status(403).render("error", { message: "Token CSRF inválido" });
  }
  res
    .status(500)
    .render("error", { message: err.message || "Error inesperado" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
