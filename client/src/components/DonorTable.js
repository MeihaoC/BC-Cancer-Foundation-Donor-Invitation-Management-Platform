import React from "react";

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

const DonorTable = ({ donors, showActions, handleAddDonor, handleRemoveDonor }) => {
  return (
    <table className="donor-table">
      <colgroup>
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        {showActions && <col style={{ width: "10%" }} />}
      </colgroup>
      <thead>
        <tr>
          <th>Donor Name</th>
          <th>Total Donations</th>
          <th>City</th>
          <th>Medical Focus</th>
          <th>Engagement</th>
          <th>Email Address</th>
          <th>PMM</th>
          {showActions && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {donors.map((donor) => (
          <tr key={donor.id}>
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
                {handleRemoveDonor && <button className="remove-button" onClick={() => handleRemoveDonor(donor.id)}>Remove</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DonorTable;
