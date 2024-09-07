/**
 * tasks.js
 * These are example routes for task management
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
 *
 */

const express = require("express");
const jwt =require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const router = express.Router();

const authentication = (req, res, next) => {
  const token = req.cookies.auth_token; // Extract the token from the cookie
  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Protect routes using the authentication middleware
router.get('/protected-endpoint', authentication, (req, res) => {
  res.send(`Welcome, user with ID: ${req.user.id}`);
});

router.get("/feedback", (req, res) => {
  res.render("feedback");
});

router.post("/feedback", authentication, async (req, res) => {
    const { name, email, content } = req.body;
    const query =
      "INSERT INTO Feedback (user_id, name, email,content) VALUES(?, ?, ?,?)";
    const userId = req.user.id;
  
    global.db.run(query, [userId, name, email, content], function (err) {
      if (err) {
        console.error("Error inserting feedback: ", err.message);
        return res.status(500).send("Server Error");
      }
      res.redirect("/task-manager");
    });
  });

// Export the router object so index.js can access it
module.exports = router;
