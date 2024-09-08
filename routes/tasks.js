const express = require("express");
const router = express.Router(); 

router.get("/task-manager", (req, res) => {
  const sql = "SELECT * FROM Tasks"; // SQL query to fetch tasks
  global.db.all(sql, [], (err, rows) => { 
    if (err) {
      console.error(err); //Error log
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

      // Calculation of the percentage of each task status
      const progress = {
        todo: totalTasks ? (todoTasks / totalTasks) * 100 : 0,
        inProgress: totalTasks ? (inProgressTasks / totalTasks) * 100 : 0,
        completed: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      };

      res.render("task-manager", { tasks: rows, progress });
    }
  });
});

// Route to update a task by its ID
router.put("/tasks/:id", (req, res) => {
  const body = req.body; 
  const taskId = req.params.id;

  if (!taskId || Object.keys(body) === 0) {
    return res.status(400).json({ error: "Task ID and Body are required" });
  }

  const constructQueryUpdate = (body) => {
    const keys = Object.keys(body);
    const values = Object.values(body);

    return {
      statement: `UPDATE tasks SET ${keys
        .map((key) => key + " = ?")
        .join(", ")} WHERE id = ?`, 
      values,
    };
  };

  const { statement, values } = constructQueryUpdate(body); 
  const params = [...values, taskId]; 

  // Execute update query
  db.run(statement, params, (err) => {
    if (err) {
      console.error("Error updating task status:", err.message); // Error log
      return res.status(500).json({ error: "Internal server error" }); 
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" }); 
    }
    // Success message
    return res.status(200).json({ message: "Task status updated successfully" });
  });
});
// Route to create a new task
router.post("/tasks", (req, res) => {
  const body = req.body; // Extracting task data from request body

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Body is required" });
  }

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

  // Execute the insert query
  db.run(statement, params, function (err) {
    if (err) {
      console.error("Error creating task:", err.message); // Error log
      return res.status(500).json({ error: "Internal server error" }); 
    }

    // Success status
    return res.status(200).json({ success: true });
  });
});

// Route to delete a task by its ID
router.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id; 

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  const statement = "DELETE FROM tasks WHERE id = ?"; 

  // Execute the delete query
  db.run(statement, [taskId], function (err) {
    if (err) {
      console.error("Error deleting task:", err.message); // Error log
      return res.status(500).json({ error: "Internal server error" }); 
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" }); 
    }

    // Success message
    return res.status(200).json({ message: "Task deleted successfully" });
  });
});
// Export the router object so index.js can access it
module.exports = router;
