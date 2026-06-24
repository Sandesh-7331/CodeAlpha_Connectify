// Import the User model to query the database
const User = require('../models/User');
// Import bcryptjs for hashing and comparing passwords
const bcrypt = require('bcryptjs');

// Renders the registration page
exports.getRegister = (req, res) => {
  // Pass an empty error message initially
  res.render('register', { errorMessage: null, successMessage: null });
};

// Handles form submission for new user registration
exports.postRegister = async (req, res) => {
  // Extract fields from post request body
  const { username, email, password, confirmPassword } = req.body;

  // Simple validation
  if (!username || !email || !password || !confirmPassword) {
    return res.render('register', { 
      errorMessage: 'All fields are required.', 
      successMessage: null 
    });
  }

  if (password !== confirmPassword) {
    return res.render('register', { 
      errorMessage: 'Passwords do not match.', 
      successMessage: null 
    });
  }

  if (password.length < 6) {
    return res.render('register', {
      errorMessage: 'Password should be at least 6 characters long.',
      successMessage: null
    });
  }

  try {
    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('register', { 
        errorMessage: 'Username or Email is already registered.', 
        successMessage: null 
      });
    }

    // Hash the password with bcrypt (strength factor 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new User to database
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Log the user in immediately by setting session fields
    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    // Redirect user to the feed page upon successful registration
    res.redirect('/feed');

  } catch (error) {
    console.error('Error during registration:', error);
    res.render('register', { 
      errorMessage: 'Something went wrong. Please try again.', 
      successMessage: null 
    });
  }
};

// Renders the login page
exports.getLogin = (req, res) => {
  res.render('login', { errorMessage: null });
};

// Handles login request
exports.postLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.render('login', { errorMessage: 'All fields are required.' });
  }

  try {
    // Find the user by email or by username
    const userFound = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    // If user is not found, return generic error to keep it secure
    if (!userFound) {
      return res.render('login', { errorMessage: 'Invalid login credentials.' });
    }

    // Compare entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
    if (!isPasswordCorrect) {
      return res.render('login', { errorMessage: 'Invalid login credentials.' });
    }

    // Password matches! Store session state to keep user logged in
    req.session.userId = userFound._id;
    req.session.username = userFound.username;

    // Redirect to home/feed
    res.redirect('/feed');

  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { errorMessage: 'An error occurred. Please try again.' });
  }
};

// Handles session destruction for logging out
exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session:', error);
      return res.redirect('/feed');
    }
    // Clear cookie and redirect to login page
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
