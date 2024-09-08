//Project indicator
class ProgressIndicator extends HTMLElement {
  // Note: probably should import it from task-column or rename them directly in db to avoid mappers
  #TypeToLabelMapper = {
    TODO: "To-Do", // Mapping "TODO" column to "To-Do"
    "IN-PROGRESS": "In-Progress", // Mapping "IN-PROGRESS" column to "In-Progress"
    DONE: "DONE", // Mapping "DONE" column to "DONE"
  };
  connectedCallback() {
     // Retrieve the task column type from the element's "column" attribute, defaulting to "TODO"
    const column = this.getAttribute("column") || "TODO";
     // Map the column type to the user-friendly label using the #TypeToLabelMapper
    const label = this.#TypeToLabelMapper[column];
    // Retrieve the task progress percentage from the "progress" attribute, defaulting to 0
    const progress = this.getAttribute("progress") || 0;
    //inner HTML content
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
//Defining the 'progress-indicator' element to be recognized in DOM
customElements.define("progress-indicator", ProgressIndicator);
