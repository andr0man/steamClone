import React, { useState } from "react";
import {
  useGetAllDevelopersAndPublishersQuery,
  useCreateDeveloperAndPublisherMutation,
} from "../../../services/developerAndPublisher/developerAndPublisherApi";
import "./ManageDevAndPub.scss";
import DevPubRow from "./components/DevPubRow";
import { DevPubModal } from "./components/modal/DevPubModal";
import { toast } from "react-toastify";

const ManageDevAndPub = () => {
  const {
    data: { payload: devAndPubList } = { payload: [] },
    error,
    isLoading,
  } = useGetAllDevelopersAndPublishersQuery();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createDevPub, { isLoading: isCreating }] =
    useCreateDeveloperAndPublisherMutation();
  const [modalReset, setModalReset] = useState(() => () => {});

  if (isLoading)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading developers and publishers</div>;

  const handleCreateDevPub = async (data) => {
    try {
      await createDevPub(data).unwrap();
      setCreateModalOpen(false);
      toast.success("Created successfully");
      modalReset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create");
    }
  };

  return (
    <div className="manage-container flux-border">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Manage Developers & Publishers</h2>
        <button
          className="create-manage-btn"
          onClick={() => setCreateModalOpen(true)}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Developer/Publisher"}
        </button>
      </div>
      <table
        className="manage-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "340px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {devAndPubList.length > 0 ? devAndPubList.map((item) => (
            <DevPubRow key={item.id} devpub={item} />
          )) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: "8px" }}>
                No developers or publishers available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <DevPubModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateDevPub}
        titleText="Create Developer/Publisher"
        confirmText="Create"
        setModalReset={setModalReset}
      />
    </div>
  );
};

export default ManageDevAndPub;
