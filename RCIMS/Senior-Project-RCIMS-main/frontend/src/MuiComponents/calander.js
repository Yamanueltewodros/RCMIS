import React, { useState } from 'react';
import { format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Event Data
const eventsData = [
  { date: '2024-10-22', color: 'blue' },
  { date: '2024-10-25', color: 'red' },
  { date: '2024-11-01', color: 'green' },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const styles = {
    calendarContainer: {
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
    },
    navButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
      padding: '10px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    navButtonHover: {
      backgroundColor: '#45a049',
    },
    dayHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      textAlign: 'center',
      color: '#666',
      fontWeight: '600',
      paddingBottom: '10px',
    },
    dayBody: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '10px',
    },
    dayBox: {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    },
    dayBoxHover: {
      backgroundColor: '#edf7ff',
    },
    selectedDay: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    eventDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      margin: '0 2px',
    },
  };

  // Render days in the calendar
  const renderDays = () => {
    const startMonth = startOfMonth(currentDate);
    const startDate = startOfWeek(startMonth);
    const days = [];

    let day = startDate;
    for (let i = 0; i < 42; i++) {
      const formattedDate = format(day, 'd');
      const cloneDay = day;

      days.push(
        <div
          key={day}
          style={{
            ...styles.dayBox,
            backgroundColor: isSameDay(day, selectedDate) ? styles.selectedDay.backgroundColor : '',
            color: isSameDay(day, selectedDate) ? styles.selectedDay.color : !isSameMonth(day, startMonth) ? 'gray' : 'black',
            boxShadow: isSameDay(day, selectedDate) ? styles.selectedDay.boxShadow : 'none',
          }}
          onClick={() => setSelectedDate(cloneDay)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.dayBoxHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = isSameDay(day, selectedDate) ? styles.selectedDay.backgroundColor : '')}
        >
          <span>{formattedDate}</span>
          <div className="flex justify-center mt-1">
            {renderEventDots(day)}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  // Render event dots under dates
  const renderEventDots = (day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const events = eventsData.filter(event => event.date === formattedDay);

    return events.map((event, index) => (
      <div key={index} style={{ ...styles.eventDot, backgroundColor: event.color }}></div>
    ));
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(addDays(currentDate, -30));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(addDays(currentDate, 30));
  };

  return (
    <div style={styles.calendarContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <CalendarMonthIcon style={{ color: '#3b82f6', marginRight: '8px' }} />
          {format(currentDate, 'MMMM yyyy')}  {/* Display the current month and year */}
        </h2>
        <div className="flex space-x-4">
          <div
            style={styles.navButton}
            onClick={prevMonth}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
          >
            <ArrowBackIosIcon />
          </div>
          <div
            style={styles.navButton}
            onClick={nextMonth}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div style={styles.dayHeader}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Body */}
      <div style={styles.dayBody}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
