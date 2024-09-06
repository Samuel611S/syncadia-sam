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
                        <div class="toolbar mb-2 d-flex flex-wrap justify-content-between">
                            <!-- Toolbar Buttons -->
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light" onclick="execCommand('bold')"><b>B</b></button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('italic')"><i>I</i></button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('underline')"><u>U</u></button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('strikeThrough')"><s>S</s></button>
                            </div>
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light" onclick="execCommand('justifyLeft')">Left</button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('justifyCenter')">Center</button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('justifyRight')">Right</button>
                            </div>
                            <div class="btn-group mb-2">
                                <label class="btn btn-sm btn-light">
                                    Text Color <input type="color" id="textColorPicker" class="d-none" onchange="changeTextColor(this.value)">
                                </label>
                            </div>
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light" onclick="execCommand('insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('insertOrderedList')"><i class="fas fa-list-ol"></i></button>
                            </div>
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light" onclick="execCommand('undo')"><i class="fas fa-undo"></i></button>
                                <button class="btn btn-sm btn-light" onclick="execCommand('redo')"><i class="fas fa-redo"></i></button>
                            </div>
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light" onclick="clearNotepad()">Clear All</button>
                                <button class="btn btn-sm btn-light" onclick="downloadNotes()">Download</button>
                            </div>
                            <div class="btn-group mb-2">
                                <button class="btn btn-sm btn-light text-danger" onclick="deleteNote()" title="Delete Note">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div id="notepadContent" class="border p-3" contenteditable="true" style="height: 300px; width: 100%; max-width: 600px; margin: auto; overflow-y: auto;">
                            <!-- User can write notes here -->
                        </div>
                        <p id="wordCount" class="mt-3">Word Count: 0</p>
                        <p id="autosaveIndicator" style="display: none;">Autosaving...</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Load saved notes from local storage
        const savedNotes = localStorage.getItem('notepadContent');
        if (savedNotes) {
            this.querySelector('#notepadContent').innerHTML = savedNotes;
        }

        // Save notes on input and update word count
        const notepadContent = this.querySelector('#notepadContent');
        const autosaveIndicator = this.querySelector('#autosaveIndicator');
        const wordCountElement = this.querySelector('#wordCount');

        notepadContent.addEventListener('input', () => {
            // Autosave notes
            autosaveIndicator.style.display = 'block';
            localStorage.setItem('notepadContent', notepadContent.innerHTML);

            // Hide the autosave indicator after a short delay
            setTimeout(() => {
                autosaveIndicator.style.display = 'none';
            }, 1000);

            // Update word count
            const text = notepadContent.innerText.trim();
            const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
            wordCountElement.textContent = `Word Count: ${wordCount}`;
        });
    }
}

// Function to change text color
function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

// Function to clear all notes
function clearNotepad() {
    if (confirm('Are you sure you want to clear all notes?')) {
        document.querySelector('#notepadContent').innerHTML = '';
        localStorage.removeItem('notepadContent');
        document.querySelector('#wordCount').textContent = 'Word Count: 0';
    }
}

// Function to download notes as a text file
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

// Function to delete the note
function deleteNote() {
    if (confirm('Are you sure you want to delete this note?')) {
        const noteContent = document.querySelector('#notepadContent').innerHTML;
        const deletionTime = new Date().toLocaleString();
        const deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];

        // Save the deleted note with deletion time
        deletedNotes.push({ content: noteContent, time: deletionTime });
        localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

        document.querySelector('#notepadContent').innerHTML = '';
        localStorage.removeItem('notepadContent');
        document.querySelector('#wordCount').textContent = 'Word Count: 0';
    }
}

customElements.define('notepad-modal', NotepadModal);
function saveNoteToDB(content) {
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Note saved to DB:', data);
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
  }
  
  // Call this function when you want to save the note
  const content = document.querySelector('#notepadContent').innerHTML;
  saveNoteToDB(content);
  
  function deleteNoteFromDB(noteId) {
    fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Note deleted from DB:', data);
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  }
  
  // Trigger this function on note deletion
  deleteNoteFromDB(noteId);
  
  function restoreNoteFromDB(noteId) {
    fetch(`/api/deleted-notes/restore/${noteId}`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Note restored:', data);
      })
      .catch(error => {
        console.error('Error restoring note:', error);
      });
  }
  
  // Call this function when restoring the note
  restoreNoteFromDB(noteId);
  