 // Global variable
var calendar; 

document.addEventListener("DOMContentLoaded", function () {
  
  // Get the element where the calendar will be rendered
  var calendarEl = document.getElementById("calendar");

  // FullCalendar with configuration options
  calendar = new FullCalendar.Calendar(calendarEl, {
    
    // Default view of the calendar -> display a month grid
    initialView: "dayGridMonth",

    // Layout of the calendar's header 
    headerToolbar: {
      left: "prev,next today",  
      center: "title",  
      right: "dayGridMonth,timeGridWeek,timeGridDay",  
    },

    
    dateClick: function (info) {
      // Setting the clicked date in an input field 
      document.getElementById("selectedDate").value = info.dateStr;
      // Opening the modal to add a new task or note
      $("#addTaskNoteModal").modal("show");
    },

    // Predefined events 
    events: [
      {
        title: "",           // Event title 
        start: "",           // Event start date 
        description: "",     // Event description 
      },
      {
        title: "",           // Event title 
        start: "",           // Event start date 
        end: "",             // Event end date 
        description: "",     // Event description 
      },
      {
        title: "",           // Event title 
        start: "",           // Event start date 
        description: "",     // Event description 
      },
    ],

   
    eventClick: function (info) {
      // Alert with the event's title and description
      alert(
        "Event: " + info.event.title + "\n" + 
        "Description: " + info.event.extendedProps.description
      );
    },
  });

  // Rendering the calendar 
  calendar.render();
});
