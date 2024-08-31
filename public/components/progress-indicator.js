class ProgressIndicator extends HTMLElement {
// Note: probably should import it from task-column or rename them directly in db to avoid mappers
  #TypeToLabelMapper = {
    TODO: "To-Do",
    "IN-PROGRESS": "In-Progress",
    DONE: "Done",
  };
  connectedCallback() {
    const column = this.getAttribute("column") || "TODO";
    const label = this.#TypeToLabelMapper[column];
    const progress = this.getAttribute("progress") || 0;

    this.innerHTML = `
             <div id="${column}-indicator">
                        <h5>${label}</h5>
                        <div class="progress-circle" data-percentage="${progress}">
                            <div class="circle">
                                <svg viewBox="0 0 36 36" class="circular-chart pink">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path class="circle" stroke-dasharray="${progress}>, 100" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <text x="18" y="20.35" class="percentage">${Math.round(
                                      progress
                                    )}%</text>
                                </svg>
                            </div>
                        </div>
                    </div>
        `;
  }
}

customElements.define("progress-indicator", ProgressIndicator);
