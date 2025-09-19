import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteGameItemMutation,
  useUpdateGameItemMutation,
  useUpdateItemImageMutation,
} from "../../../../services/gameItem/gameItemApi";
import ItemModal from "./modal/ItemModal";
import {ConfirmModal} from "../../../../components/Modals/ConfirmModal";

const ItemRow = ({ item, refetch }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalReset, setModalReset] = useState(() => () => {});
  const [isModalLoading, setModalLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const [updateGameItem] = useUpdateGameItemMutation();
  const [updateItemImage] = useUpdateItemImageMutation();
  const [deleteGameItem] = useDeleteGameItemMutation();

  const handleEditItem = async (data) => {
    setModalLoading(true);
    try {
      // Step 1: update item
      const { imageFile, ...itemData } = data;
      await updateGameItem({ id: item.id, ...itemData }).unwrap();
      // Step 2: upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await updateItemImage({ itemId: item.id, formData }).unwrap();
      }
      setEditModalOpen(false);
      toast.success("Game item updated successfully");
      modalReset();
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update game item");
    }
    setModalLoading(false);
  };

  const handleDeleteItem = async () => {
    setDeleting(true);
    try {
      await deleteGameItem(item.id).unwrap();
      setDeleteModalOpen(false);
      toast.success("Game item deleted");
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete game item");
    }
    setDeleting(false);
  };

  return (
    <>
      <tr key={item.id}>
        <td style={{ padding: "8px" }}>
          <img
            src={item.imageUrl ?? "/common/itemNoImage.png"}
            alt={item.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </td>
        <td style={{ padding: "8px" }}>{item.name}</td>
        <td style={{ padding: "8px", textAlign: "center" }}>
          <div className="actions-cell">
            <button
              className="edit-manage-btn"
              onClick={() => setEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              className="delete-manage-btn"
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>
      <ItemModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditItem}
        titleText="Edit Game Item"
        confirmText="Save"
        item={item}
        setModalReset={setModalReset}
        isLoading={isModalLoading}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        title="Delete Game Item?"
        description={`Are you sure you want to delete '${item.name}'? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ItemRow;
