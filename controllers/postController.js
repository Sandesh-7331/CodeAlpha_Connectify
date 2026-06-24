// Import Post and User models
const Post = require('../models/Post');

// Retrieves and displays all posts on the social feed
exports.getFeed = async (req, res) => {
  try {
    // Fetch all posts, sort by latest first, and populate the author info
    const allPosts = await Post.find()
      .populate('author', 'username') // Only load the username of the author
      .sort({ createdAt: -1 });

    // Render the feed view, passing posts data and active session info
    res.render('feed', {
      posts: allPosts,
      currentUser: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  } catch (error) {
    console.error('Error fetching social feed:', error);
    res.status(500).send('Server Error: Could not load feed.');
  }
};

// Renders the view to create a new post
exports.getCreatePost = (req, res) => {
  res.render('create', { 
    errorMessage: null,
    currentUser: {
      id: req.session.userId,
      username: req.session.username
    }
  });
};

// Handles form submission for creating a post
exports.postCreatePost = async (req, res) => {
  const { postText } = req.body;

  if (!postText || postText.trim() === '') {
    return res.render('create', {
      errorMessage: 'Post content cannot be empty!',
      currentUser: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  }

  try {
    // Create new Post instance associated with logged-in user
    const newPost = new Post({
      content: postText,
      author: req.session.userId
    });

    // Save post to database
    await newPost.save();

    // Redirect user back to the feed to see their new post
    res.redirect('/feed');
  } catch (error) {
    console.error('Error creating post:', error);
    res.render('create', {
      errorMessage: 'Could not submit your post. Please try again.',
      currentUser: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  }
};

// Handles dynamic liking/unliking of posts via AJAX (fetch) API
exports.postToggleLike = async (req, res) => {
  const postId = req.params.id;
  const loggedInUserId = req.session.userId;

  try {
    // Find post in DB
    const targetPost = await Post.findById(postId);
    if (!targetPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Check if user has already liked this post
    // Use findIndex with toString() because likedBy stores ObjectIds, not plain strings
    const userIndex = targetPost.likedBy.findIndex(id => id.toString() === String(loggedInUserId));
    let liked = false;

    if (userIndex === -1) {
      // User hasn't liked it yet: Add user ID to likes list (like)
      targetPost.likedBy.push(loggedInUserId);
      liked = true;
    } else {
      // User has already liked it: Remove user ID from list (unlike)
      targetPost.likedBy.splice(userIndex, 1);
      liked = false;
    }

    // Save changes to Database
    await targetPost.save();

    // Send back JSON response containing updated like count and state
    res.json({
      likesCount: targetPost.likedBy.length,
      liked: liked
    });

  } catch (error) {
    console.error('Error toggling post like:', error);
    res.status(500).json({ error: 'Failed to process like action.' });
  }
};
