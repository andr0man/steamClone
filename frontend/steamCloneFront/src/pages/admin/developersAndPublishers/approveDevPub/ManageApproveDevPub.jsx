import React from "react";
import { useGetWithoutApprovalQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import { useNavigate } from "react-router-dom";
import ApproveDevPubRow from "./components/ApproveDevPubRow";

const ManageApproveDevPub = () => {
  const navigate = useNavigate();
  const {
    data: { payload: unapprovedDevPubResponse } = { payload: [] },
    isLoading: isLoadingUnapproved,
    error: errorUnapproved,
  } = useGetWithoutApprovalQuery();

  if (isLoadingUnapproved)
    return <div className="loading-overlay visible">Loading data...</div>;

  return (
    <div className="manage-container flux-border">
      <div className="associated-users-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h2 style={{ margin: 0 }}>Manage Associated Users</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
      <table
        className="manage-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Creator</th>
            <th style={{ textAlign: "center", padding: "8px", width: "140px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {unapprovedDevPubResponse.length > 0 ? (
            unapprovedDevPubResponse.map((game) => (
              <ApproveDevPubRow key={game.id} devPub={game} />
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "8px" }}>
                No unapproved Developer/Publisher found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageApproveDevPub;
