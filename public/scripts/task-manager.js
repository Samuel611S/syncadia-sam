export default class TaskManager {
    async updateTask(id, fieldName, fieldValue) {
        const url = `http://localhost:3000/tasks/${id}`;
        try {
            const response = await fetch(url, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ [fieldName]: fieldValue }) 
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Success:', data.message); 
            } else {
                console.error('Error:', data.error); 
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    #updateTaskIndicator(progress, status) {
        const indicator = document.getElementById(`${status}-indicator`);
        const progressCircle = indicator.querySelector('.progress-circle');
        const circle = indicator.querySelector('.progress-circle .circle');
        const percentage = indicator.querySelector('.progress-circle .percentage');

        progressCircle.setAttribute('data-percentage', progress);
        circle.setAttribute('stroke-dasharray', progress);
        percentage.textContent = progress + '%';
    }

    #TASK_STATUSES = [
        'TODO',
        'IN-PROGRESS',
        'DONE'
    ]

    #calculateProgress(status, numberOfAllTasks) {
        const tasksWithStatus = document.querySelectorAll(`.task-card-column-${status} .card`);
        const numberOfTasksWithStatus = tasksWithStatus ? tasksWithStatus.length : 1;

        return Math.round(numberOfTasksWithStatus / numberOfAllTasks * 100);
    }

    updateTasksProgressIndicators() {
        const tasks = document.getElementsByClassName('task-card');
        const numberOfTasks = tasks ? tasks.length : 1;

        this.#TASK_STATUSES.forEach(status => {
            const progress = this.#calculateProgress(status, numberOfTasks);
            this.#updateTaskIndicator(progress, status)
        })
    }
}
