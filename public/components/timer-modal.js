// Timer Modal
class TimerModal extends HTMLElement {
    connectedCallback() {
        //Inner HTML
        this.innerHTML = `
            <div class="modal fade" id="timerModal" tabindex="-1" aria-labelledby="timerModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="timerModalLabel">Set Timer</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <label for="timerInput">Set timer in minutes:</label>
                            <input type="number" id="timerInput" class="form-control" placeholder="e.g., 30">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="start-timer">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}
//Defining the 'Timer-modal' element to be recognized in DOM
customElements.define('timer-modal', TimerModal);