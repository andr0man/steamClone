import React, { useState } from "react";
import "./GameEdit.scss";
import {
  useUpdateGameMutation,
  useGetGameByIdQuery,
} from "../../../../services/game/gameApi";
import "../../../../styles/App.scss";
import "../components/common/StylesForGameForm.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGenresQuery } from "../../../../services/genre/genreApi";
import { useGetAllDevelopersAndPublishersQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import Select from "react-select";
import selectStyles from "../components/common/selectStyles";
import { toast } from "react-toastify";

const GameEdit = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const {
    data: { payload: game } = {},
    isLoading: isGameLoading,
    error,
  } = useGetGameByIdQuery(gameId);

  const [updateGame, { isLoading }] = useUpdateGameMutation();
  const {
    data: { payload: genres } = { payload: [] },
    isLoading: genresLoading,
  } = useGetAllGenresQuery();

  const {
    data: { payload: developersAndPublishers } = { payload: [] },
    isLoading: developersAndPublishersLoading,
  } = useGetAllDevelopersAndPublishersQuery();

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return new Date().toISOString().slice(0, 16);
    const date = new Date(dateStr);
    // Get local ISO string without seconds/milliseconds
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // form створюється після завантаження гри
  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (!isGameLoading && game) {
      setForm({
        name: game.name,
        description: game.description,
        price: game.price,
        discount: game.discount || 0,
        releaseDate: formatDateForInput(game.releaseDate),
        developerId: game.developerId || "",
        publisherId: game.publisherId || "",
        genresIds: game.genres ? game.genres.map((g) => g.id) : [],
      });
    }
  }, [isGameLoading, game]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      genresIds: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form:", {
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
        id: gameId,
      });
      await updateGame({
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
        id: gameId,
      }).unwrap();
      toast.success("Game updated successfully");
      setForm({
        name: "",
        description: "",
        price: 0,
        discount: 0,
        releaseDate: new Date().toISOString().slice(0, 16),
        developerId: "",
        publisherId: "",
        genresIds: [],
      });
      navigate("/admin/games");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update game");
    }
  };

  if (isGameLoading)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading game</div>;

  return (
    <div className="game-create-container flux-border">
      <h2>Edit Game</h2>
      <form className="game-create-form" onSubmit={handleSubmit}>
        <div className="game-create-inputs">
          <div className="game-create-inputs-panel">
            <div className="form-group">
              <label>Name</label>
              <input
                id="name"
                name="name"
                value={form?.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                id="description"
                name="description"
                value={form?.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step={"0.01"}
                value={form?.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Release Date</label>
              <input
                id="releaseDate"
                name="releaseDate"
                type="datetime-local"
                value={form?.releaseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="game-create-inputs-panel">
            <div className="form-group">
              <label>Discount</label>
              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step={"0.01"}
                value={form?.discount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Developer</label>
              <Select
                id="developerId"
                name="developerId"
                defaultValue={
                  developersAndPublishers
                    .map((d) => ({ value: d.id, label: d.name }))
                    .find((option) => option.value === game.developerId) || null
                }
                options={developersAndPublishers.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                onChange={(selectedOption) =>
                  setForm((prev) => ({
                    ...prev,
                    developerId: selectedOption ? selectedOption.value : "",
                  }))
                }
                styles={selectStyles}
                placeholder="Select developer..."
                isLoading={developersAndPublishersLoading || isGameLoading}
              />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <Select
                id="publisherId"
                name="publisherId"
                defaultValue={
                  developersAndPublishers
                    .map((d) => ({ value: d.id, label: d.name }))
                    .find((option) => option.value === game.publisherId) || null
                }
                options={developersAndPublishers.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                onChange={(selectedOption) =>
                  setForm((prev) => ({
                    ...prev,
                    publisherId: selectedOption ? selectedOption.value : "",
                  }))
                }
                styles={selectStyles}
                placeholder="Select publisher..."
                isLoading={developersAndPublishersLoading || isGameLoading}
              />
            </div>
            <div className="form-group">
              <label>Genres</label>
              <Select
                id="genresIds"
                name="genresIds"
                isMulti
                defaultValue={genres
                  .map((g) => ({ value: g.id, label: g.name }))
                  .filter((option) =>
                    game.genres.some((genre) => genre.id === option.value)
                  )}
                options={genres.map((g) => ({ value: g.id, label: g.name }))}
                isLoading={isGameLoading || genresLoading}
                onChange={handleGenresChange}
                styles={selectStyles}
                placeholder="Select genres..."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-game-btn" onClick={() => navigate("/admin/games")}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-game-btn"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameEdit;
