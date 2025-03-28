import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SingleEventPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import DonorTable from "../components/DonorTable";

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
        { id: 1, first_name: "John", last_name: "Doe", total_donation: 500, city: "Vancouver", medical_focus: "Brain Cancer", engagement: "Highly Engaged", email: "john.doe@example.com", pmm: "PM1" },
        { id: 2, first_name: "Jane", last_name: "Smith", total_donation: 300, city: "Burnaby", medical_focus: "Brain Cancer", engagement: "Moderately Engaged", email: "jane.smith@example.com", pmm: "PM2" },
        { id: 3, first_name: "Alex", last_name: "Johnson", total_donation: 200, city: "Richmond", medical_focus: "Lung Cancer", engagement: "Rarely Engaged", email: "alex.j@example.com", pmm: "PM3" },
        { id: 4, first_name: "Emily", last_name: "Chang", total_donation: 250, city: "Vancouver", medical_focus: "Brain Cancer", engagement: "Highly Engaged", email: "emily.chang@example.com", pmm: "PM4" },
        { id: 5, first_name: "Michael", last_name: "Brown", total_donation: 150, city: "Surrey", medical_focus: "Breast Cancer", engagement: "Moderately Engaged", email: "michael.brown@example.com", pmm: "PM5" },
        { id: 6, first_name: "Sarah", last_name: "Wilson", total_donation: 350, city: "Richmond", medical_focus: "Lung Cancer", engagement: "Highly Engaged", email: "sarah.wilson@example.com", pmm: "PM6" },
        { id: 7, first_name: "David", last_name: "Lee", total_donation: 400, city: "Vancouver", medical_focus: "Brain Cancer", engagement: "Moderately Engaged", email: "david.lee@example.com", pmm: "PM7" },
        { id: 8, first_name: "Laura", last_name: "Garcia", total_donation: 280, city: "Burnaby", medical_focus: "Breast Cancer", engagement: "Rarely Engaged", email: "laura.garcia@example.com", pmm: "PM8" },
        { id: 9, first_name: "Chris", last_name: "Martinez", total_donation: 220, city: "Surrey", medical_focus: "Brain Cancer", engagement: "Highly Engaged", email: "chris.martinez@example.com", pmm: "PM9" },
        { id: 10, first_name: "Anna", last_name: "Kim", total_donation: 310, city: "Vancouver", medical_focus: "Lung Cancer", engagement: "Moderately Engaged", email: "anna.kim@example.com", pmm: "PM10" },
    ];

    // create variables to store event data and navigate to other pages
    const { eventId } = useParams();
    const navigate = useNavigate();

    // Event and donor list data
    const [event, setEvent] = useState(defaultEvent);
    const [donors, setDonors] = useState([]);

    // Flags to control the donor list UI states
    const [isFormVisible, setIsFormVisible] = useState(false); // indicates a saved donor list exists
    const [isGenerating, setIsGenerating] = useState(false);   // generating a new donor list from scratch
    const [isEditingFinalList, setIsEditingFinalList] = useState(false); // editing an existing donor list
    const [isAddingDonors, setIsAddingDonors] = useState(false); // adding extra donors during editing

    // Temporary donor list used during generation or editing
    const [tempDonorList, setTempDonorList] = useState([]);

    // States for tab switching and filtering in generation/adding mode
    const [activeTab, setActiveTab] = useState("byFilters");
    const [searchName, setSearchName] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterMedicalFocus, setFilterMedicalFocus] = useState("");
    const [filterEngagement, setFilterEngagement] = useState("");

    // Recommended donor lists (for generation or adding donors)
    const [bestMatchedDonors, setBestMatchedDonors] = useState([]);
    const [additionalDonors, setAdditionalDonors] = useState([]);
    const [wasBestMatchedDonors, setWasBestMatchedDonors] = useState([]);
    const [wasAdditionalDonors, setWasAdditionalDonors] = useState([]);
    const [matchedDonors, setMatchedDonors] = useState([]);
    const [wasMatchedDonors, setWasMatchedDonors] = useState([]);

    // fetch event and donors data
    useEffect(() => {
        // create a function to fetch data
        const fetchData = async () => {
            try {
                // fetch the event data
                const eventResponse = await axios.get('http://localhost:5001/api/events/' + eventId + '/details');
                console.log(eventResponse.data);
                setEvent(eventResponse.data);

                // fetch the donors data
                const donorsResponse = await axios.get('http://localhost:5001/api/events/' + eventId + '/donors');
                console.log(donorsResponse.data);
                setDonors(donorsResponse.data || []);
                if (donorsResponse.data && donorsResponse.data.length > 0) {
                    setIsFormVisible(true);
                } else {
                    setIsFormVisible(false);
                }
            } catch (error) {
                // handle errors
                console.error("Failed to fetch event data:", error);
                alert(error.message);
                setEvent(defaultEvent);
                setDonors([]);
                setIsFormVisible(false);
            }
        };
        // call the fetchEventData function
        fetchData();
    }, [eventId]);

    // delete the event
    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:5001/api/events/' + eventId);
            alert("Event deleted successfully!");
            navigate('/events');
        } catch (error) {
            // handle errors
            console.error("Failed to delete event:", error);
            alert(error.message);
        }
    };

    // export the donor list
    const handleExport = async () => {
        try {
            // check if there are donors to export
            if (donors.length === 0) {
                alert("No donors to export!");
                return;
            }
            // export the donors
            // get donors data
            const response = await axios.get('http://localhost:5001/api/events/' + eventId + '/donors/export', {
                responseType: 'blob',
            });
            // create a URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `donors_list_${eventId}.csv`);
            // click the link to download the file
            document.body.appendChild(link);
            link.click();
            // remove the link
            link.remove();
            URL.revokeObjectURL(url);

        } catch (error) {
            // handle errors
            console.error("Failed to export donors:", error);
            alert(error.message);
        }
    };

    // Utility: Get the capacity used for splitting donor lists.
    // For demo purposes, we use Math.min(event.capacity, 5)
    const getCapacity = () => {
        return Math.min(event.capacity, 5) || 5;
    };

    // Generation mode: Create a new donor list
    const handleGenerateDonorList = () => {
        setIsGenerating(true);
        setTempDonorList([]);
        setActiveTab("byFilters");
        generateRecommendedDonors();
    };

    // Example function to populate recommended donors
    const generateRecommendedDonors = () => {
        // In a real app, we fetch a recommended list from the backend.
        // Here we simply split the default donors array.
        const capacity = getCapacity();
        setBestMatchedDonors(defaultDonors.slice(0, capacity));
        setAdditionalDonors(defaultDonors.slice(capacity, capacity * 2));
        setWasAdditionalDonors([]);
        setWasBestMatchedDonors([]);
    };

    // "By Name" search for generation/adding
    const handleSearchByName = () => {
        // In a real app, perform an API search for donor names.
        setMatchedDonors([]);
        setWasMatchedDonors([]);
        const filtered = defaultDonors.filter(donor =>
            `${donor.first_name} ${donor.last_name}`.toLowerCase().includes(searchName.toLowerCase())
        );
        if (filtered.length > 0) {
            setMatchedDonors(filtered);
        } else {
            // Clear matched donors if no results
            alert("No donors found matching the search criteria.");
        }
    };

    // "By Filters" search for generation/adding
    const handleApplyFilters = () => {
        // In a real app, perform an API call using the filter parameters.
        const filtered = defaultDonors.filter(donor => {
            const cityMatch = filterCity ? donor.city === filterCity : true;
            const focusMatch = filterMedicalFocus ? donor.medical_focus === filterMedicalFocus : true;
            const engagementMatch = filterEngagement ? donor.engagement === filterEngagement : true;
            return cityMatch && focusMatch && engagementMatch;
        });
        const capacity = getCapacity();
        setBestMatchedDonors(filtered.slice(0, capacity));
        setAdditionalDonors(filtered.slice(capacity, capacity * 2));
    };

    // Add a donor to the temporary list (both in generate and add mode)
    const handleAddDonor = (donor) => {
        if (!tempDonorList.some(d => d.id === donor.id)) {
            setTempDonorList([...tempDonorList, donor]);

            // filter out the selected donor from the recommended lists
            if (bestMatchedDonors.some(d => d.id === donor.id)) {
                setWasBestMatchedDonors([...wasBestMatchedDonors, donor]);
                setBestMatchedDonors(bestMatchedDonors.filter(d => d.id !== donor.id));
            } 
            if (additionalDonors.some(d => d.id === donor.id)) {
                setWasAdditionalDonors([...wasAdditionalDonors, donor]);
                setAdditionalDonors(additionalDonors.filter(d => d.id !== donor.id));
            }
            if (matchedDonors.some(d => d.id === donor.id)) {
                setWasMatchedDonors([...wasMatchedDonors, donor]);
                setMatchedDonors(matchedDonors.filter(d => d.id !== donor.id));
            }
        }
    };

    // Remove a donor from the temporary list
    const handleRemoveDonor = (id) => {
        setTempDonorList(tempDonorList.filter(d => d.id !== id));
        if (wasBestMatchedDonors.some(d => d.id === id)) {
            const donor = wasBestMatchedDonors.find(d => d.id === id);
            setBestMatchedDonors([...bestMatchedDonors, donor]);
            setWasBestMatchedDonors(wasBestMatchedDonors.filter(d => d.id !== id));
        }
        if (wasAdditionalDonors.some(d => d.id === id)) {
            const donor = wasAdditionalDonors.find(d => d.id === id);
            setAdditionalDonors([...additionalDonors, donor]);
            setWasAdditionalDonors(wasAdditionalDonors.filter(d => d.id !== id));
        }
        if (wasMatchedDonors.some(d => d.id === id)) {
            const donor = wasMatchedDonors.find(d => d.id === id);
            setMatchedDonors([...matchedDonors, donor]);
            setWasMatchedDonors(wasMatchedDonors.filter(d => d.id !== id));
        }
    };

    // Cancel generating a new list
    const handleCancelGenerate = () => {
        setIsGenerating(false);
        setTempDonorList([]);
    };

    // Save generated donor list as final list
    const handleSaveGenerate = async () => {
        // In a real app, POST tempDonorList to backend
        setDonors(tempDonorList);
        setIsGenerating(false);
        setIsFormVisible(true);
        setSearchName("");
        setWasAdditionalDonors([]);
        setWasBestMatchedDonors([]);
        setWasMatchedDonors([]);
        alert("Donor list generated and saved!");
    };

    // Edit an existing donor list (initially for deletion only)
    const handleEditDonorList = () => {
        setIsEditingFinalList(true);
        // Start editing with the saved donor list
        setTempDonorList(donors);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setIsEditingFinalList(false);
        setTempDonorList([]);
        setIsAddingDonors(false); // also cancel any add donors UI if open
    };

    // Save edited donor list
    const handleSaveEdit = async () => {
        // In a real app, update the backend with tempDonorList
        setDonors(tempDonorList);
        setIsEditingFinalList(false);
        setIsAddingDonors(false);
        setSearchName("");
        setWasAdditionalDonors([]);
        setWasBestMatchedDonors([]);
        setWasMatchedDonors([]);
        alert("Donor list updated!");
    };

    // Handle "Add Donors" action in edit mode:
    // Show the recommended donor lists (similar to generate mode)
    const handleShowAddDonors = () => {
        setIsAddingDonors(true);
        setActiveTab("byFilters");
        generateRecommendedDonors();
    };

    // Rendering
    if (!event) {
        return <div>Loading...</div>;
    }

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
                {/* A) No donor list exists: show Generate button */}
                {!isFormVisible && !isGenerating && !isEditingFinalList && (
                    <div className="generate-button">
                        <button onClick={handleGenerateDonorList}>
                            Generate Donor List
                        </button>
                    </div>
                )}

                {/* B) Generating a new donor list from scratch */}
                {isGenerating && (
                    <div className="donor-edit-form">
                        <h2>Generate Donor List</h2>
                        <div className="tab-container">
                            <button
                                className={activeTab === "byFilters" ? "active" : ""}
                                onClick={() => setActiveTab("byFilters")}
                            >
                                By Filters
                            </button>
                            <button
                                className={activeTab === "byName" ? "active" : ""}
                                onClick={() => setActiveTab("byName")}
                            >
                                By Name
                            </button>
                        </div>
                        {activeTab === "byName" && (
                            <div className="search-container">
                                <input
                                    type="text"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    placeholder="Search donor name"
                                />
                                <button onClick={handleSearchByName}>Search</button>
                            </div>
                        )}
                        {activeTab === "byFilters" && (
                            <div className="filter-container">
                                <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                                    {/* Temporary options */}
                                    <option value="">All Cities</option>
                                    <option value="Vancouver">Vancouver</option>
                                    <option value="Burnaby">Burnaby</option>
                                    <option value="Richmond">Richmond</option>
                                    <option value="Surrey">Surrey</option>
                                </select>
                                <select value={filterMedicalFocus} onChange={(e) => setFilterMedicalFocus(e.target.value)}>
                                    {/* Temporary options */}
                                    <option value="">All Focus</option>
                                    <option value="Brain Cancer">Brain Cancer</option>
                                    <option value="Lung Cancer">Lung Cancer</option>
                                    <option value="Breast Cancer">Breast Cancer</option>
                                </select>
                                <select value={filterEngagement} onChange={(e) => setFilterEngagement(e.target.value)}>
                                    <option value="">All Engagement</option>
                                    <option value="Highly Engaged">Highly Engaged</option>
                                    <option value="Moderately Engaged">Moderately Engaged</option>
                                    <option value="Rarely Engaged">Rarely Engaged</option>
                                </select>
                                <button onClick={handleApplyFilters}>Apply</button>
                            </div>
                        )}

                        {activeTab === "byName" && matchedDonors.length > 0 && (
                            <div className="donor-matched-by-name">
                                <h3>Matched Donors</h3>
                                <DonorTable donors={matchedDonors} showActions={true} handleAddDonor={handleAddDonor} />
                            </div>
                        )}

                        {activeTab === "byFilters" && (
                            <div className="donor-recommended">
                                <h3>Best Matched Donors</h3>
                                <DonorTable donors={bestMatchedDonors} showActions={true} handleAddDonor={handleAddDonor} />

                                <h3>Additional Suitable Donors</h3>
                                <DonorTable donors={additionalDonors} showActions={true} handleAddDonor={handleAddDonor} />
                            </div>
                        )}

                        { tempDonorList.length > 0 && (
                            <div>
                                <h3>Temporary Donor List</h3>
                                <DonorTable donors={tempDonorList} showActions={true} handleRemoveDonor={handleRemoveDonor}/>
                            </div>
                        )}

                        <div className="donor-edit-actions">
                            <button onClick={handleCancelGenerate}>Cancel</button>
                            <button onClick={handleSaveGenerate}>Save</button>
                        </div>
                    </div>
                )}

                {/* C) Finalized donor list view (non-editing) */}
                {isFormVisible && !isEditingFinalList &&  (
                    <div className="donor-form">
                        <div className="donor-header">
                            <h2>Donor List</h2>
                            <div className="donor-buttons">                            
                                <button onClick={handleEditDonorList}>Edit</button>
                                <button onClick={handleExport}>Export</button>
                            </div>
                        </div>
                        <DonorTable donors={donors} showActions={false} />
                    </div>
                )}

                {/* D) Editing the finalized donor list */}
                {isFormVisible && isEditingFinalList && (
                    <div className="donor-edit-form">
                        <h2>Edit Donor List</h2>
                        <DonorTable donors={tempDonorList} showActions={true} handleRemoveDonor={handleRemoveDonor} />
                        <div className="donor-edit-actions">
                            <button onClick={handleCancelEdit}>Cancel</button>
                            <button onClick={handleSaveEdit}>Save</button>
                        </div>

                        {/* Add Donors button appears in edit mode */}
                        {!isAddingDonors && (
                            <div className="add-donors-button">
                                <button onClick={handleShowAddDonors}>Add Donors</button>
                            </div>
                        )}

                        {/* When "Add Donors" is clicked, show additional recommended donor lists */}
                        {isAddingDonors && (
                            <div className="donor-add-form">
                                <h3>Add More Donors</h3>
                                <div className="tab-container">
                                    <button
                                        className={activeTab === "byFilters" ? "active" : ""}
                                        onClick={() => setActiveTab("byFilters")}
                                    >
                                        By Filters
                                    </button>
                                    <button
                                        className={activeTab === "byName" ? "active" : ""}
                                        onClick={() => setActiveTab("byName")}
                                    >
                                        By Name
                                    </button>
                                </div>
                                {activeTab === "byName" && (
                                    <div className="search-container">
                                        <input
                                            type="text"
                                            value={searchName}
                                            onChange={(e) => setSearchName(e.target.value)}
                                            placeholder="Search donor name"
                                        />
                                        <button onClick={handleSearchByName}>Search</button>
                                    </div>
                                )}
                                {activeTab === "byFilters" && (
                                    <div className="filter-container">
                                        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                                            <option value="">All Cities</option>
                                            <option value="Vancouver">Vancouver</option>
                                            <option value="Burnaby">Burnaby</option>
                                            <option value="Richmond">Richmond</option>
                                            <option value="Surrey">Surrey</option>
                                        </select>
                                        <select value={filterMedicalFocus} onChange={(e) => setFilterMedicalFocus(e.target.value)}>
                                            <option value="">All Focus</option>
                                            <option value="Brain Cancer">Brain Cancer</option>
                                            <option value="Lung Cancer">Lung Cancer</option>
                                            <option value="Breast Cancer">Breast Cancer</option>
                                        </select>
                                        <select value={filterEngagement} onChange={(e) => setFilterEngagement(e.target.value)}>
                                            <option value="">All Engagement</option>
                                            <option value="Highly Engaged">Highly Engaged</option>
                                            <option value="Moderately Engaged">Moderately Engaged</option>
                                            <option value="Rarely Engaged">Rarely Engaged</option>
                                        </select>
                                        <button onClick={handleApplyFilters}>Apply</button>
                                    </div>
                                )}
                                {activeTab === "byName" && matchedDonors.length > 0 && (
                                    <div className="donor-matched-by-name">
                                        <h4>Matched Donors</h4>
                                        <DonorTable donors={matchedDonors} showActions={true} handleAddDonor={handleAddDonor} />
                                    </div>
                                )}
                                { activeTab === "byFilters" && (
                                    <div className="donor-recommended">
                                        <h4>Best Matched Donors</h4>
                                        <DonorTable donors={bestMatchedDonors} showActions={true} handleAddDonor={handleAddDonor} />
                                        <h4>Additional Suitable Donors</h4>
                                        <DonorTable donors={additionalDonors} showActions={true} handleAddDonor={handleAddDonor} />
                                    </div>
                                )}
                                <div className="donor-add-form-actions">
                                    <button onClick={() => setIsAddingDonors(false)}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SingleEventPage;
