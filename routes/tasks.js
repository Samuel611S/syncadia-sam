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

/**
 * @desc Display all the tasks
 */


router.get('/Signup', (req, res) => {
  res.render('Signup'); // Ensure the file is named 'Signup.ejs' in your views directory
});

module.exports = router;
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

//deleted notes
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('open-deleted-notes').addEventListener('click', function () {
      const deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];
      const deletedNotesList = document.getElementById('deletedNotesList');
      deletedNotesList.innerHTML = ''; // Clear the list first

      if (deletedNotes.length === 0) {
          deletedNotesList.innerHTML = '<li class="list-group-item">No deleted notes available.</li>';
      } else {
          deletedNotes.forEach((note, index) => {
              const listItem = document.createElement('li');
              listItem.classList.add('list-group-item');
              listItem.innerHTML = `
                  <div>
                      <p>${note.content}</p>
                      <small class="text-muted">Deleted on: ${note.time}</small>
                      <button class="btn btn-sm btn-success mt-2" onclick="restoreNote(${index})">Restore</button>
                  </div>
              `;
              deletedNotesList.appendChild(listItem);
          });
      }

      $('#deletedNotesModal').modal('show');
  });
});

function restoreNote(index) {
  const deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];
  const noteToRestore = deletedNotes[index];

  if (noteToRestore) {
      // Restore the note content to the Notepad
      document.querySelector('#notepadContent').innerHTML = noteToRestore.content;
      localStorage.setItem('notepadContent', noteToRestore.content);

      // Remove the note from the deleted notes list
      deletedNotes.splice(index, 1);
      localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

      // Update the Deleted Notes modal
      document.getElementById('open-deleted-notes').click();

      // Notify the user
      alert('Note has been restored to the Notepad.');
  }
}

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
router.get("/quiz", (req, res) => {
  const query = "SELECT * FROM Quizzes";
  global.db.all(query, (err, questions) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching quiz questions");
    }
    res.render("quiz", { questions });
  });
});

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

/**
 * @desc Displays a page with a form for creating a user record
 */
router.get("/add-user", (req, res) => {
  res.render("add-user");
});

/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {
  // Define the query and parameters
  const query =
    "INSERT INTO Users (user_name, email, password) VALUES (?, ?, ?)"; // Ensure all required fields are included
  const queryParameters = [
    req.body.user_name,
    req.body.email,
    req.body.password,
  ]; // Adjust based on form fields

  // Execute the query and send a confirmation message
  global.db.run(query, queryParameters, function (err) {
    if (err) {
      next(err); // Send the error on to the error handler
    } else {
      res.send(`New user added with ID ${this.lastID}!`);
    }
  });
  
//priority 
document.getElementById('addTaskNoteForm').addEventListener('submit', function (e) {
  e.preventDefault();

  var title = document.getElementById('taskNoteTitle').value;
  var description = document.getElementById('taskNoteDescription').value;
  var selectedDate = document.getElementById('selectedDate').value;
  var priority = document.getElementById('taskNotePriority').value; // Capture priority

  // Add the event to the calendar
  calendar.addEvent({
      title: title,
      start: selectedDate,
      description: description,
      allDay: true,
      extendedProps: {
          priority: priority // Store the priority
      }
  });

  // Close modal and reset form
  $('#addTaskNoteModal').modal('hide');
  document.getElementById('addTaskNoteForm').reset();
});



  
});
// Export the router object so index.js can access it
module.exports = router;

