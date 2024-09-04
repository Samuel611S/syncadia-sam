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

router.get("/task-manager", (req, res) => {
  const sql = "SELECT * FROM Tasks";
  global.db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      const totalTasks = rows.length;
      const todoTasks = rows.filter((task) => task.status === "TODO").length;
      const inProgressTasks = rows.filter(
        (task) => task.status === "IN-PROGRESS"
      ).length;
      const completedTasks = rows.filter(
        (task) => task.status === "DONE"
      ).length;

      const progress = {
        todo: totalTasks ? (todoTasks / totalTasks) * 100 : 0,
        inProgress: totalTasks ? (inProgressTasks / totalTasks) * 100 : 0,
        completed: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      };

      res.render("task-manager", { tasks: rows, progress });
    }
  });
});

router.put("/tasks/:id", (req, res) => {
  const body = req.body;
  const taskId = req.params.id;

  if (!taskId || Object.keys(body) === 0) {
    return res.status(400).json({ error: "Task ID and Body are required" });
  }

  const costructQueryUpdate = (body) => {
    const keys = Object.keys(body);
    const values = Object.values(body);

    return {
      statement: `UPDATE tasks SET ${keys
        .map((key) => key + " = ?")
        .join(", ")} WHERE id = ?`,
      values,
    };
  };

  const { statement, values } = costructQueryUpdate(body);

  const params = [...values, taskId];

  db.run(statement, params, (err) => {
    if (err) {
      console.error("Error updating task status:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task status updated successfully" });
  });
});

router.post("/tasks", (req, res) => {
  const body = req.body;

  if (Object.keys(body) === 0) {
    return res.status(400).json({ error: "Body is required" });
  }

  // Construct the INSERT query
  const constructQueryInsert = (body) => {
    const keys = Object.keys(body);
    const values = Object.values(body);

    return {
      statement: `INSERT INTO tasks (${keys.join(", ")}, status) VALUES (${keys
        .map(() => "?")
        .join(", ")}, ?)`,
      values,
    };
  };

  const { statement, values } = constructQueryInsert(body);

  const params = [...values, "TODO"];

  db.run(statement, params, function (err) {
    if (err) {
      console.error("Error creating task status:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ taskId: this.lastID });
  });
});

router.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  const statement = "DELETE FROM tasks WHERE id = ?";

  db.run(statement, [taskId], function (err) {
    if (err) {
      console.error("Error deleting task:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  });
});

// Export the router object so index.js can access it
module.exports = router;

