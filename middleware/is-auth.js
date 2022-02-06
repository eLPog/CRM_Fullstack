/*
We check if there is a session, if not, redirect to the home page
 */
function isAuth(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  }
  next();
}
module.exports = {
  isAuth,
};
