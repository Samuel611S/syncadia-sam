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

  // If no token, allow access as a guest user
  if (!token) {
    req.user = null; // No authenticated user
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null; // Token is invalid, proceed as guest
      return next();
    }
    req.user = user; // Valid token, user is authenticated
    next();
  });
};

// Define the route to render the home page
router.get("/home", authentication, (req, res) => {
  // If user is authenticated, get their info from the database
  if (req.user) {
    const userId = req.user.id; // Get user ID from the JWT token

    const query = 'SELECT name FROM users WHERE id = ?';
    global.db.get(query, [userId], function (err, row) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).render('home', { error: 'Server error', userName: null });
      }

      if (row) {
        res.render('home', { userName: row.name }); // Pass 'userName' to the view
      } else {
        res.render('home', { userName: null }); // Pass null if user not found
      }
    });
  } else {
    // Render home page for unauthenticated guest users
    res.render('home', { userName: null });
  }
});

// Root route redirects to the home page
router.get("/", (req, res) => {
  res.redirect("/home");
});

// Export the router object so index.js can access it
module.exports = router;