function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You need to log in to perform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
  }