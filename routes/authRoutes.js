const express = require('express');
const router = express.Router();

// Import authentication controller logic
const authController = require('../controllers/authController');

// Import authentication middleware route guards
const { ensureGuest } = require('../middleware/auth');

// --- Registration Routes ---
// GET: Show registration form
router.get('/register', ensureGuest, authController.getRegister);
// POST: Process registration form submission
router.post('/register', ensureGuest, authController.postRegister);

// --- Login Routes ---
// GET: Show login form
router.get('/login', ensureGuest, authController.getLogin);
// POST: Process login credentials
router.post('/login', ensureGuest, authController.postLogin);

// --- Logout Route ---
// GET: Log user out by destroying session
router.get('/logout', authController.logout);

// Export router object
module.exports = router;
