import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserAssociateRow from "./components/UserAssociateRow";
import { useGetAssociatedUsersQuery, useAssociateUserMutation } from "../../../../services/game/gameApi";
import UserAssociateInput from "../../common/associatedUsers/UserAssociateInput";
import { toast } from "react-toastify";
import { useSearchFilter } from "../../../../components/Search/useSearchFilter";

const ManageGameAssociatedUsers = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { data: { payload: associatedUsers } = { payload: [] }, isLoading } =
    useGetAssociatedUsersQuery(gameId);
  const [associateUser] = useAssociateUserMutation();

  const {
    query,
    filteredList: filteredUsers,
    handleSearch,
  } = useSearchFilter(associatedUsers, (item, query) =>
    item.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddUser = async (userId) => {
    try {
      await associateUser({ gameId, userId }).unwrap();
      toast.success("User added successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add user");
    }
  };

  if (isLoading)
    return <div className="loading-overlay visible">Loading data...</div>;

  return (
    <div className="manage-container flux-border" style={{ maxWidth: 600 }}>
      <div
        className="associated-users-header"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h2 style={{ margin: 0 }}>Manage Associated Users</h2>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <UserAssociateInput handleAddUser={handleAddUser} />
      </div>
      <div className="manage-search-bar">
        <input
          type="text"
          placeholder="Search users by email..."
          onChange={handleSearch}
          value={query}
        />
      </div>
      <table
        className="manage-table"
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
            <th style={{ textAlign: "center", padding: "8px", width: "140px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserAssociateRow key={user.id} user={user} />
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: "8px" }}>
                No associated users assigned
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageGameAssociatedUsers;
