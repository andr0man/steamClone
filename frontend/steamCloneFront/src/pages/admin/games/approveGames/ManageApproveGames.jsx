import React from "react";
import { useGetWithoutApprovalQuery } from "../../../../services/game/gameApi";
import { useNavigate } from "react-router-dom";
import ApproveGameRow from "./components/ApproveGameRow";

const ManageApproveGames = () => {
  const navigate = useNavigate();
  const {
    data: { payload: unapprovedGamesResponse } = { payload: [] },
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
          {unapprovedGamesResponse.length > 0 ? (
            unapprovedGamesResponse.map((game) => (
              <ApproveGameRow key={game.id} game={game} />
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "8px" }}>
                No unapproved games found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageApproveGames;
