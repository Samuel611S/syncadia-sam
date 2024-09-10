//Storing the currently dragged card
var draggedItem = null; 

document.addEventListener('DOMContentLoaded', function () {
    // Selecting all columns
    const columns = document.querySelectorAll('.card-column'); 

    // Adding drag event listeners to all cards
    document.querySelectorAll('.card').forEach(card => {
        // Dragging starts
        card.addEventListener('dragstart', function () {
            // Storing the dragged card
            draggedItem = card; 
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });

        // Dragging ends
        card.addEventListener('dragend', function () {
            setTimeout(() => {
                draggedItem.style.display = 'block'; 
                draggedItem = null;
            }, 0);
        });
    });

    // Event listeners for drag-and-drop functionality to all columns
    columns.forEach(column => {
        // Cards being dragged over the column
        column.addEventListener('dragover', function (e) {
            e.preventDefault(); 
        });

        // Dragged card enters a column
        column.addEventListener('dragenter', function (e) {
            e.preventDefault(); 
            // Highlighting column on drag enter
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; 
        });

        // Dragged card leaves the column
        column.addEventListener('dragleave', function () {
            this.style.backgroundColor = 'transparent'; 
        });

        // Card dropped into a column
        column.addEventListener('drop', function (e) {
            e.preventDefault(); 
            this.style.backgroundColor = 'transparent'; 

            if (draggedItem) { 
                // Moving the card to the new column
                this.appendChild(draggedItem); 
                draggedItem.style.display = 'block'; 

                // New status from column ID
                const status = this.id.replace('-column', '').toUpperCase(); 
                // task ID from the card
                const taskId = draggedItem.getAttribute('data-task-id'); 
                // task ID and new status
                console.log('Task ID:', taskId, 'New Status:', status); 

                // Updating the task's status and progress indicators
                TaskManager.updateTask(taskId, { status });
                TaskManager.updateTasksProgressIndicators();
                // Updating the progress bar
                updateProgressBar(); 
            }
        });
    });
});
