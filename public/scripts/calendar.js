var calendar;
document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    dateClick: function (info) {
      document.getElementById("selectedDate").value = info.dateStr;
      $("#addTaskNoteModal").modal("show");
    },
    events: [
      // Example event data
      {
        title: "",
        start: "",
        description: "",
      },
      {
        title: "",
        start: "",
        end: "",
        description: "",
      },
      {
        title: "",
        start: "",
        description: "",
      },
    ],
    eventClick: function (info) {
      alert(
        "Event: " +
          info.event.title +
          "\n" +
          "Description: " +
          info.event.extendedProps.description
      );
    },
  });

  calendar.render();
});
