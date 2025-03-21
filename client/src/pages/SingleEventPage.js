import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// API: '/events/:eventId'
function SingleEventPage() {
    const defaultEvent = {
        name: "Charity Blood Drive",
        date: "2025-04-01",
        location: "Downtown Center",
        city: "Vancouver",
        medical_focus: "Blood Donation",
        capacity: 200,
        coordinator: "Dr. Emily Chen",
        fundraiser: "Health Support Foundation",
        detailed_info: "Join us to save lives with your generous blood donation!"
    };
    
    const defaultDonors = [
        { id: 1, first_name: "John", last_name: "Doe", total_donation: 5, city: "Vancouver", medical_focus: "Blood", engagement: "High", email: "john.doe@example.com", pmm: "A" },
        { id: 2, first_name: "Jane", last_name: "Smith", total_donation: 3, city: "Burnaby", medical_focus: "Plasma", engagement: "Medium", email: "jane.smith@example.com", pmm: "B" },
        { id: 3, first_name: "Alex", last_name: "Johnson", total_donation: 2, city: "Richmond", medical_focus: "Platelets", engagement: "Low", email: "alex.j@example.com", pmm: "C" }
    ];

    // create variables to store event data and navigate to other pages
    const { eventId } = useParams();
    const [event, setEvent] = useState(defaultEvent);
    const [donors, setDonors] = useState(defaultDonors);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const navigate = useNavigate();

    // fetch event and donors data
    useEffect(() => {
        // create a function to fetch data
        const fetchData = async () => {
            try {
                // fetch the event data
                const eventResponse = await axios.get('http://localhost:3001/events/' + eventId);
                setEvent(eventResponse.data);

                // fetch the donors data
                const donorsResponse = await axios.get('http://localhost:3001/events/' + eventId + '/donors');
                setDonors(donorsResponse.data);
                if (donorsResponse.data.length > 0) {
                    setIsFormVisible(true);
                }
            } catch (error) {
                // handle errors
                console.error("Failed to fetch event data:", error);
                alert(error.message);
            }
        };
        // call the fetchEventData function
        fetchData();
    }, [eventId]);

    if (!event) {
        return <div>Loading...</div>;
    }

    // delete the event
    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:3001/events/' + eventId);
            alert("Event deleted successfully!");
            navigate('/events');
        } catch (error) {
            // handle errors
            console.error("Failed to delete event:", error);
            alert(error.message);
        }
    };

   
    return (
        <div className="event-container">
            <div className="event-header">
                <h1>{event.name}</h1>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
            <div className="event-details-container">
                <div className="event-details">
                    <p>Event Date</p>
                    <p><strong>{event.date}</strong></p>
                </div>
                <div className="event-details">
                    <p>Event Location</p>
                    <p><strong>{event.location}</strong></p>
                </div>
                <div className="event-details">
                    <p>City</p>
                    <p><strong>{event.city}</strong></p>
                </div>
                <div className="event-details">
                    <p>Medical Focus</p>
                    <p><strong>{event.medical_focus}</strong></p>
                </div>
                <div className="event-details">
                    <p>Capacity</p>
                    <p><strong>{event.capacity}</strong></p>
                </div>
                <div className="event-details">
                    <p>Coordinator</p>
                    <p><strong>{event.coordinator}</strong></p>
                </div>
                <div className="event-details">
                    <p>Fundraiser</p>
                    <p><strong>{event.fundraiser}</strong></p>
                </div>
                <div className="event-details-info">
                    <p><strong>Detailed Information</strong></p>
                    <p>{event.detailed_info}</p>
                </div>
            </div>
            <div className="donor-container">
                {isFormVisible && (
                    // TODO: Display the donors list
                    // TODO: Add onclick event to the button
                    <div className="donor-form">
                        <div className="donor-header">
                            <h2>Donor List</h2>
                            <button>Edit</button>
                            <button>Export</button>
                        </div>
                        <table className="donor-table">
                            <thead>
                                <tr>
                                    <th>Donor Name</th>
                                    <th>Total Donations</th>
                                    <th>City</th>
                                    <th>Medical Focus</th>
                                    <th>Engagement</th>
                                    <th>Email Address</th>
                                    <th>PMM</th>
                                </tr>
                                <tbody>
                                    {donors.map((donor) => (
                                        <tr key={donor.id}>
                                            <td>{donor.first_name} {donor.last_name}</td>
                                            <td>{donor.total_donation}</td>
                                            <td>{donor.city}</td>
                                            <td>{donor.medical_focus}</td>
                                            <td>{donor.engagement}</td>
                                            <td>{donor.email}</td>
                                            <td>{donor.pmm}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </thead>
                        </table>
                    </div>
                )}
                {!isFormVisible && (
                    // TODO: Add onclick event to the button
                    <button>
                        GENERATE DONOR LIST
                    </button>
                )}
            </div>
        </div>
    );
};

export default SingleEventPage;