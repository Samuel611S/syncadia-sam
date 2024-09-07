DROP TABLE IF EXISTS Notes;
DROP TABLE IF EXISTS Feedbacks;
DROP TABLE IF EXISTS User_Quiz;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Tasks;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS TeamMembers;
DROP TABLE IF EXISTS QuizResults;
DROP TABLE IF EXISTS Deleted_Notes;

-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--2. Task table 
CREATE TABLE IF NOT EXISTS Tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN('TODO', 'IN-PROGRESS', 'DONE')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN('Main', 'Side', 'Critical')) DEFAULT 'Main',
    due_date DATE,
    tag VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);


-- 3. Projects Table
CREATE TABLE IF NOT EXISTS Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 4. Notes Table
CREATE TABLE IF NOT EXISTS Notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- 5. Teams Table
CREATE TABLE IF NOT EXISTS Teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 6. Team Members Table
CREATE TABLE IF NOT EXISTS TeamMembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 7. Deleted Notes Table
CREATE TABLE IF NOT EXISTS Deleted_Notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    note_id INTEGER,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (note_id) REFERENCES Notes(id)
);

-- 8. Progress Table
CREATE TABLE IF NOT EXISTS Progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    in_progress_percentage INTEGER,
    complete_percentage INTEGER,
    collaboration_percentage INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- 9. Features Table
CREATE TABLE IF NOT EXISTS Features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version TEXT NOT NULL CHECK(version IN ('Free', 'Pro'))
);

-- 10. Feedback Table
CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(255),
    email VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
 --11. Quiz Table 
CREATE TABLE IF NOT EXISTS Quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    option4 TEXT NOT NULL
);


-- 12. Quiz Results Table
CREATE TABLE IF NOT EXISTS QuizResults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    result VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


-- Setup tasks

INSERT INTO Tasks (title,content, status) VALUES ('title','this is my task content', 'TODO'); 
INSERT INTO Tasks (title, content, status) VALUES ('title','this is my task content', 'IN-PROGRESS'); 
INSERT INTO Tasks (title, content, status) VALUES ('title','this is my task content', 'DONE');

-- insert quiz questions
INSERT INTO Quizzes (question, option1, option2, option3, option4)
VALUES 
('How do you typically plan your day?','A. I create a detailed to-do list.','B. I have a general idea of what I want to accomplish.','C. I plan as I go.','D. I rarely plan my day'),
('What is your approach to handling large tasks?','A. Break them down into smaller tasks.','B. Tackle them all at once.','C. Delegate parts of the task to others.','D. Procrastinate until the last minute.'),
('How do you prioritize your tasks?','A. Based on deadlines.','B. By importance and urgency.','C. Whichever seems easiest to complete.','D. I don’t have a specific prioritization method'),
('How do you stay focused during work?','A. I minimize distractions and stay on task.','B. I take short breaks to stay refreshed.','C. I work in bursts of high productivity.','D. I struggle to stay focused.'),
('How do you handle unexpected interruptions?','A. I quickly address them and return to work.','B. I set aside time later to deal with them.','C. I try to multitask','D. They often derail my progress'),
('What is your preferred method of task management?','A. Using digital tools or apps.','B. Writing things down on paper.','C. Keeping track mentally.','D. I don’t use any specific method.'),
(' How do you deal with procrastination?','A. I use techniques like the Pomodoro Technique.','B. I set deadlines to push myself','C. I break tasks into smaller, manageable pieces.','D. I often struggle to overcome procrastination.'),
(' What time of day do you feel most productive?','A. Early morning.','B. Late morning.','C. Afternoon.','D. Evening or night.'),
('How do you track your progress on long-term projects?','A. I set milestones and track them regularly.','B. I review progress weekly','C. I track progress sporadically.','D. I don’t track progress regularly'),
('What motivates you to complete tasks?','A. The satisfaction of completing something.','B. External rewards or recognition.','C. The fear of missing deadlines.','D. I struggle with motivation.');
COMMIT;

