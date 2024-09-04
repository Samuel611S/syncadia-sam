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

// Render new project form
router.get("/projects/new", (req, res) => {
  res.render("new-project");
});

// Route to handle the creation of a new project
router.post("/projects", (req, res) => {
  const { name, description } = req.body;
  const query =
    "INSERT INTO Projects (name, description, user_id) VALUES (?, ?, ?)";

  const userId = 1; // Use a dummy user_id for now

  global.db.run(query, [name, description, userId], function (err) {
    if (err) {
      console.error("Error inserting project:", err.message);
      return res.status(500).send("Server Error");
    }
    res.redirect("/projects");
  });
});

// Display new projects
router.get("/projects", (req, res) => {
  const query = "SELECT * FROM Projects";
  global.db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
    res.render("projects", { projects: rows });
  });
});

// Route to update the project
router.post("/projects/update", (req, res) => {
  const { project_id, name, description } = req.body;

  const sql = "UPDATE Projects SET name = ?, description = ? WHERE id = ?";
  global.db.run(sql, [name, description, project_id], (err) => {
    if (err) {
      console.error("Error updating project:", err.message);
      return res.status(500).send("Server Error");
    }

    res.redirect("/projects");
  });
});

// Export the router object so index.js can access it
module.exports = router;
