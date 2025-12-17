export function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect("/");
}

export function attachUserToLocals(req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.flash = req.flash ? req.flash() : {};
  next();
}
