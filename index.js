const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public'));

// Setting up SQLite
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); 
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON");
    }
});

// Adding all the route handlers in taskRoutes to the app under the path /tasks
const homeRoute = require('./routes/home');
app.use('/', homeRoute);

const taskRoutes = require('./routes/tasks');
app.use('/', taskRoutes);

const usersRoute = require('./routes/users');
app.use('/', usersRoute);

const authRoute = require('./routes/auth');
app.use('/', authRoute);

const featuresRoute = require('./routes/features');
app.use('/', featuresRoute);

const projectsRoute = require('./routes/projects');
app.use('/', projectsRoute);

const quizRoute = require('./routes/quiz');
app.use('/', quizRoute);

const feedbackRoute = require('./routes/feedback');
app.use('/', feedbackRoute);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

