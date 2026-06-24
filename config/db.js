// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Function to establish connection with the database
const connectDB = async () => {
  try {
    // Retrieve connection string from environment variables
    const dbURI = process.env.MONGODB_URI;
    
    // Connect mongoose using standard settings
    await mongoose.connect(dbURI);
    
    console.log('MongoDB connected successfully to local database.');
  } catch (error) {
    console.error('Database connection error occurred:', error.message);
    // Exit process with failure code if connection fails
    process.exit(1);
  }
};

// Export the connectDB function so it can be called in app.js
module.exports = connectDB;
