import React, { useState } from "react";
import { useLazyGetUserByEmailQuery } from "../../../../services/user/userApi";
import { ConfirmModal } from "../../../../components/Modals/ConfirmModal";
import { toast } from "react-toastify";
import { useCreateUserItemMutation } from "../../../../services/inventory/inventoryApi";

const GiveItemToUserModal = ({ isOpen, onClose, item, isLoading }) => {
  if (!isOpen) return null;
  const [userEmail, setUserEmail] = useState("");
  const [isTradeable, setIsTradeable] = useState(true);
  const [user, setUser] = useState(null);
  const [fetchUserByEmail, { data: userData, isFetching }] =
    useLazyGetUserByEmailQuery();
  const [createUserItem, { isLoading: isCreating }] =
    useCreateUserItemMutation();

  const handleOpenConfirmModal = async () => {
    try {
      const { payload: user } = await fetchUserByEmail(userEmail).unwrap();
      setUser(user);
    } catch (error) {
      toast.error("User not found");
    }
  };

  const handleConfirm = () => {
    try {
      createUserItem({
        userId: user.id,
        itemId: item.id,
        isTradable: isTradeable,
      }).unwrap();
      setUserEmail("");
      setIsTradeable(true);
      onClose();
      setUser(null);
      toast.success("Item given successfully");
    } catch (error) {
      toast.error("Failed to give item");
    }
  };

  return (
    <>
      <div className="confirm-modal-overlay">
        <div className="modal-with-border-container">
          <div className="modal-border"></div>
          <div className="modal-with-border-content">
            <button
              className="my-modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <span style={{ fontSize: "2rem" }}>&times;</span>
            </button>
            <h2>Give Item</h2>
            <form className="create-item-form">
              <div
                style={{
                  display: "grid",
                  gap: "2rem",
                  gridTemplateColumns: "4fr 1fr",
                }}
              >
                <div className="form-group">
                  <label htmlFor="item-name">User Email</label>
                  <input
                    id="item-name"
                    type="text"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    placeholder="User email"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-description">Is Tradeable</label>
                  <input
                    id="item-description"
                    type="checkbox"
                    checked={isTradeable}
                    onChange={() => setIsTradeable(!isTradeable)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="white-button"
                  onClick={onClose}
                >
                  <div>Cancel</div>
                </button>
                <button
                  type="button"
                  className="rainbow-button"
                  onClick={handleOpenConfirmModal}
                  disabled={isLoading}
                >
                  <div>{isLoading ? "Loading..." : "Give Item"}</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={!!user}
        onClose={() => setUser(null)}
        title="Confirm Item Transfer"
        description={
          <p>
            Are you sure you want to give this item "<b>{item.name}</b>" to "
            <b>{user?.email}</b>"?
          </p>
        }
        onConfirm={handleConfirm}
      >
        <p>Are you sure you want to give this item to {user?.email}?</p>
      </ConfirmModal>
    </>
  );
};

export default GiveItemToUserModal;
