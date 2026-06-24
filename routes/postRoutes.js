const express = require('express');
const router = express.Router();

// Import posts controller logic
const postController = require('../controllers/postController');

// Import authentication check middleware
const { ensureAuthenticated } = require('../middleware/auth');

// --- Feed Routes ---
// GET: Show the main feed with all user posts
router.get('/feed', ensureAuthenticated, postController.getFeed);

// --- Create Post Routes ---
// GET: Render the create post template
router.get('/posts/create', ensureAuthenticated, postController.getCreatePost);
// POST: Submit a new text post to the database
router.post('/posts/create', ensureAuthenticated, postController.postCreatePost);

// --- Likes Endpoint ---
// POST: API endpoint to toggle a like on a post (returns JSON)
router.post('/posts/:id/like', ensureAuthenticated, postController.postToggleLike);

// Export router object
module.exports = router;
