class NotepadModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="modal fade" id="notepadModal" tabindex="-1" aria-labelledby="notepadModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="notepadModalLabel">Write your notes here!</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="toolbar mb-2">
                            <button class="btn btn-sm btn-light" onclick="execCommand('bold')"><b>B</b></button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('italic')"><i>I</i></button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('underline')"><u>U</u></button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('strikeThrough')"><s>S</s></button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('justifyLeft')">Left</button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('justifyCenter')">Center</button>
                            <button class="btn btn-sm btn-light" onclick="execCommand('justifyRight')">Right</button>
                
                        </div>
                        <div id="notepadContent" class="border p-3" contenteditable="true" style="height: 300px; width: 100%; max-width: 600px; margin: auto; overflow-y: auto;">
                            <!-- User can write notes here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('notepad-modal', NotepadModal);