class TaskColumn extends HTMLElement {
  #TypeToLabelMapper = {
    TODO: "To-Do",
    "IN-PROGRESS": "In-Progress",
    DONE: "Done",
  };

  #NO_TASKS_AVAILABLE = "<p>No tasks available.</p>";

  #constructTaskCard = (task) => {
    try {
      return `
            <div class="card task-card" draggable="true" data-task-id="${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <div class="card-text">${task.content}</div>
                </div>
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
                </div>
            `;
    } catch (error) {
      console.log(error);
      this.innerHTML = this.#NO_TASKS_AVAILABLE;
    }
  }
}

customElements.define("task-column", TaskColumn);
