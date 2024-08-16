
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    task_status TEXT NOT NULL CHECK (task_status IN ('TODO', 'IN-PROGRESS', 'COMPLETE'))
);

-- Insert default data (if necessary here)

-- Setup tasks
INSERT INTO tasks ('content', 'task_status') VALUES ('this is my task content', 'TODO'); 
INSERT INTO tasks ('content', 'task_status') VALUES ('this is my task content', 'IN-PROGRESS'); 
INSERT INTO tasks ('content', 'task_status') VALUES ('this is my task content', 'COMPLETE'); 

COMMIT;

