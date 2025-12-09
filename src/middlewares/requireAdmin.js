// src/middlewares/requireAdmin.js
export function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  // not logged in → send to login page
return res.redirect("/admin/login");
}
