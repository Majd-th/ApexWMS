export function requireLogin(req, res, next) {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/user/login");
  }
  next();
}
