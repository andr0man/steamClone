import React, { useState } from "react";
import { ConfirmModal } from "../../../../../components/Modals/ConfirmModal";
import { useGetUserByIdQuery } from "../../../../../services/user/userApi";
import { useApproveMutation } from "../../../../../services/game/gameApi";
import { toast } from "react-toastify";

const ApproveGameRow = ({ game }) => {
  const { data: { payload: user } = {} } = useGetUserByIdQuery(game.createdBy);
  const [approveGame] = useApproveMutation();

  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = () => {
    try {
      approveGame({ id: game.id, isApproved: true }).unwrap();
      setApproveModalOpen(false);
      toast.success("Game approved successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve game");
    }
  };

  const handleReject = () => {
    try {
      approveGame({ id: game.id, isApproved: false }).unwrap();
      setRejectModalOpen(false);
      toast.success("Game rejected successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject game");
    }
  };

  return (
    <>
      <tr key={game.id}>
        <td style={{ padding: "8px" }}>{game.name}</td>
        <td style={{ padding: "8px" }}>{user?.email}</td>
        <td className="actions-td">
          <button
            className="delete-manage-btn"
            onClick={() => setRejectModalOpen(true)}
          >
            Reject
          </button>
          <button
            className="edit-manage-btn"
            onClick={() => setApproveModalOpen(true)}
          >
            Approve
          </button>
        </td>
      </tr>
      <ConfirmModal
        title={"Approve Game"}
        description={
          <>
            Are you sure you want to approve the game{" "}
            <strong>{game.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isApproveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApprove}
      />
      <ConfirmModal
        title={"Reject Game"}
        description={
          <>
            Are you sure you want to reject the game{" "}
            <strong>{game.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
};

export default ApproveGameRow;
