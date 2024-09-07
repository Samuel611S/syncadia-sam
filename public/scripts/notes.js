//deleted notes
function restoreNote(index) {
  const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
  const noteToRestore = deletedNotes[index];

  if (noteToRestore) {
    // Restore the note content to the Notepad
    document.querySelector("#notepadContent").innerHTML = noteToRestore.content;
    localStorage.setItem("notepadContent", noteToRestore.content);

    // Remove the note from the deleted notes list
    deletedNotes.splice(index, 1);
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

    // Update the Deleted Notes modal
    document.getElementById("open-deleted-notes").click();

    // Notify the user
    alert("Note has been restored to the Notepad.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addTaskNoteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      var title = document.getElementById("taskNoteTitle").value;
      var description = document.getElementById("taskNoteDescription").value;
      var selectedDate = document.getElementById("selectedDate").value;
      var priority = document.getElementById("taskNotePriority").value; // Capture priority

      // Add the event to the calendar
      calendar.addEvent({
        title: title,
        start: selectedDate,
        description: description,
        allDay: true,
        extendedProps: {
          priority: priority, // Store the priority
        },
      });

      // Close modal and reset form
      $("#addTaskNoteModal").modal("hide");
      document.getElementById("addTaskNoteForm").reset();
    });

  // Open the Calendar Modal and force rerender after showing
  document
    .getElementById("open-calendar")
    .addEventListener("click", function () {
      $("#calendarModal").modal("show");

      setTimeout(() => {
        calendar.render(); // Rerender the calendar after modal is shown
      }, 200); // Adjust the timeout as needed
    });

  // Load deleted notes into the modal
  document
    .getElementById("open-deleted-notes")
    .addEventListener("click", function () {
      const deletedNotes =
        JSON.parse(localStorage.getItem("deletedNotes")) || [];
      const deletedNotesList = document.getElementById("deletedNotesList");
      deletedNotesList.innerHTML = ""; // Clear the list first

      if (deletedNotes.length === 0) {
        deletedNotesList.innerHTML =
          '<li class="list-group-item">No deleted notes available.</li>';
      } else {
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

  // Add Task/Note to Calendar
  document
    .getElementById("addTaskNoteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      var title = document.getElementById("taskNoteTitle").value;
      var description = document.getElementById("taskNoteDescription").value;
      var selectedDate = document.getElementById("selectedDate").value;

      // Add the event to the calendar
      calendar.addEvent({
        title: title,
        start: selectedDate,
        description: description,
        allDay: true,
      });

      // Close modal and reset form
      $("#addTaskNoteModal").modal("hide");
      document.getElementById("addTaskNoteForm").reset();
    });
});

