import React from "react";

// Utility: Capitalize camelCase fields for labels
const capitalizeFieldName = (fieldName) => {
  return fieldName
    .replace(/_/g, " ")                 // Replace underscores with spaces
    .replace(/([A-Z])/g, " $1")         // Add space before capital letters (camelCase)
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize each word
};

const EventFormPopup = ({
        isVisible,
        mode = "create",
        eventData,
        setEventData,
        medicalFocusOptions,
        userOptions,
        errors,
        onCancel,
        onSubmit,
      }) => {
        if (!isVisible) return null;
      
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{mode === "edit" ? "Edit Event" : "Add New Event"}</h2>
              <p className="required-text">Fields marked with<span className="required-star"> * </span>are mandatory.</p>
              {Object.keys(eventData).map((key) => (
                <div key={key} className="form-group">
                  <label className="form-label">
                    {capitalizeFieldName(key)}
                    <span className="required-star">*</span>
                  </label>
      
                  {key === "medicalFocus" ? (
                    <select
                      className="form-input"
                      value={eventData.medicalFocus}
                      onChange={(e) => setEventData({ ...eventData, medicalFocus: e.target.value })}
                    >
                      <option value="">Medical Focus</option>
                      {medicalFocusOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : key === "coordinator" ? (
                    <select
                      className="form-input"
                      value={eventData.coordinator}
                      onChange={(e) => setEventData({ ...eventData, coordinator: e.target.value })}
                    >
                      <option value="">Coordinator</option>
                      {userOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : key === "fundraiser" ? (
                    <select
                      className="form-input"
                      value={eventData.fundraiser}
                      onChange={(e) => setEventData({ ...eventData, fundraiser: e.target.value })}
                    >
                      <option value="">Fundraiser</option>
                      {userOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="form-input"
                      type={key === "date" ? "date" : key === "capacity" ? "number" : "text"}
                      placeholder={capitalizeFieldName(key)}
                      value={eventData[key]}
                      min={key === "capacity" ? "1" : undefined}
                      onChange={(e) => setEventData({ ...eventData, [key]: e.target.value })}
                    />
                  )}
      
                  {errors[key] && <p className="error-text">{errors[key]}</p>}
                </div>
              ))}
      
              <div className="form-buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onSubmit}>{mode === "edit" ? "Update" : "Submit"}</button>
              </div>
            </div>
          </div>
        );
      };      

export default EventFormPopup;