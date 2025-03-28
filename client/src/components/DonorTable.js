import React from "react";

const DonorTable = ({ donors, showActions, handleAddDonor, handleRemoveDonor }) => {
  return (
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
          {showActions && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {donors.map((donor) => (
          <tr key={donor.id}>
            <td>{donor.name}</td>
            <td>{donor.total_donation}</td>
            <td>{donor.city}</td>
            <td>{donor.medical_focus}</td>
            <td>{donor.engagement}</td>
            <td>{donor.email}</td>
            <td>{donor.pmm}</td>
            {showActions && (
              <td>
                {handleAddDonor && <button onClick={() => handleAddDonor(donor)}>Add</button>}
                {handleRemoveDonor && <button onClick={() => handleRemoveDonor(donor.id)}>Remove</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DonorTable;
