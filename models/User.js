// Import mongoose to build the Schema
const mongoose = require('mongoose');

// Define User Schema structure
const userSchema = new mongoose.Schema({
  // Unique nickname or handle for the user
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  // Unique email address for registration and login
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    trim: true,
    lowercase: true
  },
  // Hashed password for security
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // Timestamp of account creation
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Compile and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
