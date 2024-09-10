// TaskManager class to handle update,create and delete
class TaskManager {
    static async updateTask(id, fields) {
        const url = `http://localhost:3000/tasks/${id}`; 
        try {
            // Send a PUT request to update the task
            const response = await fetch(url, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(fields) 
            });

            const data = await response.json(); 

            if (response.ok) {
                console.log('Success:', data.message); 
                return true; 
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        return false; 
    }

    // Creating a new task with specified fields
    static async createTask(fields) {
        const url = `http://localhost:3000/tasks`; 
        try {
            // POST request to create a new task
            const response = await fetch(url, {
                method: 'POST', // POST for creating a new task
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(fields) 
            });

            const data = await response.json();

            if (response.ok) { 
                return data.taskId;
            } else {
                console.error('Error:', data.error); 
            }
        } catch (error) {
            console.error('Error:', error); 
        }

        return false; 
    }

    // Delete a task by its ID
    static async deleteTask(id) {
        const url = `http://localhost:3000/tasks/${id}`;
        try {
            //DELETE request to delete the task
            const response = await fetch(url, {
                method: 'DELETE', //DELETE for deleting the task
            });

            const data = await response.json(); 

            if (response.ok) { 
                return true; 
            } else {
                console.error('Error:', data.error); 
            }
        } catch (error) {
            console.error('Error:', error); 
        }

        return false; 
    }

    //Updating the task progress indicator
    static #updateTaskIndicator(progress, status) {
        const indicator = document.getElementById(`${status}-indicator`); 
        const progressCircle = indicator.querySelector('.progress-circle'); 
        const circle = indicator.querySelector('.progress-circle .circle'); 
        const percentage = indicator.querySelector('.progress-circle .percentage'); 

        // Updating percentage 
        progressCircle.setAttribute('data-percentage', progress);
        circle.setAttribute('stroke-dasharray', progress);
        percentage.textContent = progress + '%'; 
    }

    // Private constant array for task statuses
    static #TASK_STATUSES = [
        'TODO',        //  tasks to be done
        'IN-PROGRESS', //  tasks in progress
        'DONE'         //  completed tasks
    ]

    // Calculating progress for a given task status
    static #calculateProgress(status, numberOfAllTasks) {
        // Get all tasks with the given status
        const tasksWithStatus = document.querySelectorAll(`.task-card-column-${status} .card`);
        const numberOfTasksWithStatus = tasksWithStatus ? tasksWithStatus.length : 1; 

        // Calculation of the progress percentage
        return Math.round(numberOfTasksWithStatus / numberOfAllTasks * 100);
    }

    static updateTasksProgressIndicators() {
        const tasks = document.getElementsByClassName('task-card'); 
        const numberOfTasks = tasks ? tasks.length : 1; 

        // Loop through each task status and update its progress indicator
        TaskManager.#TASK_STATUSES.forEach(status => {
            const progress = TaskManager.#calculateProgress(status, numberOfTasks); 
            TaskManager.#updateTaskIndicator(progress, status); 
        });
    }
}
window.TaskManager = TaskManager;
