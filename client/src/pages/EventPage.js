import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/EventPage.css";

export default function EventPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [eventData, setEventData] = useState([
      { id: 1, eventName: "Cancer Research Gala", date: "2025-04-10", city: "Vancouver", medicalFocus: "Lung Cancer", capacity: 100, coordinator: "Alice Smith", fundraiser: "John Doe", status: "In Process" },
      { id: 2, eventName: "Charity Marathon", date: "2025-06-15", city: "Toronto", medicalFocus: "General Research", capacity: 200, coordinator: "Bob Johnson", fundraiser: "Emily Davis", status: "Fully Invited" }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newEvent, setNewEvent] = useState({
      eventName: "",
      date: "",
      city: "",
      medicalFocus: "",
      capacity: "",
      coordinator: "",
      fundraiser: "",
      status: "Not Started",
    });
    const [errors, setErrors] = useState({});
  
    const capitalizeFieldName = (fieldName) => {
      return fieldName
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    const validateForm = () => {
      let newErrors = {};
      Object.keys(newEvent).forEach((key) => {
        if (!newEvent[key]) {
          newErrors[key] = "This field is required";
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleAddEvent = () => {
      if (!validateForm()) return;
      setEventData([...eventData, { id: eventData.length + 1, ...newEvent }]);
      setIsFormVisible(false);
      setNewEvent({
        eventName: "",
        date: "",
        city: "",
        medicalFocus: "",
        capacity: "",
        coordinator: "",
        fundraiser: "",
        status: "Not Started",
      });
      setErrors({});
    };
  
    return (
      <div className="event-container">
        <div className="event-header">
          <h1 className="event-title">Events</h1>
          <button className="add-button" onClick={() => setIsFormVisible(true)}>+ ADD</button>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>City</th>
              <th>Medical Focus</th>
              <th>Capacity</th>
              <th>Coordinator</th>
              <th>Fundraiser</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((event) => (
              <tr key={event.id}>
                <td className="event-name">
                  <Link to={`/events/${event.id}`} className="event-link">
                    {event.eventName}
                  </Link>
                </td>
                <td>{event.date}</td>
                <td>{event.city}</td>
                <td>{event.medicalFocus}</td>
                <td>{event.capacity}</td>
                <td>{event.coordinator}</td>
                <td>{event.fundraiser}</td>
                <td className={`status-${event.status.toLowerCase().replace(" ", "-")}`}>
                  {event.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage}</span>
          <button disabled={currentPage === Math.ceil(eventData.length / eventsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
        {isFormVisible && (
          <div className="event-form">
            <h2>Add New Event</h2>
            {Object.keys(newEvent).map((key) => (
              <div key={key} className="form-group">
                <label className="form-label">{capitalizeFieldName(key)}</label>
                <input
                  className="form-input"
                  placeholder={capitalizeFieldName(key)}
                  value={newEvent[key]}
                  onChange={(e) => setNewEvent({ ...newEvent, [key]: e.target.value })}
                />
                {errors[key] && <p className="error-text">{errors[key]}</p>}
              </div>
            ))}
            <div className="form-buttons">
              <button onClick={handleAddEvent}>Submit</button>
              <button onClick={() => setIsFormVisible(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  