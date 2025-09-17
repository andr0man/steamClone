import React from "react";
import Select from "react-select";
import selectStyles from "../../../../admin/common/selectStyles";
import { useGetAllGenresQuery } from "../../../../../services/genre/genreApi";
import { useByAssociatedUserQuery } from "../../../../../services/developerAndPublisher/developerAndPublisherApi";

const MyGameMainInformation = ({
  form,
  game,
  handleChange,
  handleGenresChange,
  handleDevelopersChange,
  handlePublishersChange,
  isGameLoading,
}) => {
  const {
    data: { payload: genres } = { payload: [] },
    isLoading: genresLoading,
  } = useGetAllGenresQuery();

  const {
    data: { payload: developersAndPublishers } = { payload: [] },
    isLoading: developersAndPublishersLoading,
  } = useByAssociatedUserQuery(true);

  if (isGameLoading || genresLoading || developersAndPublishersLoading)
    return <div className="loading-overlay visible">Loading data...</div>;

  const devAndPubForSelect = developersAndPublishers
    .map((d) => ({ value: d.id, label: d.name }));

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
              rows={4}
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
              type="date"
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
                devAndPubForSelect.find((option) => option.value === game.developerId) || { value: game.developer.id, label: game.developer.name }
              }
              options={devAndPubForSelect}
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
                devAndPubForSelect.find((option) => option.value === game.publisherId) || { value: game.publisher.id, label: game.publisher.name }
              }
              options={devAndPubForSelect}
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

export default MyGameMainInformation;
