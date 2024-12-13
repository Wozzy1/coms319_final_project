import { useState } from "react";
import React from "react";
import "./styles/ScheduleAppt.css";

function ScheduleAppt({ user, setUser }) {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];

  const [selectedCell, setSelectedCell] = useState(null); // To track the clicked cell
  const [isPopupVisible, setPopupVisible] = useState(false); // To toggle the popup visibility

  const handleCellClick = (day, slot) => {
    setSelectedCell({ day, slot });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedCell(null);
  };

  const reserveTimeslot = (user) => {
    // send request that current user 
  };
  return (
    <div className='week-grid container'>
      {/* Header Row */}
      <div className='table-row'>
        <div className='cell time-header'></div>
        {weekdays.map((day) => (
          <div key={day} className='cell header'>
            {day}
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {timeSlots.map((slot) => (
        <div className='table-row' key={slot}>
          <div className='cell time-header'>{slot}</div>
          {weekdays.map((day) => (
            <div key={`${day}-${slot}`}
              className='cell slot'
              onClick={() => { handleCellClick(day, slot) }}>
              {/* Content for each slot */}

            </div>
          ))}
        </div>
      ))}

      {/* Popup */}
      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>Selected Slot</h3>
            <p>Day: {selectedCell?.day}</p>
            <p>Time: {selectedCell?.slot}</p>
            <button onClick={reserveTimeslot()}>Schedule</button>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleAppt;
