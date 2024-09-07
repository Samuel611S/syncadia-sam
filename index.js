/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Add all the route handlers in taskRoutes to the app under the path /tasks
const taskRoutes = require('./routes/tasks');
app.use('/', taskRoutes);

// Add all the route handlers in taskRoutes to the app under the path /tasks
const usersRoute = require('./routes/users');
app.use('/', usersRoute);


// Add all the route handlers in taskRoutes to the app under the path /tasks
const authRoute = require('./routes/auth');
app.use('/', authRoute);


// Add all the route handlers in taskRoutes to the app under the path /tasks
const featuresRoute = require('./routes/features');
app.use('/', featuresRoute);


// Add all the route handlers in taskRoutes to the app under the path /tasks
const projectsRoute = require('./routes/projects');
app.use('/', projectsRoute);


// Add all the route handlers in taskRoutes to the app under the path /tasks
const homeRoute = require('./routes/home');
app.use('/', homeRoute);


// Add all the route handlers in taskRoutes to the app under the path /tasks
const quizRoute = require('./routes/quiz');
app.use('/', quizRoute);

// Add all the route handlers in taskRoutes to the app under the path /tasks
const feedbackRoute = require('./routes/feedback');
app.use('/', feedbackRoute);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

