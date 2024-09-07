/**
 * projects.js
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


router.get("/projects/new", authentication, (req, res) => {
  res.render("new-project");
});



router.post('/projects', authentication, async (req, res) => {
  const { name, description, deadline, tasks } = req.body;

  try {
    // Insert the project first
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Projects (user_id, name, description, deadline)
        VALUES (?, ?, ?, ?)
      `
      global.db.run(query, [req.user.id, name, description, deadline], function (err) {
        if (err) reject(err);
        resolve(this);
      });
    });

    const projectId = result.lastID;

    // Filter out empty tasks
    const validTasks = (tasks || []).filter(task => task.title && task.status);

    // Insert each valid task associated with the project
    if (validTasks.length > 0) {
      await Promise.all(validTasks.map(task => {
        return new Promise((resolve, reject) => {
          const query = `
            INSERT INTO Tasks (project_id, title, content, status, due_date)
            VALUES (?, ?, ?, ?, ?)
          `
          global.db.run(query, [projectId, task.title, task.content, task.status, task.due_date], function (err) {
            if (err) reject(err);
            resolve();
          });
        });
      }));
    }

    res.redirect('/projects');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating project and tasks');
  }
});

// Display projects with tasks
router.get("/projects", authentication, async (req, res) => {
  try {
    const projects = await new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, t.title as task_title, t.status as task_status, t.due_date as task_due_date
        FROM Projects p
        LEFT JOIN Tasks t ON p.id = t.project_id
        WHERE p.user_id = ?
        ORDER BY p.deadline ASC
      `
      global.db.all(query, [req.user.id], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    // Group tasks under each project
    const projectsWithTasks = projects.reduce((acc, row) => {
      const project = acc.find(p => p.id === row.id);
      if (project) {
        project.tasks.push({
          title: row.task_title,
          status: row.task_status,
          due_date: row.task_due_date
        });
      } else {
        acc.push({
          id: row.id,
          name: row.name,
          description: row.description,
          deadline: row.deadline,
          tasks: row.task_title ? [{
            title: row.task_title,
            status: row.task_status,
            due_date: row.task_due_date
          }] : [] // No task yet
        });
      }
      return acc;
    }, []);

    res.render('projects', { projects: projectsWithTasks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Render edit project form
router.get('/projects/:id/edit', authentication, (req, res) => {
  const projectId = req.params.id;
  const projectQuery = "SELECT * FROM Projects WHERE id = ?";
  
  global.db.get(projectQuery, [projectId], (err, project) => {
    if (err) {
      console.log(err.message);
      res.status(500).send("Error fetching project details");
    } else {
      const taskQuery = "SELECT * FROM Tasks WHERE project_id = ?";
      global.db.all(taskQuery, [projectId], (err, tasks) => {
        if (err) {
          console.log(err.message);
          res.status(500).send("Error fetching tasks");
        } else {
          res.render('edit', { project, tasks });
        }
      });
    }
  });
});

// Handle project update
router.post("/projects/:id/edit", authentication, (req, res) => {
  const projectId = req.params.id;
  const { name, description, deadline, tasks } = req.body;
  const query = "UPDATE Projects SET name = ?, description = ?, deadline = ? WHERE id = ?";
  
  global.db.run(query, [name, description, deadline, projectId], async (err) => {
    if (err) {
      console.log(err.message);
      res.status(500).send("Error updating project");
    } else {
      try {
        // Delete existing tasks for the project
        await new Promise((resolve, reject) => {
          const deleteQuery = "DELETE FROM Tasks WHERE project_id = ?";
          global.db.run(deleteQuery, [projectId], (err) => {
            if (err) reject(err);
            resolve();
          });
        });

        // Insert new tasks
        const validTasks = (tasks || []).filter(task => task.title && task.status);
        if (validTasks.length > 0) {
          await Promise.all(validTasks.map(task => {
            return new Promise((resolve, reject) => {
              const taskQuery = `
                INSERT INTO Tasks (project_id, title, content, status, due_date)
                VALUES (?, ?, ?, ?, ?)
              `;
              global.db.run(taskQuery, [projectId, task.title, task.content, task.status, task.due_date], (err) => {
                if (err) reject(err);
                resolve();
              });
            });
          }));
        }

        res.redirect('/projects');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating tasks');
      }
    }
  });
});


// Handle project deletion
router.post("/projects/:id/delete", authentication, (req, res) => {
  const projectId = req.params.id;
  const query = "DELETE FROM Tasks WHERE project_id = ?";
  // Delete tasks associated with the project first
  global.db.run(query, [projectId], (err) => {
    if (err) {
      console.error("Error deleting tasks:", err.message);
      return res.status(500).send("Server Error");
    }

    // Then delete the project
    const query2 = "DELETE FROM Projects WHERE id = ?";
    global.db.run(query2, [projectId], (err) => {
      if (err) {
        console.error("Error deleting project:", err.message);
        return res.status(500).send("Server Error");
      }
      res.redirect('/projects'); // Redirect back to the projects page
    });
  });
});


// Render new task form
router.get("/projects/:id/tasks/new", authentication, (req, res) => {
  const projectId = req.params.id;
  res.render("new-task", { projectId });
});

// Handle task creation
router.post("/projects/:id/tasks", authentication, (req, res) => {
  const projectId = req.params.id;  
  const { title, content, status, due_date } = req.body;
  const query = `
    INSERT INTO Tasks (project_id, title, content, status, due_date)
    VALUES (?, ?, ?, ?, ?)
  `
  global.db.run(query, [projectId, title, content, status, due_date], (err) => {
    if (err) {
      console.error("Error creating task:", err.message);
      return res.status(500).send("Server Error");
    }
    res.redirect(`/projects/${projectId}`);  // Redirect back to the project page
  });
});

// Export the router object so index.js can access it
module.exports = router;
