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

router.get('/', (req, res) => {
    const sql = "SELECT * FROM Tasks";
    global.db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database error");
        } else {
            const totalTasks = rows.length;
            const todoTasks = rows.filter(task => task.status === 'TODO').length;
            const inProgressTasks = rows.filter(task => task.status === 'IN-PROGRESS').length;
            const completedTasks = rows.filter(task => task.status === 'COMPLETE').length;

            const progress = {
                todo: totalTasks ? (todoTasks / totalTasks) * 100 : 0,
                inProgress: totalTasks ? (inProgressTasks / totalTasks) * 100 : 0,
                completed: totalTasks ? (completedTasks / totalTasks) * 100 : 0
            };


            res.render('task-manager', { tasks: rows, progress });
        }
    });
});



router.get('/home', (req,res)=>{
    res.render('home')
})

router.get('/quiz', (req,res)=>{
    res.render('quiz')
});
router.get('/features', (req,res)=>{
    res.render('features')
})
router.get('/task-manager',(req,res)=>{
    res.redirect('/')
})
/**
 * @desc Displays a page with a form for creating a user record
 */
router.get("/add-user", (req, res) => {
    res.render("add-user", );
});

/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {
    // Define the query and parameters
    const query = "INSERT INTO Users (user_name, email, password) VALUES (?, ?, ?)"; // Ensure all required fields are included
    const queryParameters = [req.body.user_name, req.body.email, req.body.password]; // Adjust based on form fields
    
    // Execute the query and send a confirmation message
    global.db.run(query, queryParameters, function (err) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            res.send(`New user added with ID ${this.lastID}!`);
        }
    });
});
// Export the router object so index.js can access it
module.exports = router;
