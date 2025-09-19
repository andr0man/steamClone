import React, { useState } from "react";
import { useCreateGameMutation } from "../../../../services/game/gameApi";
import { useGetAllGenresQuery } from "../../../../services/genre/genreApi";
import "./GameCreate.scss";
import "../components/common/StylesForGameForm.scss";
import { toast } from "react-toastify";
import Select from "react-select";
import selectStyles from "../../common/selectStyles";
import { useGetAllDevelopersAndPublishersQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import { useNavigate } from "react-router-dom";

const GameCreate = () => {
  const navigate = useNavigate();
  const [createGame, { isLoading }] = useCreateGameMutation();
  const {
    data: { payload: genres } = { payload: [] },
    isLoading: genresLoading,
  } = useGetAllGenresQuery();

  const {
    data: { payload: developersAndPublishers } = { payload: [] },
    isLoading: developersAndPublishersLoading,
  } = useGetAllDevelopersAndPublishersQuery();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    releaseDate: new Date().toISOString().slice(0, 16),
    developerId: "",
    publisherId: "",
    genresIds: [],
  });

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
      const {payload: created} = await createGame({
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
      }).unwrap();
      toast.success("Game created successfully");
      setForm({
        name: "",
        description: "",
        price: 0,
        releaseDate: new Date().toISOString().slice(0, 16),
        developerId: "",
        publisherId: "",
        genresIds: [],
      });
      navigate(`/admin/games/edit/${created.id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create game");
    }
  };

  return (
    <>
      <div className="edit-topbar">
        <div className="form-actions">
          <button
            type="button"
            className="cancel-game-btn"
            onClick={() => navigate("/admin/games")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-game-btn"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Creating..." : "Create Game"}
          </button>
        </div>
      </div>
      <div className="game-form-container flux-border">
        <h2>Create Game</h2>
        <div className="game-form-inputs">
          <div className="game-form-inputs-panel">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter game name..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter game description..."
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step={"0.01"}
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Enter game price..."
              />
            </div>
            <div className="form-group">
              <label>Release Date</label>
              <input
                name="releaseDate"
                type="date"
                value={form.releaseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="game-form-inputs-panel">
            <div className="form-group">
              <label>Developer</label>
              <Select
                name="developerId"
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
                isLoading={developersAndPublishersLoading}
              />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <Select
                name="publisherId"
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
                isLoading={developersAndPublishersLoading}
              />
            </div>
            <div className="form-group">
              <label>Genres</label>
              <Select
                name="genresIds"
                isMulti
                options={genres.map((g) => ({ value: g.id, label: g.name }))}
                isLoading={genresLoading}
                onChange={handleGenresChange}
                styles={selectStyles}
                placeholder="Select genres..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCreate;
