const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

//Middleware authentication 
const authentication = (req, res, next) => {
  const token = req.cookies.auth_token;

  // If no token, allow access as a guest user in certain pages
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

// Render the home page
router.get("/home", authentication, (req, res) => {
  // If user is authenticated, their info is fetched from the database
  if (req.user) {
    const userId = req.user.id; 

    const query = 'SELECT name FROM users WHERE id = ?';
    global.db.get(query, [userId], function (err, row) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).render('home', { error: 'Server error', userName: null });
      }

      if (row) {
        res.render('home', { userName: row.name }); 
      } else {
        res.render('home', { userName: null }); 
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
module.exports = router;
