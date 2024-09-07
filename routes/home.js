/**
 * home.js
 * These are example routes for task management
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
 *
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define the authentication middleware
const authentication = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.redirect('/Signup'); // Redirect to signup if no token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.redirect('/Signup'); // Redirect to signup if token is invalid
    req.user = user;
    next();
  });
};

// Define the route to render the home page
router.get("/home", authentication, (req, res) => {
  const userId = req.user.id; // Get user ID from the JWT token

  const query = 'SELECT name FROM users WHERE id = ?';
  global.db.get(query, [userId], function(err, row) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).render('home', { error: 'Server error' });
    }

    if (row) {
      res.render('home', { userName: row.name }); // Pass 'userName' to the view
    } else {
      res.render('home', { userName: null }); // Pass null if user not found
    }
  });
});

// Root route redirects to the home page
router.get("/", (req, res) => {
  res.redirect("/home");
});

// Export the router object so index.js can access it
module.exports = router;
