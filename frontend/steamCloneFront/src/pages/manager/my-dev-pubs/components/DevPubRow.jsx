import { useState } from "react";
import {
  useDeleteDeveloperAndPublisherMutation,
  useUpdateDeveloperAndPublisherMutation,
} from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import { ConfirmModal } from "../../../../components/Modals/ConfirmModal";
import { toast } from "react-toastify";
import { DevPubModal } from "./modal/DevPubModal";
import { useNavigate } from "react-router-dom";
import { useGetIsOwnerQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";


const DevPubRow = ({ devpub, user }) => {
  const navigate = useNavigate();
  const { data: { payload: isOwner } = {}, isLoading: isOwnerLoading } =
      useGetIsOwnerQuery(devpub.id);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteDevPub] = useDeleteDeveloperAndPublisherMutation();
  const [updateDevPub] = useUpdateDeveloperAndPublisherMutation();
  const [modalReset, setModalReset] = useState(() => () => {});

  const handleDeleteDevPub = async (id) => {
    try {
      await deleteDevPub(id).unwrap();
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleEditDevPub = async (updatedData) => {
    try {
      await updateDevPub({ ...updatedData }).unwrap();
      setModalReset();
      setEditModalOpen(false);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  return (
    <>
      <tr key={devpub.id}>
        <td>{isOwnerLoading
            ? "Loading..."
            : isOwner
            ? devpub.createdBy === user.id
              ? "Creator"
              : "Full access"
            : "Partial access"}</td>
        <td style={{ padding: "8px" }}>{devpub.name}</td>
        <td>
          <div className="actions-td">
            <button
              className="edit-manage-btn"
              onClick={() => setEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              className="delete-manage-btn"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </button>
            <button
              className="manage-associated-users-btn"
              onClick={() =>
                navigate(
                  `associated-users/${devpub.id}`
                )
              }
            >
              Manage access
            </button>
          </div>
        </td>
      </tr>
      <ConfirmModal
        title={"Delete Developer/Publisher"}
        description={
          <>
            Are you sure you want to delete <b>{devpub.name}</b>?
          </>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteDevPub(devpub.id)}
      />
      <DevPubModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditDevPub}
        titleText="Edit Developer/Publisher"
        confirmText="Save"
        setModalReset={setModalReset}
        devpub={devpub}
      />
    </>
  );
};

export default DevPubRow;
