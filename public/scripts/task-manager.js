class TaskManager {
    static async updateTask(id, fields) {
        const url = `http://localhost:3000/tasks/${id}`;
        try {
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

    static async createTask(fields) {
        const url = `http://localhost:3000/tasks`;
        try {
            const response = await fetch(url, {
                method: 'POST', 
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

    static async deleteTask(id) {
        const url = `http://localhost:3000/tasks/${id}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE', 
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

    static #updateTaskIndicator(progress, status) {
        const indicator = document.getElementById(`${status}-indicator`);
        const progressCircle = indicator.querySelector('.progress-circle');
        const circle = indicator.querySelector('.progress-circle .circle');
        const percentage = indicator.querySelector('.progress-circle .percentage');

        progressCircle.setAttribute('data-percentage', progress);
        circle.setAttribute('stroke-dasharray', progress);
        percentage.textContent = progress + '%';
    }

    static #TASK_STATUSES = [
        'TODO',
        'IN-PROGRESS',
        'DONE'
    ]

    static #calculateProgress(status, numberOfAllTasks) {
        const tasksWithStatus = document.querySelectorAll(`.task-card-column-${status} .card`);
        const numberOfTasksWithStatus = tasksWithStatus ? tasksWithStatus.length : 1;

        return Math.round(numberOfTasksWithStatus / numberOfAllTasks * 100);
    }

    static updateTasksProgressIndicators() {
        const tasks = document.getElementsByClassName('task-card');
        const numberOfTasks = tasks ? tasks.length : 1;

        TaskManager.#TASK_STATUSES.forEach(status => {
            const progress = TaskManager.#calculateProgress(status, numberOfTasks);
            TaskManager.#updateTaskIndicator(progress, status)
        })
    }
}

window.TaskManager = TaskManager;