import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateGenreMutation,
  useGetAllGenresQuery,
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
  const [filteredItems, setFilteredItems] = useState(genres);

  useEffect(() => {
    setFilteredItems(genres);
  }, [genres]);

  const handleClose = () => {
    setCreateModalOpen(false);
    modalReset();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredGenres = genres.filter((genre) =>
      genre.name.toLowerCase().includes(query)
    );
    setFilteredItems(filteredGenres);
  };

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

  if (isLoading || !filteredItems)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (isError) return <div>Error loading genres</div>;

  return (
    <div className="manage-container flux-border" style={{ maxWidth: "600px" }}>
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
          className="create-manage-btn"
          onClick={() => setCreateModalOpen(true)}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Genre"}
        </button>
      </div>
      <div className="manage-search-bar">
        <input
          type="text"
          placeholder="Search genres by name..."
          onChange={handleSearch}
        />
      </div>
      <table className="manage-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Genre Name</th>
            <th style={{ textAlign: "center", padding: "8px", width: "160px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((genre) => (
              <GenreRow key={genre.id} genre={genre} />
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: "8px" }}>
                No genres available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <GenreModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateGenre}
        titleText="Create Genre"
        confirmText="Create"
        setModalReset={setModalReset}
      />
    </div>
  );
};

export default ManageGenres;
