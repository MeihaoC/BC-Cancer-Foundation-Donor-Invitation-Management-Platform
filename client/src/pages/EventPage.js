import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/EventPage.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import EventFormPopup from "../components/EventFormPopup";

/**
 * EventPage Component
 * ---------------------
 * Handles displaying a list of events in a table format with pagination.
 * Allows users to search for events.
 * Allows users to add new events using a form with validation.
 */

const medicalFocusColorMap = {
    "Brain Cancer": "tag-brain-cancer",
    "Breast Cancer": "tag-breast-cancer",
    "Colon Cancer": "tag-colon-cancer",
    "Leukemia": "tag-leukemia-cancer",
    "Lung Cancer": "tag-lung-cancer",
    "Lymphoma": "tag-lymphoma-cancer",
    "Ovarian Cancer": "tag-ovarian-cancer",
    "Pancreatic Cancer": "tag-pancreatic-cancer",
    "Prostate Cancer": "tag-prostate-cancer",
    "Skin Cancer": "tag-skin-cancer" 
};

const statusColorMap = {
    "Fully Invited": "tag-fully-invited",
    "In Process": "tag-in-process",
    "Not Started": "tag-not-started"
};

export default function EventPage() {
    // State for search field
    const [searchField, setSearchField] = useState("name");  // "name" | "city" | "medical_focus"
    
    // State for search input
    const [searchTerm, setSearchTerm] = useState("");

    // Events list state (fetched from backend)
    const [eventData, setEventData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;

    // Calculate total pages based on eventData length
    const totalPages = Math.ceil(eventData.length / eventsPerPage);

    // Generate a list of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

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

    // Dropdown options state
    const [medicalFocusOptions, setMedicalFocusOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);

    // Calculate indices for current page events
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);

    // Validate all fields, and check capacity is a positive integer
    const validateForm = () => {
        let newErrors = {};
        Object.keys(newEvent).forEach((key) => {
            if (key !== "capacity" && !newEvent[key]) {
                newErrors[key] = "This field is required";
            }
        });
        if (newEvent.capacity === "" || newEvent.capacity === undefined || newEvent.capacity === null) {
            newErrors.capacity = "This field is required";
        } else if (Number(newEvent.capacity) <= 0) {
            newErrors.capacity = "Capacity must be a positive integer";
        }
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

    // Cancel handler: reset form and hide it
    const handleCancelEvent = () => {
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
    }

    // Trigger search when Enter is pressed in the input field.
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            console.log("Searching for events with name:", searchTerm);
            // Update search field in the api
            const response = await axios.get(`http://localhost:5001/api/events/search?field=${searchField}&query=${searchTerm}`);
            console.log("Events fetched:", response.data);
            setEventData(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    // Fetch all events from the backend
    const fetchAllEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/events");
            console.log("Events fetched:", response.data);
            setEventData(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    // useEffect: Fetch events and dropdown options on component mount
    useEffect(() => {
        fetchAllEvents();

        axios
            .get("http://localhost:5001/api/events/medical-focuses")
            .then((response) => setMedicalFocusOptions(response.data))
            .catch((err) => console.error("Error fetching medical focuses:", err));

        axios
            .get("http://localhost:5001/api/events/users")
            .then((response) => setUserOptions(response.data))
            .catch((err) => console.error("Error fetching user names:", err));
    }, []);

    return (
        <div className="app-container">
            <Topbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="event-container">
                        {/* Updated header with search bar on left and add button on right */}
                        <div className="event-header">
                            <div className="search-bar">
                                <select
                                className="search-select"
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                >
                                    <option value="name">Event Name</option>
                                    <option value="city">City</option>
                                    <option value="medical_focus">Medical Focus</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="fundraiser">Fundraiser</option>
                                    <option value="status">Status</option>
                                </select>
                                <input
                                    className="search-input"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {if (e.key === "Enter") handleSearch(e);}}
                                />
                            </div>
                            <button className="add-button" onClick={() => setIsFormVisible(true)}>
                                    + Add event
                            </button>
                        </div>

                        <table className="event-table">
                        <colgroup>
                            <col style={{ width: "24%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "11%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "11%" }} />
                            <col style={{ width: "11%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>
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
                                {currentEvents.map((event) => {
                                    const focusClass = medicalFocusColorMap[event.medical_focus] || "tag-default-focus";
                                    const statusClass = statusColorMap[event.status] || "tag-default-status";
                                    return (
                                        <tr key={event.id}>
                                        <td className="event-name">
                                            <Link to={`/events/${event.id}`} className="event-link">
                                                {event.name}
                                            </Link>
                                        </td>
                                        <td>{new Date(event.date).toISOString().split('T')[0]}</td>
                                        <td>{event.city}</td>
                                        <td><span className={focusClass}>{event.medical_focus}</span></td>
                                        <td>{event.capacity}</td>
                                        <td>{event.coordinator}</td>
                                        <td>{event.fundraiser}</td>
                                        <td><span className={statusClass}>{event.status}</span></td>
                                    </tr>
                                    );
                                    })}
                            </tbody>
                        </table>

                        {/* Numeric Pagination */}
                        <div className="pagination-wrapper">
                            <ul className="pagination">
                                {/* Previous Button */}
                                <li
                                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => {
                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                }}
                                >
                                Previous
                                </li>

                                {/* Page Number Buttons */}
                                {pageNumbers.map((number) => (
                                <li
                                    key={number}
                                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </li>
                                ))}

                                {/* Next Button */}
                                <li
                                className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => {
                                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                }}
                                >
                                Next
                                </li>
                            </ul>
                        </div>

                        {/* POPUP MODAL for "Add New Event" */}
                        {isFormVisible && (
                            <EventFormPopup
                                isVisible={isFormVisible}
                                mode="create"
                                eventData={newEvent}
                                setEventData={setNewEvent}
                                medicalFocusOptions={medicalFocusOptions}
                                userOptions={userOptions}
                                errors={errors}
                                onCancel={handleCancelEvent}
                                onSubmit={handleAddEvent}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
                );
            }
