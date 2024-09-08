    // Character counter for the description field
    document.getElementById('description').addEventListener('input', function () {
        const charCount = this.value.length;
        document.getElementById('charCount').textContent = charCount;
      });
  
      // Add new task dynamically
      let taskCount = 1;
      document.getElementById('addTaskBtn').addEventListener('click', function () {
        taskCount++;
        const taskContainer = document.getElementById('task-container');
        
        // New task form to be added dynamically
        const newTaskForm = `
          <div class="task-form">
            <div class="form-group">
              <label for="task_title_${taskCount}">Task Title:</label>
              <input type="text" class="form-control" id="task_title_${taskCount}" name="tasks[${taskCount - 1}][title]" placeholder="Enter task title">
            </div>
            <div class="form-group">
              <label for="task_content_${taskCount}">Task Content:</label>
              <textarea class="form-control" id="task_content_${taskCount}" name="tasks[${taskCount - 1}][content]" rows="2" placeholder="Task details"></textarea>
            </div>
            <div class="form-group">
              <label for="task_status_${taskCount}">Task Status:</label>
              <select class="form-control" id="task_status_${taskCount}" name="tasks[${taskCount - 1}][status]">
                <option value="TODO">TODO</option>
                <option value="IN-PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div class="form-group">
              <label for="task_due_date_${taskCount}">Task Due Date:</label>
              <input type="date" class="form-control" id="task_due_date_${taskCount}" name="tasks[${taskCount - 1}][due_date]">
            </div>
          </div>`;
  
        // Insert the new task form into the DOM
        taskContainer.insertAdjacentHTML('beforeend', newTaskForm);
      });