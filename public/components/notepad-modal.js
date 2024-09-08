// Notepad modal in the task manager page
class NotepadModal extends HTMLElement {
    connectedCallback() {
         //inner HTML content
        this.innerHTML = `
        <div class="modal fade" id="notepadModal" tabindex="-1" aria-labelledby="notepadModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header" style="background-color: #f5f5f5; border-bottom: 1px solid #ddd;">
                        <h5 class="modal-title" id="notepadModalLabel" style="color: #333;">Write Your Notes</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" style="color: #888;">&times;</span>
                        </button>
                    </div>
                    <!-- Modal Body -->
                    <div class="modal-body" style="background-color: #ffffff;">
                        <!-- Toolbar: Text Formatting and Alignment -->
                        <div class="toolbar mb-4">
                            <!-- Row 1: Text Formatting on the Left, Alignment in the Center, Lists on the Right -->
                            <div class="d-flex justify-content-between mb-3">
                                <!-- Left: Formatting Group -->
                                <div class="btn-group">
                                    <button class="btn btn-outline-dark" onclick="execCommand('bold')" title="Bold"><b>B</b></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('italic')" title="Italic"><i>I</i></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('underline')" title="Underline"><u>U</u></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('strikeThrough')" title="Strikethrough"><s>S</s></button>
                                </div>

                                <!-- Center: Alignment Group -->
                                <div class="btn-group">
                                    <button class="btn btn-outline-dark" onclick="execCommand('justifyLeft')" title="Align Left"><i class="fas fa-align-left"></i></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('justifyCenter')" title="Align Center"><i class="fas fa-align-center"></i></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('justifyRight')" title="Align Right"><i class="fas fa-align-right"></i></button>
                                </div>

                                <!-- Right: Lists Group -->
                                <div class="btn-group">
                                    <button class="btn btn-outline-dark" onclick="execCommand('insertUnorderedList')" title="Unordered List"><i class="fas fa-list-ul"></i></button>
                                    <button class="btn btn-outline-dark" onclick="execCommand('insertOrderedList')" title="Ordered List"><i class="fas fa-list-ol"></i></button>
                                </div>
                            </div>
                        </div>

                        <!-- Notepad Content Area -->
                        <div id="notepadContent" class="border p-3 bg-light" contenteditable="true" style="height: 300px; max-width: 100%; margin: auto; overflow-y: auto; border-radius: 6px; border: 1px solid #ddd; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);">
                            <!-- User can write notes here -->
                        </div>

                        <!-- Action Buttons Below the Input Field -->
                        <div class="d-flex justify-content-between mt-3">
                            <!-- Left: Undo/Redo, Color Picker -->
                            <div class="btn-group">
                                <button class="btn btn-outline-dark" onclick="execCommand('undo')" title="Undo"><i class="fas fa-undo"></i></button>
                                <button class="btn btn-outline-dark" onclick="execCommand('redo')" title="Redo"><i class="fas fa-redo"></i></button>
                                <label class="btn btn-outline-dark" title="Text Color">
                                    <i class="fas fa-palette"></i> <input type="color" id="textColorPicker" class="d-none" onchange="changeTextColor(this.value)">
                                </label>
                            </div>

                            <!-- Right: Clear All, Download, Delete -->
                            <div class="btn-group">
                                <button class="btn btn-outline-secondary me-2" onclick="clearNotepad()">Clear All</button>
                                <button class="btn btn-outline-secondary me-2" onclick="downloadNotes()">Download</button>
                                <button class="btn btn-outline-danger" onclick="deleteNote()" title="Delete Note">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Centered Word Count -->
                        <div class="d-flex justify-content-center align-items-center mt-3">
                            <p id="wordCount" class="text-muted mb-0">Word Count: 0</p>
                        </div>
                        <div class="d-flex justify-content-end mt-1">
                            <p id="autosaveIndicator" class="text-info" style="display: none;">Autosaving...</p>
                        </div>
                    </div>
                    <!-- Modal Footer -->
                    <div class="modal-footer" style="background-color: #f5f5f5; border-top: 1px solid #ddd;">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Loading the saved notes from local storage
        const savedNotes = localStorage.getItem('notepadContent');
        if (savedNotes) {
            this.querySelector('#notepadContent').innerHTML = savedNotes;
        }

        // Saving notes on input and updating the word count
        const notepadContent = this.querySelector('#notepadContent');
        const autosaveIndicator = this.querySelector('#autosaveIndicator');
        const wordCountElement = this.querySelector('#wordCount');

        notepadContent.addEventListener('input', () => {
            // Autosaving notes
            autosaveIndicator.style.display = 'block';
            localStorage.setItem('notepadContent', notepadContent.innerHTML);

            setTimeout(() => {
                autosaveIndicator.style.display = 'none';
            }, 1000);

            // Updating the word count
            const text = notepadContent.innerText.trim();
            const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
            wordCountElement.textContent = `Word Count: ${wordCount}`;
        });
    }
}

// Changing the text color
function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

// Clearing all notes taken
function clearNotepad() {
    if (confirm('Are you sure you want to clear all notes?')) {
        document.querySelector('#notepadContent').innerHTML = '';
        localStorage.removeItem('notepadContent');
        document.querySelector('#wordCount').textContent = 'Word Count: 0';
    }
}

// Downloading notes as a text file to your devide
function downloadNotes() {
    const content = document.querySelector('#notepadContent').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Deleting the note
function deleteNote() {
    if (confirm('Are you sure you want to delete this note?')) {
        const noteContent = document.querySelector('#notepadContent').innerHTML;
        const deletionTime = new Date().toLocaleString();
        const deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];

        // Saving the deleted note with deletion time to the deleting note section
        deletedNotes.push({ content: noteContent, time: deletionTime });
        localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

        document.querySelector('#notepadContent').innerHTML = '';
        localStorage.removeItem('notepadContent');
        document.querySelector('#wordCount').textContent = 'Word Count: 0';
    }
}
//Defining the note-pad element to be recognized in DOM
customElements.define('notepad-modal', NotepadModal);
