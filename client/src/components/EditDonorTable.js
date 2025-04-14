import React from "react";
import Pagination from "../components/Pagination";
import { useState } from "react";

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

const engagementColorMap = {
  "Highly Engaged": "tag-highly-engaged",
  "Moderately Engaged": "tag-moderately-engaged",
  "Rarely Engaged": "tag-rarely-engaged"
};

const EditDonorTable = ({ donors, showActions, handleAddDonor, handleBulkAddDonors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDonors, setSelectedDonors] = useState([]);

  const totalPages = Math.ceil(donors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentDonors = donors.slice(startIndex, startIndex + rowsPerPage);

  // Toggle selection for a single donor
  const handleSelectDonor = (e, donorId) => {
    if (e.target.checked) {
      setSelectedDonors(prev => [...prev, donorId]);
    } else {
      setSelectedDonors(prev => prev.filter(id => id !== donorId));
    }
  };

  // "Select All" for donors visible on the current page
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentIds = currentDonors.map(donor => donor.id);
      setSelectedDonors(prev => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = currentDonors.map(donor => donor.id);
      setSelectedDonors(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  // Bulk-add action: iterate through selected donors and call handleAddDonor
  const handleBulkAdd = () => {
    const selected = donors.filter(donor => selectedDonors.includes(donor.id));
    if (handleBulkAddDonors) {
      handleBulkAddDonors(selected); // pass selected donor objects
    }
    setSelectedDonors([]); // clear selection
  };

  return (
    <div>
      {/* Bulk Add Button on top right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        {handleAddDonor && (
          <button 
            onClick={handleBulkAdd} 
            disabled={selectedDonors.length === 0}
            style={{
                backgroundColor: "#007bff", // default blue
                opacity: selectedDonors.length === 0 ? 0.65 : 1, // faded when disabled
                cursor: selectedDonors.length === 0 ? "not-allowed" : "pointer",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px"
              }}
          >
            Add Selected Donors to list
          </button>
        )}
      </div>
      <table className="donor-table">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "10%" }} />
          {showActions && <col style={{ width: "10%" }} />}
        </colgroup>
        <thead>
            <tr>
            <th>
              {/* "Select All" checkbox for current page */}
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  currentDonors.length > 0 &&
                  currentDonors.every(donor => selectedDonors.includes(donor.id))
                }
              />
            </th>
            <th>Donor Name</th>
            <th>Donations</th>
            <th>City</th>
            <th>Medical Focus</th>
            <th>Engagement</th>
            <th>Email Address</th>
            <th>PMM</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {currentDonors.map((donor) => (
            <tr key={donor.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedDonors.includes(donor.id)}
                  onChange={(e) => handleSelectDonor(e, donor.id)}
                />
              </td>
              <td>{donor.name}</td>
              <td>{donor.total_donation}</td>
              <td>{donor.city}</td>
              <td>
                {Array.isArray(donor.medical_focus) ? (
                  donor.medical_focus.map((mf, index) => (
                    <span
                      key={index}
                      className={medicalFocusColorMap[mf] || "tag-default-focus"}
                      style={{ marginRight: "4px" }}
                    >
                      {mf}
                    </span>
                  ))
                ) : (
                  <span
                    className={medicalFocusColorMap[donor.medical_focus] || "tag-default-focus"}
                  >
                    {donor.medical_focus}
                  </span>
                )}
              </td>
              <td>
                <span
                  className={engagementColorMap[donor.engagement] || "tag-default-engagement"}
                >
                  {donor.engagement}
                </span>
              </td>
              <td>{donor.email}</td>
              <td>{donor.pmm}</td>
              {showActions && (
                <td>
                  {handleAddDonor && <button onClick={() => handleAddDonor(donor)}>Add</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default EditDonorTable;