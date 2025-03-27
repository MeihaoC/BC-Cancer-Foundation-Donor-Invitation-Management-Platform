import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/EventPage.css";

/**
 * EventPage Component
 * ---------------------
 * Handles displaying a list of events in a table format with pagination.
 * Allows users to add new events using a form with validation.
 */

export default function EventPage() {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for events list (fetched from backend)
  const [eventData, setEventData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  // Form visibility and data
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    date: "",
    city: "",
    location: "",
    medicalFocus: "",
    capacity: "",
    coordinator: "",
    fundraiser: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  // Fetch events from backend when component mounts
  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Transform backend fields to match frontend display names.
        const transformed = data.map((e) => ({
          id: e.id,
          eventName: e.name,
          date: new Date(e.date),
          city: e.city,
          medicalFocus: e.medical_focus,
          capacity: e.capacity,
          coordinator: e.coordinator,
          fundraiser: e.fundraiser,
          status: e.status
        }));
        setEventData(transformed);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Utility: Capitalize camelCase fields for labels
  const capitalizeFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Validate form inputs, ensuring capacity is positive
  const validateForm = () => {
    let newErrors = {};
    Object.keys(newEvent).forEach((key) => {
      if (!newEvent[key]) {
        newErrors[key] = "This field is required";
      }
    });
    if (newEvent.capacity <= 0) newErrors.capacity = "Capacity must be a positive integer";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler: validate and send a POST request to the backend
  const handleAddEvent = async () => {
    if (!validateForm()) return;

    // Map the frontend keys to the backend expected keys.
    const payload = {
      name: newEvent.eventName,
      date: newEvent.date,
      city: newEvent.city,
      location: newEvent.location, // include location field here
      medical_focus: newEvent.medicalFocus,
      capacity: parseInt(newEvent.capacity, 10),
      coordinator: newEvent.coordinator,
      fundraiser: newEvent.fundraiser,
      details: newEvent.description
    };

    try {
      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error("Failed to create event");
        return;
      }
      const result = await response.json();
      const createdEvent = {
        id: result.eventId,
        eventName: newEvent.eventName,
        date: new Date(newEvent.date),
        city: newEvent.city,
        medicalFocus: newEvent.medicalFocus,
        capacity: parseInt(newEvent.capacity, 10),
        coordinator: newEvent.coordinator,
        fundraiser: newEvent.fundraiser,
        status: "Not Started"
      };
      setEventData([...eventData, createdEvent]);
      // Reset form
      setIsFormVisible(false);
      setNewEvent({
        eventName: "",
        date: "",
        city: "",
        location: "", // reset location field too
        medicalFocus: "",
        capacity: "",
        coordinator: "",
        fundraiser: "",
        description: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Calculate displayed events for current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <div className="event-container">
      <div className="event-header">
        <h1 className="event-title">Events</h1>
        <button className="add-button" onClick={() => setIsFormVisible(true)}>
          + ADD
        </button>
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
          {currentEvents.map((event) => (
            <tr key={event.id}>
              <td className="event-name">
                <Link to={`/events/${event.id}`} className="event-link">
                  {event.eventName}
                </Link>
              </td>
              <td>{event.date instanceof Date ? event.date.toLocaleDateString() : event.date}</td>
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
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage === Math.ceil(eventData.length / eventsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      {isFormVisible && (
        <div className="event-form">
          <h2>Add New Event</h2>
          {Object.keys(newEvent).map((key) => (
            <div key={key} className="form-group">
              <label className="form-label">{capitalizeFieldName(key)}</label>
              <input
                className="form-input"
                type={key === "date" ? "date" : key === "capacity" ? "number" : "text"}
                placeholder={capitalizeFieldName(key)}
                value={newEvent[key]}
                min={key === "capacity" ? "1" : undefined}
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
