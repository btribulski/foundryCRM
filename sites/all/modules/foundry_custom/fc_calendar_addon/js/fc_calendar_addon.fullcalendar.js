(function($) {
Drupal.fullcalendar.plugins.fc_calendar_addon = {
  options: function (fullcalendar, settings) {
    return {
      dayClick: function(date, allDay, jsEvent, view) {
        window.location.href = "node/add/event?event_date=" + date;

		//$('.fullcalendar', fullcalendar.$calendar)
		// .fullCalendar('gotoDate', date)
        //  .fullCalendar('changeView', 'agendaDay');
      }
    };
  }
};

}(jQuery));