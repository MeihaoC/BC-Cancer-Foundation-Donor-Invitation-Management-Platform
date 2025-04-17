import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/EventPage.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import EventFormPopup from "../components/EventFormPopup";
import Pagination from "../components/Pagination";
import { FaSearch } from 'react-icons/fa';

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
    const [eventsPerPage, setEventsPerPage] = useState(10);

    // Calculate total pages based on eventData length
    const totalPages = Math.ceil(eventData.length / eventsPerPage);

    // Generate a list of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Form visibility and data
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newEvent, setNewEvent] = useState(
            {
                name: "",
                raw_date: new Date(), // Date object for date picker
                city: "",
                location: "",
                medical_focus: "",
                capacity: "",
                coordinator: "",
                fundraiser: "",
                description: ""
            }
        );
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
            name: newEvent.name,
            date: newEvent.raw_date, // Date object for date picker
            location: newEvent.location,
            city: newEvent.city,
            medical_focus: newEvent.medical_focus,
            capacity: parseInt(newEvent.capacity, 10),
            coordinator: newEvent.coordinator,
            fundraiser: newEvent.fundraiser,
            details: newEvent.description
        };
        console.log("Payload to be sent:", payload);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, payload);
            console.log("Event added:", response.data);
            alert(response.data.message);
            // After successful creation, refresh the events list.
            await fetchAllEvents();
            // Reset the form and hide it.
            setIsFormVisible(false);
            setNewEvent({
                eventName: "",
                raw_date: new Date(), // Date object for date picker
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
            name: "",
            raw_date: new Date(), // Date object for date picker
            city: "",
            location: "",
            medical_focus: "",
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/search?field=${searchField}&query=${searchTerm}`);
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
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
            .get(`${process.env.REACT_APP_API_URL}/api/events/medical-focuses`)
            .then((response) => setMedicalFocusOptions(response.data))
            .catch((err) => console.error("Error fetching medical focuses:", err));

        axios
            .get(`${process.env.REACT_APP_API_URL}/api/events/users`)
            .then((response) => setUserOptions(response.data))
            .catch((err) => console.error("Error fetching user names:", err));
    }, []);

    const handleRowsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset to first page when changing rows per page
      };

    return (
        <div className="app-container">
            <Topbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="event-container">
                        {/* Updated header with search bar on left and add button on right */}
                        <div className="event-header">
                            <div className="search-wrapper">
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

                                <div className="search-input-wrapper">
                                    <span className="search-icon"><FaSearch /></span>
                                    <input
                                    className="search-input"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch(e);
                                    }}
                                    />
                                </div>
                            </div>

                            <button className="add-button" onClick={() => setIsFormVisible(true)}>
                                    + Add event
                            </button>
                        </div>

                        <table className="event-table">
                        <colgroup>
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "14%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "7%" }} />
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
                                        <td>
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
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

                        {/* Use the Pagination component */}
                        <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={eventsPerPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        />

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