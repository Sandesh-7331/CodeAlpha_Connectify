/**
 * Connectify - Main Application Entry Point
 * This file boots the Express server, registers middleware, and establishes DB connection.
 */

// Load variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

// Import database connection configuration
const connectDB = require('./config/db');

// Import routers
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Create the Express Application instance
const app = express();

// Connect to MongoDB Database
connectDB();

// --- View Engine Setup ---
// Set EJS as the template rendering engine
app.set('view engine', 'ejs');
// Define where EJS templates are located
app.set('views', path.join(__dirname, 'views'));

// --- Middleware Setup ---
// Serve static files (CSS, JS, Images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (submitted via HTML Form tags)
app.use(express.urlencoded({ extended: true }));

// Configure Express Session store for secure cookie tracking
app.use(session({
  // The secret signature to encrypt session IDs in cookies (from .env)
  secret: process.env.SESSION_SECRET || 'fallback_student_project_secret',
  // Prevents rewriting session data back to the store if it wasn't modified
  resave: false,
  // Don't create cookies for guests until they login/register (saves resources)
  saveUninitialized: false,
  cookie: {
    // Cookie lifetime: 24 hours (in milliseconds)
    maxAge: 1000 * 60 * 60 * 24,
    // Helps mitigate XSS attacks by blocking client-side reading of session cookie
    httpOnly: true
  }
}));

// --- Global Variable Middleware ---
// Expose the current user session data to all EJS templates automatically
app.use((req, res, next) => {
  // res.locals makes variables available in all rendered views
  res.locals.currentUser = {
    id: req.session.userId,
    username: req.session.username
  };
  next();
});

// --- Routes Registration ---
// Redirect the root path ('/') directly to our social feed
app.get('/', (req, res) => {
  res.redirect('/feed');
});

// Attach authentication and user-management routes
app.use('/', authRoutes);

// Attach post feed and like manipulation routes
app.use('/', postRoutes);

// --- 404 Route Handler ---
// Catch-all route for URLs that don't match any registered route
app.use((req, res) => {
  res.status(404).render('login', { 
    errorMessage: 'Page not found! Please login or register to browse.',
    currentUser: null 
  });
});

// --- Start the Web Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started running at http://localhost:${PORT}`);
});
