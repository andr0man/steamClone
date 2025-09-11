import React, { useState } from "react";
import { useRemoveAssociatedUserMutation } from "../../../../../services/game/gameApi";
import { ConfirmModal } from "../../../../../components/Modals/ConfirmModal";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UserAssociateRow = ({ user }) => {
  const { gameId } = useParams();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeUser] = useRemoveAssociatedUserMutation();

  const handleDelete = async () => {
    try {
      await removeUser({ gameId, userId: user.id }).unwrap();
      setDeleteModalOpen(false);
      toast.success("User removed successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove user");
    }
  };

  return (
    <>
      <tr key={user.id}>
        <td style={{ padding: "8px" }}>{user.email}</td>
        <td className="actions-td">
          <button className="delete-manage-btn" onClick={() => setDeleteModalOpen(true)}>Delete</button>
        </td>
      </tr>
      <ConfirmModal
        title={"Remove Associated User"}
        description={
          <>
            Are you sure you want to remove the user{" "}
            <strong>{user.email}</strong> from the associated users?
          </>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default UserAssociateRow;
