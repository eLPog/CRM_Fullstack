/*
If a session exists, it is always passed to all queries. Thanks to this, we know if the user is logged in.
 */
function mainMiddleware(req, res, next) {
  // res.locals.errors = undefined;
  res.locals.user = req.session.user;
  next();
}

module.exports = { mainMiddleware };
