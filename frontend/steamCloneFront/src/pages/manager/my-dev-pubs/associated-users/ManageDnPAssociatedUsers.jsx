import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserAssociateRow from "./components/UserAssociateRow";
import {
  useGetAssociatedUsersQuery,
  useAssociateUserMutation,
} from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import UserAssociateInput from "../../../admin/common/associatedUsers/UserAssociateInput";
import { toast } from "react-toastify";

const ManageDevAndPubAssociatedUsers = () => {
  const navigate = useNavigate();
  const { devpubId } = useParams();
  const { data: { payload: associatedUsers } = { payload: [] }, isLoading } =
    useGetAssociatedUsersQuery(devpubId);
  const [associateUser] = useAssociateUserMutation();

  const handleAddUser = async (userId) => {
    try {
      await associateUser({ developerAndPublisherId: devpubId, userId }).unwrap();
      toast.success("User added successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add user");
    }
  };

  if (isLoading)
    return <div className="loading-overlay visible">Loading data...</div>;

  return (
    <div className="manage-container flux-border" style={{ maxWidth: 600 }}>
      <div className="associated-users-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h2 style={{ margin: 0 }}>Manage Associated Users</h2>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
        <UserAssociateInput handleAddUser={handleAddUser} />
      </div>
      <table
        className="manage-table"
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "140px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {associatedUsers.length > 0 ? (
            associatedUsers.map((user) => (
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

export default ManageDevAndPubAssociatedUsers;
