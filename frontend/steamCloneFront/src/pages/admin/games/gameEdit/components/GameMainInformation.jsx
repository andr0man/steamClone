import React from "react";
import Select from "react-select";
import selectStyles from "../../components/common/selectStyles";

const GameMainInformation = ({
  form,
  game,
  handleChange,
  handleGenresChange,
  genres,
  handleDevelopersChange,
  handlePublishersChange,
  developersAndPublishers,
  genresLoading,
  developersAndPublishersLoading,
  isGameLoading,
}) => {
  return (
    <div className="game-form-container flux-border">
      <h2>Edit Game Main Information</h2>
      <div className="game-form-inputs">
        <div className="game-form-inputs-panel">
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
        <div className="game-form-inputs-panel">
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
              onChange={handleDevelopersChange}
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
              onChange={handlePublishersChange}
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
    </div>
  );
};

export default GameMainInformation;
