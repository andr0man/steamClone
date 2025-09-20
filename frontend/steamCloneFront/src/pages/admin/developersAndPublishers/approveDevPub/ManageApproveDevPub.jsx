import React from "react";
import { useGetWithoutApprovalQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import { useNavigate } from "react-router-dom";
import ApproveDevPubRow from "./components/ApproveDevPubRow";
import { useSearchFilter } from "../../../../components/Search/useSearchFilter";

const ManageApproveDevPub = () => {
  const navigate = useNavigate();
  const {
    data: { payload: unapprovedDevPubResponse } = { payload: [] },
    isLoading: isLoadingUnapproved,
    error: errorUnapproved,
  } = useGetWithoutApprovalQuery();

    const {
      query,
      filteredList: filteredDevAndPubList,
      handleSearch,
    } = useSearchFilter(unapprovedDevPubResponse, (item, query) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

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
          <h2 style={{ margin: 0 }}>Manage Unapproved Developers & Publishers</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
      <div className="manage-search-bar">
        <input
          type="text"
          placeholder="Search developers & publishers by name..."
          value={query}
          onChange={handleSearch}
        />
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
          {filteredDevAndPubList.length > 0 ? (
            filteredDevAndPubList.map((game) => (
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
