let editTaskModal;

function getCardInfo(id) {
    const taskCard = document.getElementById(`task-card-${id}`);
    const cardTitle = taskCard.querySelector('.card-title');
    const cardContent = taskCard.querySelector('.card-text');

    return { cardTitle, cardContent };
}

function openEditModal(id) {
    if (id) {
        document.getElementById('taskId').value = id;
        const { cardTitle, cardContent } = getCardInfo(id);
        
        document.getElementById('taskTitle').value = cardTitle.textContent;
        document.getElementById('taskContent').value = cardContent.textContent;

        const taskPriority = document.querySelector(`#task-card-${id} .badge`).getAttribute('data-priority');
        document.getElementById('taskPriority').value = taskPriority;
    } else {
        document.getElementById('editTaskModalLabel').textContent = 'Create Task';
        document.getElementById('taskId').value = '';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskContent').value = '';
        document.getElementById('taskPriority').value = 'main';  // Default to primary
    }

    editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    editTaskModal.show();
}

function deleteTask(id) {
    const result = TaskManager.deleteTask(id);
    if (result) {
        const task = document.getElementById(`task-card-${id}`);
        if (task) {
            task.remove();
        }
    }
}

async function updateOrCreateTask() {
    try {
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value;
        const content = document.getElementById('taskContent').value;
        const priority = document.getElementById('taskPriority').value || 'main'; // Default to 'primary'

        if (id) {
            const success = await TaskManager.updateTask(id, { title, content, priority });
            if (success) {
                const { cardTitle, cardContent } = getCardInfo(id);
    
                if (cardTitle && cardContent) {
                    cardTitle.textContent = title;
                    cardContent.textContent = content;
                    const badge = document.querySelector(`#task-card-${id} .badge`);
                    badge.className = `badge rounded-pill bg-${priority}`;
                    badge.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
                }
            }
        } else {
            const taskId = await TaskManager.createTask({ title, content, priority });
            if (taskId) {
                const todoColumn = document.getElementById('TODO-column');
                const card = `
                    <div class="card task-card" id="task-card-${taskId}" draggable="true" data-task-id="${taskId}" onclick="openEditModal('${taskId}', '${title}', '${content}')">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <div class="card-text">${content}</div>
                            <span class="badge rounded-pill bg-${priority}" data-priority="${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                        </div>
                        <button class="btn btn-danger btn-sm delete-task-btn" onclick="event.stopPropagation(); deleteTask('${taskId}', event)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
                                <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
                            </svg>
                        </button>
                    </div>
                `;
                todoColumn.insertAdjacentHTML('beforeend', card);
            }
        }
    } catch (error) {
        console.log(`Could not update task: ${error.message}`);
    }

    closeEditModal();
}

function closeEditModal() {
    if (editTaskModal)
        editTaskModal.hide()
}


class TaskEditingModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
                        </div>
                        <div class="modal-body">
                            <form id="editTaskForm">
                                <div class="mb-3">
                                    <label for="taskTitle" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="taskTitle">
                                </div>
                                <div class="mb-3">
                                    <label for="taskContent" class="form-label">Content</label>
                                    <textarea class="form-control" id="taskContent" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="taskPriority" class="form-label">Priority</label>
                                    <select class="form-select" id="taskPriority">
                                        <option value="Main" class="badge rounded-pill bg-primary text-white">Main</option>
                                        <option value="Side" class="badge rounded-pill bg-secondary text-white">Side</option>
                                        <option value="Critical" class="badge rounded-pill bg-danger text-white">Critical</option>
                                        </select>
                                </div>
                                <input type="hidden" id="taskId">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="closeEditModal()">Close</button>
                            <button type="button" class="btn btn-primary" id="saveTaskChanges" onclick="updateOrCreateTask()">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('task-editing-modal', TaskEditingModal);