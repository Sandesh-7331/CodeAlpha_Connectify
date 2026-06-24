// Import mongoose for Schema creation
const mongoose = require('mongoose');

// Define Post Schema structure
const postSchema = new mongoose.Schema({
  // The message or content of the post
  content: {
    type: String,
    required: [true, 'Post content cannot be empty'],
    trim: true,
    maxlength: [500, 'Post content cannot exceed 500 characters']
  },
  // Reference to the User who created the post
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Array of User IDs who have liked this post
  // This lets us count likes (likes.length) and check if a specific user already liked it
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // Timestamp when the post was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compile and export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
