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
const router = express.Router();

router.get("/feedback", (req, res) => {
  res.render("feedback");
});

router.post("/feedback", (req, res) => {
    const { name, email, content } = req.body;
    const query =
      "INSERT INTO Feedback (user_id, name, email,content) VALUES(?, ?, ?,?)";
    const userId = 1;
  
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
