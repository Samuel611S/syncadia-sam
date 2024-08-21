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
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN('TODO', 'IN-PROGRESS', 'COMPLETE')),
    due_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);


-- 3. Projects Table
CREATE TABLE IF NOT EXISTS Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 4. Notes Table
CREATE TABLE IF NOT EXISTS Notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- 5. Teams Table
CREATE TABLE IF NOT EXISTS Teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 6. Team Members Table
CREATE TABLE IF NOT EXISTS TeamMembers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    user_id INT,
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 7. Deleted Notes Table
CREATE TABLE IF NOT EXISTS Deleted_Notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    note_id INT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (note_id) REFERENCES Notes(id)
);

-- 8. Progress Table
CREATE TABLE IF NOT EXISTS Progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    in_progress_percentage INT,
    complete_percentage INT,
    collaboration_percentage INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- 9. Features Table
CREATE TABLE IF NOT EXISTS Features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version TEXT NOT NULL CHECK(version IN ('Free', 'Pro'))
);

-- 10. Feedback Table
CREATE TABLE IF NOT EXISTS Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 11. Quiz Results Table
CREATE TABLE IF NOT EXISTS QuizResults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    result VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Setup tasks
INSERT INTO Tasks (content, status) VALUES ('this is my task content', 'TODO'); 
INSERT INTO Tasks (content, status) VALUES ('this is my task content', 'IN-PROGRESS'); 
INSERT INTO Tasks (content, status) VALUES ('this is my task content', 'COMPLETE');


COMMIT;

