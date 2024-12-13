import { useState, useEffect } from "react";
import React from "react";
import "./styles/ScheduleAppt.css";

const BASE_URL = "http://localhost:8081";

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

  function convertTo24HourFormat(time) {
    // console.log("INSIDE CONVERT TIME: " + time);
    const [timeString, period] = time.split(" "); // Split time and AM/PM
    let [hours, minutes] = timeString.split(":").map(Number);

    if (period === "AM" && hours === 12) {
      hours = 0; // Midnight case
    } else if (period === "PM" && hours !== 12) {
      hours += 12; // Convert PM hours
    }

    // Format hours and minutes to ensure two digits
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;

    return formattedTime;
  }

  const [selectedCell, setSelectedCell] = useState(null); // To track the clicked cell
  const [isPopupVisible, setPopupVisible] = useState(false); // To toggle the popup visibility
  const [appointments, setAppointments] = useState([]); // Store all appointments
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(false); // trigger fetch again

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/appointments`); // Replace with your API endpoint
      const data = await response.json();
      setAppointments(data); // Set the fetched appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [appointmentsUpdated]);

  const handleCellClick = (day, slot) => {
    // Check if the slot is booked by the current user
    const slot24h = convertTo24HourFormat(slot);
    const bookedByUser = appointments.some(
      (appt) =>
        appt.day === day &&
        appt.time_slot === slot24h &&
        appt.user_id === user.userID
    );
    console.log(day, slot, bookedByUser);
    setSelectedCell({ day, slot, isBooked: bookedByUser });
    setPopupVisible(true);
  };
  const closePopup = () => {
    setPopupVisible(false);
    setSelectedCell(null);
  };

  const makeAppointment = async (time_slot, day, user_id) => {
    try {
      console.log(time_slot, day, user_id);
      const response = await fetch(`${BASE_URL}/appointments/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time_slot, day, user_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule appointment");
      }

      // if appointment is made, flip the fetch flag and update page
      if (response.ok) {
        setAppointmentsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error making appointment:", error);
      return null;
    }
  };

  const reserveTimeslot = () => {
    // Send request to reserve the timeslot
    const { day, slot } = selectedCell;

    let slot_time = convertTo24HourFormat(slot);
    makeAppointment(slot_time, day, user.userID);
    // Make sure to handle this logic on your backend
    console.log("Reserving timeslot:", day, slot_time, user.userID);

    closePopup(); // Close the popup after reserving
  };

  const deleteAppointment = async (time_slot, day, user_id) => {
    try {
      // First, find the appointment to get the id
      const appointment = appointments.find(
        (appt) =>
          appt.time_slot === time_slot &&
          appt.day === day &&
          appt.user_id === user_id
      );

      if (!appointment) {
        console.error("Appointment not found for this slot");
        return;
      }

      const { id } = appointment;

      // Now send the DELETE request with the appointment id
      const response = await fetch(`${BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time_slot, day, user_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      // If the appointment is successfully deleted, update the state
      setAppointmentsUpdated((prev) => !prev);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const deleteTimeslot = () => {
    const { day, slot, user_id } = selectedCell;
    let slot24h = convertTo24HourFormat(slot);

    // Send request to delete the timeslot
    console.log("Deleting timeslot:", selectedCell);
    console.log(slot24h, day, user.userID);
    deleteAppointment(slot24h, day, user.userID);

    setPopupVisible(false); // Close the popup after deletion
  };

  // Check if a timeslot is already booked
  const isSlotBooked = (day, slot) => {
    const slot24h = convertTo24HourFormat(slot);
    console.log(slot, slot24h);
    return appointments.some(
      (appt) => appt.day === day && appt.time_slot === slot24h
    );
  };

  return (
    <div className='week-grid container'>
      <div style={{ paddingTop: "5rem" }} />
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
            <div
              key={`${day}-${slot}`}
              className={`cell slot 
                ${isSlotBooked(day, slot) ? "booked" : ""}
                ${
                  appointments.some(
                    (appt) =>
                      appt.day === day &&
                      appt.time_slot === convertTo24HourFormat(slot) &&
                      appt.user_id === user.userID
                  )
                    ? "booked-by-user"
                    : ""
                }`}
              onClick={() => handleCellClick(day, slot)}
            >
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
            {selectedCell?.isBooked &&
            (selectedCell?.user_id === user.userID || user.isAdmin) ? (
              <button onClick={deleteTimeslot}>Delete</button>
            ) : (
              <button onClick={reserveTimeslot}>Schedule</button>
            )}
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      <div style={{ paddingTop: "5rem" }} />
    </div>
  );
}

export default ScheduleAppt;
