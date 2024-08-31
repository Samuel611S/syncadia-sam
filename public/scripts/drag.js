import TaskManager from './task-manager.js';

document.addEventListener('DOMContentLoaded', function () {
    const columns = document.querySelectorAll('.card-column');
    let draggedItem = null;
    const taskManager = new TaskManager();

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', function () {
            draggedItem = card;
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });

        card.addEventListener('dragend', function () {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        column.addEventListener('dragenter', function (e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });

        column.addEventListener('dragleave', function () {
            this.style.backgroundColor = 'transparent';
        });

        column.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.backgroundColor = 'transparent';

            if (draggedItem) {
                this.appendChild(draggedItem);
                draggedItem.style.display = 'block';

                const newStatus = this.id.replace('-column', '').toUpperCase();
                const taskId = draggedItem.getAttribute('data-task-id');
                console.log('Task ID:', taskId, 'New Status:', newStatus);

                taskManager.updateTask(taskId, 'status', newStatus);
                taskManager.updateTasksProgressIndicators();
            }
        });
    });
});
