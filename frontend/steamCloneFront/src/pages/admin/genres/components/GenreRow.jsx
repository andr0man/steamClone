import { useState } from "react";
import {
  useDeleteGenreMutation,
  useUpdateGenreMutation,
} from "../../../../services/genre/genreApi";
import { ConfirmModal } from "../../../../components/Modals/ConfirmModal";
import { toast } from "react-toastify";
import { GenreModal } from "./modals/GenreModal";

const GenreRow = ({ genre }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteGenre] = useDeleteGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();

  // функція для очищення полів у GenreModal
  const [modalReset, setModalReset] = useState(() => () => {});

  const handleDeleteGenre = async (genreId) => {
    try {
      await deleteGenre(genreId).unwrap();
      toast.success("Genre deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete genre");
    }
  };

  const handleEditGenre = async (updatedData) => {
    try {
      const updatedGenre = { ...updatedData };
      await updateGenre({ ...updatedGenre }).unwrap();
      setModalReset(); // очищаємо поля тільки після успіху
      setEditModalOpen(false);
      toast.success("Genre updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update genre");
    }
  };

  return (
    <>
      <tr key={genre.id}>
        <td style={{ padding: "8px" }}>{genre.name}</td>
        <td style={{ padding: "8px", textAlign: "center" }}>
          <button
            className="edit-genre-btn"
            style={{ marginRight: 8 }}
            onClick={() => setEditModalOpen(true)}
          >
            Edit
          </button>
          <button
            className="delete-genre-btn"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </button>
        </td>
      </tr>
      <ConfirmModal
        title={"Delete Genre"}
        description={
          <>
            Are you sure you want to delete <b>{genre.name}</b> genre?
          </>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteGenre(genre.id)}
      />
      <GenreModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditGenre}
        titleText="Edit Genre"
        confirmText="Save"
        setModalReset={setModalReset}
        genre={genre}
      />
    </>
  );
};

export default GenreRow;
