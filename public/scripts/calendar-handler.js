document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const noteSection = document.getElementById('note-section');
    const selectedDateEl = document.getElementById('selected-date');
    const noteContent = document.getElementById('note-content');
    const saveNoteButton = document.getElementById('save-note');

    // This object will hold the notes. Ideally, you'd save this to a database.
    const notes = {};

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            dateClick: function (info) {
                // Show the note section and set the selected date
                noteSection.style.display = 'block';
                selectedDateEl.textContent = info.dateStr;
                noteContent.value = notes[info.dateStr] || '';

                saveNoteButton.onclick = function () {
                    const noteText = noteContent.value.trim();
                    if (noteText) {
                        notes[info.dateStr] = noteText;
                        alert(`Note saved for ${info.dateStr}`);
                    } else {
                        alert('Note cannot be empty.');
                    }
                };
            },
            events: function (fetchInfo, successCallback, failureCallback) {
                // Convert the notes object to FullCalendar event objects
                const events = Object.keys(notes).map(date => ({
                    title: 'Note',
                    start: date,
                    allDay: true
                }));
                successCallback(events);
            }
        });

        calendar.render();
    }
});
