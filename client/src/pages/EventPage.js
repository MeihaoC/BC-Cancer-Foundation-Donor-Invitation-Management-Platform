import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

    // Sample initial events list
    const [eventData, setEventData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;

    // Calculate indices for current page events
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);

    // Form visibility and data
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newEvent, setNewEvent] = useState({
        eventName: "",
        date: "",
        city: "",
        location:"",
        medicalFocus: "",
        capacity: "",
        coordinator: "",
        fundraiser: "",
        description: ""
    });
    const [errors, setErrors] = useState({});

    // Utility: Capitalize camelCase fields for labels
    const capitalizeFieldName = (fieldName) => {
        return fieldName
            .replace(/([A-Z])/g, " $1")
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Validate all fields, and check capacity is a positive integer
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

    // Submit handler: validate + append event
    const handleAddEvent = async () => {
        if (!validateForm()) return;
      
        // Map frontend fields to backend keys.
        const payload = {
          name: newEvent.eventName,
          date: newEvent.date, 
          location: newEvent.location,
          city: newEvent.city,
          medical_focus: newEvent.medicalFocus,
          capacity: parseInt(newEvent.capacity, 10),
          coordinator: newEvent.coordinator,
          fundraiser: newEvent.fundraiser,
          details: newEvent.description
        };
        console.log("Adding event:", payload);
      
        try {
          const response = await axios.post("http://localhost:5001/api/events", payload);
          console.log("Event added:", response.data);
          // After successful creation, refresh the events list.
          await fetchAllEvents();
          // Reset the form and hide it.
          setIsFormVisible(false);
          setNewEvent({
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
          setErrors({});
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.error || err.response?.data?.message || err.message);
        }
      };

    // Search handler: search events by name
    const handleSearch = async (e) => {
        e.preventDefault();

        // Check if search term is empty
        if (!searchTerm) {
            alert("Please enter a search term.");
            return;
        }

        // Fetch events by search term
        try {
            console.log('Searching for events with name:', searchTerm);
            const response = await axios.get(`http://localhost:5001/api/events/search?q=${searchTerm}`);
            console.log('Events fetched:', response.data);
            setEventData(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    // fetch all events from the backend
    const fetchAllEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/events");
            console.log('Events fetched:', response.data);
            setEventData(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchAllEvents();
      }, []);

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
                <button className="add-button" onClick={handleSearch}>Search</button>
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
                                    {event.name}
                                </Link>
                            </td>
                            <td>{event.date instanceof Date ? event.date.toLocaleDateString() : event.date}</td>
                            <td>{event.city}</td>
                            <td>{event.medical_focus}</td>
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
