import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateGameItemMutation,
  useGetByGameIdQuery,
  useUpdateItemImageMutation,
} from "../../../services/gameItem/gameItemApi";
import ItemRow from "./components/ItemRow";
import ItemModal from "./components/modal/ItemModal";
import "./ManageMyGameItems.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchFilter } from "../../../components/Search/useSearchFilter";

const ManageMyGameItems = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const {
    data: { payload: gameItems } = { payload: [] },
    isLoading,
    error,
    refetch,
  } = useGetByGameIdQuery(gameId);
  const [createGameItem, { isLoading: isCreating }] =
    useCreateGameItemMutation();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [modalReset, setModalReset] = useState(() => () => {});
  const [isModalLoading, setModalLoading] = useState(false);
  const [updateItemImage] = useUpdateItemImageMutation();

  const {
    query,
    filteredList: filteredGameItems,
    handleSearch,
  } = useSearchFilter(gameItems, (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleClose = () => {
    setCreateModalOpen(false);
    modalReset();
  };

  const handleCreateItem = async (data) => {
    setModalLoading(true);
    try {
      // Step 1: create item
      const { imageFile, ...itemData } = data;
      const { payload: created } = await createGameItem({
        ...itemData,
        gameId,
      }).unwrap();
      // Step 2: upload image if selected
      if (imageFile && !isCreating) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await updateItemImage({
          itemId: created.id,
          formData,
        }).unwrap();
      }
      setCreateModalOpen(false);
      toast.success("Game item created successfully");
      modalReset();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create game item");
    }
    setModalLoading(false);
  };

  if (isLoading)
    return <div className="loading-overlay visible">Loading data...</div>;

  if (error) return <div>Error loading game items</div>;

  return (
    <div className="manage-container flux-border" style={{ maxWidth: "700px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Manage Game Items</h2>
        <div className="button-items-group">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
          <button
            className="create-manage-btn"
            onClick={() => setCreateModalOpen(true)}
            disabled={isCreating || isModalLoading}
          >
            {isCreating || isModalLoading ? "Creating..." : "Create Game Item"}
          </button>
        </div>
      </div>
      <div className="manage-search-bar">
        <input
          type="text"
          placeholder="Search game items by name..."
          onChange={handleSearch}
          value={query}
        />
      </div>
      <table className="manage-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px", width: "150px" }}>
              Image
            </th>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "140px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredGameItems.length > 0 ? (
            filteredGameItems.map((item) => (
              <ItemRow key={item.id} item={item} refetch={refetch} />
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "8px" }}>
                No game items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ItemModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateItem}
        titleText="Create Game Item"
        confirmText="Create"
        setModalReset={setModalReset}
        isLoading={isModalLoading}
      />
    </div>
  );
};

export default ManageMyGameItems;
