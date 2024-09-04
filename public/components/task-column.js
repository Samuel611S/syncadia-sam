class TaskColumn extends HTMLElement {
  #TypeToLabelMapper = {
    TODO: "To-Do",
    "IN-PROGRESS": "In-Progress",
    DONE: "Done",
  };

  #NO_TASKS_AVAILABLE = "<p>No tasks available.</p>";

  #constructTaskCard = (task) => {
    try {
      const priority = task.priority || 'primary'; // Default to 'primary' if undefined
      return `
        <div class="card task-card" id="task-card-${task.id}" draggable="true" data-task-id="${task.id}" onclick="openEditModal('${task.id}', '${task.title}', '${task.content}')">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <span class="badge badge-pill bg-${priority}" data-priority="${priority}">
              ${priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
            <div class="card-text">${task.content}</div>
          </div>
          <button class="btn btn-danger btn-sm delete-task-btn" onclick="event.stopPropagation(); deleteTask('${task.id}', event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
              <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
            </svg>
          </button>
        </div>
      `;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  #constructTaskCards = (tasks, type) => {
    try {
      return tasks
        .filter((task) => task.status === type)
        .map((task) => this.#constructTaskCard(task))
        .join("");
    } catch (error) {
      console.log(error);
      return this.#NO_TASKS_AVAILABLE;
    }
  };

  #addCreateTaskButton(type) {
    if (type === "TODO") {
      return `
        <button class="btn" onclick="openEditModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
          </svg>
        </button>
      `;
    } else return "";
  }

  connectedCallback() {
    try {
      const type = this.getAttribute("type") ?? "no type";
      const label = this.#TypeToLabelMapper[type];
      const tasks = JSON.parse(this.getAttribute("tasks"));

      this.innerHTML = `
        <div>
          <h5>${label}</h5>
          <div class="card-column task-card-column-${type}" id="${type}-column">
            ${this.#constructTaskCards(tasks, type)}
          </div>
          ${this.#addCreateTaskButton(type)}
        </div>
      `;
    } catch (error) {
      console.log(error);
      this.innerHTML = this.#NO_TASKS_AVAILABLE;
    }
  }
}

customElements.define("task-column", TaskColumn);
