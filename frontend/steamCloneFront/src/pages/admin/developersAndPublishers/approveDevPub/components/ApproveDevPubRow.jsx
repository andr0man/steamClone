import React, { useState } from "react";
import { ConfirmModal } from "../../../../../components/Modals/ConfirmModal";
import { useGetUserByIdQuery } from "../../../../../services/user/userApi";
import { useApproveMutation } from "../../../../../services/developerAndPublisher/developerAndPublisherApi";
import { toast } from "react-toastify";

const ApproveDevPubRow = ({ devPub }) => {
  const { data: { payload: user } = {} } = useGetUserByIdQuery(devPub.createdBy);
  const [approve] = useApproveMutation();

  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = () => {
    try {
      approve({ id: devPub.id, isApproved: true }).unwrap();
      setApproveModalOpen(false);
      toast.success("Developer/Publisher approved successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve Developer/Publisher");
    }
  };

  const handleReject = () => {
    try {
      approve({ id: devPub.id, isApproved: false }).unwrap();
      setRejectModalOpen(false);
      toast.success("Developer/Publisher rejected successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject Developer/Publisher");
    }
  };

  return (
    <>
      <tr key={devPub.id}>
        <td style={{ padding: "8px" }}>{devPub.name}</td>
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
        title={"Approve Developer/Publisher"}
        description={
          <>
            Are you sure you want to approve the Developer/Publisher{" "}
            <strong>{devPub.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isApproveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApprove}
      />
      <ConfirmModal
        title={"Reject Developer/Publisher"}
        description={
          <>
            Are you sure you want to reject the Developer/Publisher{" "}
            <strong>{devPub.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
};

export default ApproveDevPubRow;
