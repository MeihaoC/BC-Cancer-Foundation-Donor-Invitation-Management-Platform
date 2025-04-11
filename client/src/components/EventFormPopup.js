import React from "react";

// Utility: Capitalize camelCase fields for labels
const capitalizeFieldName = (fieldName) => {
    return fieldName
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
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
              {Object.keys(eventData).map((key) => (
                <div key={key} className="form-group">
                  <label className="form-label">
                    {capitalizeFieldName(key)}
                    <span className="required-star">*</span><span className="required-text">(required)</span>
                  </label>
      
                  {key === "medicalFocus" ? (
                    <select
                      className="form-input"
                      value={eventData.medicalFocus}
                      onChange={(e) => setEventData({ ...eventData, medicalFocus: e.target.value })}
                    >
                      <option value="">Select Medical Focus</option>
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
                      <option value="">Select Coordinator</option>
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
                      <option value="">Select Fundraiser</option>
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