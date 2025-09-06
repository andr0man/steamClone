import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateGenreMutation,
  useGetAllGenresQuery
} from "../../../services/genre/genreApi";
import "../../../styles/App.scss";
import "./ManageGenres.scss";
import GenreRow from "./components/GenreRow";
import { GenreModal } from "./components/modals/GenreModal";
import "../../../styles/App.scss";

const ManageGenres = () => {
  const { data: genresResponse, isLoading, isError } = useGetAllGenresQuery();
  const genres = genresResponse?.payload;
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
  // функція для очищення полів у GenreModal
  const [modalReset, setModalReset] = useState(() => () => {});

  if (isLoading)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (isError) return <div>Error loading genres</div>;


  const handleCreateGenre = async (genreData) => {
    try {
      await createGenre(genreData).unwrap();
      setCreateModalOpen(false);
      modalReset(); // очищаємо поля тільки після успіху
      toast.success("Genre created successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create genre");
    }
  };

  return (
    <div className="manage-genres-container flux-border">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Manage Genres</h2>
        <button
          className="create-genre-btn"
          onClick={() => setCreateModalOpen(true)}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Genre"}
        </button>
      </div>
      <table
        className="genres-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Genre Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "160px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <GenreRow key={genre.id} genre={genre} />
          ))}
        </tbody>
      </table>
      <GenreModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateGenre}
        titleText="Create Genre"
        confirmText="Create"
        setModalReset={setModalReset}
      />
    </div>
  );
};

export default ManageGenres;
