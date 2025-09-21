import React, { useState } from "react";
import "./AssociatedUsers.scss";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../../components/Modals/ConfirmModal";
import { useLazyGetUserByEmailQuery } from "../../../../services/user/userApi";

const UserAssociateInput = ({ handleAddUser }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [fetchUserByEmail] = useLazyGetUserByEmailQuery();

  const handleInputChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleUserFind = async () => {
    if (!userEmail) return toast.error("Enter user email");
    try {
      const { payload } = await fetchUserByEmail(userEmail).unwrap();
      if (payload) {
        setUser(payload);
        setConfirmModalOpen(true);
      } else {
        toast.error("User not found");
      }
    } catch {
      toast.error("User not found");
    }
  };

  const handleAddUserClick = () => {
    if (user && handleAddUser) {
      handleAddUser(user.id);
      setUser(null);
      setUserEmail("");
      setConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div className="user-associate-input">
        <input
          type="email"
          placeholder="Enter user email"
          value={userEmail}
          onChange={handleInputChange}
        />
        <button className="create-manage-btn" onClick={handleUserFind}>
          Add User
        </button>
      </div>
      <ConfirmModal
        title={"Add Associated User"}
        description={
          <>
            Are you sure you want to add the user <strong>{user?.email}</strong>{" "}
            as an associated user?
          </>
        }
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleAddUserClick}
      />
    </>
  );
};

export default UserAssociateInput;
