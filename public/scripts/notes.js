// Function to restore a deleted note
function restoreNote(index) {
  // Getting deleted notes from localStorage
  const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || []; 
  // Find the note to restore by the index
  const noteToRestore = deletedNotes[index]; 

  if (noteToRestore) {
    // Restoring the note content to the Notepad
    document.querySelector("#notepadContent").innerHTML = noteToRestore.content;
    // Saving the restored note to localStorage
    localStorage.setItem("notepadContent", noteToRestore.content); 

    // Removing the note from the deleted notes list
    deletedNotes.splice(index, 1); // Removing the note from the deleted list
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes)); // Updating localStorage

    // Refreshing the Deleted Notes modal to show the updated list
    document.getElementById("open-deleted-notes").click();

    // Notifying the user that the note has been restored
    alert("Note has been restored to the Notepad.");
  }
}

//DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  
  // Handling form submission for adding task/note of the calendar
  document
    .getElementById("addTaskNoteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Preventing form submission from reloading the page

      // Get task/note title
      var title = document.getElementById("taskNoteTitle").value; 
      // Get task/note description
      var description = document.getElementById("taskNoteDescription").value; 
      // Get selected date
      var selectedDate = document.getElementById("selectedDate").value; 
      // Get priority of task
      var priority = document.getElementById("taskNotePriority").value; 

      // Adding the task/note event to the calendar
      calendar.addEvent({
        title: title,
        start: selectedDate,
        description: description,
        allDay: true,
        extendedProps: {
          priority: priority, // Adding priority 
        },
      });

      // Close the modal 
      $("#addTaskNoteModal").modal("hide");
      document.getElementById("addTaskNoteForm").reset();
    });

  
  document
    .getElementById("open-calendar")
    .addEventListener("click", function () {
      $("#calendarModal").modal("show"); // Showing the calendar modal

      setTimeout(() => {
        calendar.render(); // Rerender the calendar to fix display issues in modal
      }, 200); // Delay to ensure modal is fully shown before rendering
    });

  // Load deleted notes into the modal
  document
    .getElementById("open-deleted-notes")
    .addEventListener("click", function () {
      const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || []; // Get deleted notes from localStorage
      const deletedNotesList = document.getElementById("deletedNotesList");
      deletedNotesList.innerHTML = ""; 

      // If no deleted notes, display a message
      if (deletedNotes.length === 0) {
        deletedNotesList.innerHTML =
          '<li class="list-group-item">No deleted notes available.</li>';
      } else {
        // For each deleted note,  a list item and restore button are created
        deletedNotes.forEach((note, index) => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.innerHTML = `
                          <div>
                              <p>${note.content}</p>
                              <small class="text-muted">Deleted on: ${note.time}</small>
                              <button class="btn btn-sm btn-success mt-2" onclick="restoreNote(${index})">Restore</button>
                              </div>
                      `;
          deletedNotesList.appendChild(listItem);
        });
      }

      $("#deletedNotesModal").modal("show"); 
    });


  document
    .getElementById("addTaskNoteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Preventing form from refreshing the page

       // Get task/note title
      var title = document.getElementById("taskNoteTitle").value;
      // Get task/note description
      var description = document.getElementById("taskNoteDescription").value; 
      // Get selected date
      var selectedDate = document.getElementById("selectedDate").value; 

      // Adding the task/note event to the calendar
      calendar.addEvent({
        title: title,
        start: selectedDate,
        description: description,
        allDay: true,
      });

      // Closing the modal and reseting form
      $("#addTaskNoteModal").modal("hide");
      document.getElementById("addTaskNoteForm").reset(); // Clear form
    });
});
