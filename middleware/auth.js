/**
 * Middleware functions to protect routes based on user session status.
 */

// Guard to ensure a user is logged in
// If not logged in, redirect them to the login page
const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Session is valid, proceed to the next handler/middleware
    return next();
  }
  // User is not authenticated, redirect to login page
  res.redirect('/login');
};

// Guard to prevent logged-in users from visiting login/register forms
// If logged in, redirect them directly to the social feed
const ensureGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/feed');
  }
  // User is a guest, proceed to login/register views
  next();
};

// Export middleware functions
module.exports = {
  ensureAuthenticated,
  ensureGuest
};
