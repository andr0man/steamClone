import React, { useEffect, useState } from "react";
import "./DevPubModal.scss";
import "../../../../../styles/App.scss";
import { useGetAllCountrysQuery } from "../../../../../services/country/countryApi";
import { formatDateForInput } from "../../../common/formatDateForInput";
import Select from "react-select";
import selectStyles from "../../../common/selectStyles";

export const DevPubModal = ({
  isOpen,
  onClose,
  onSubmit,
  titleText = "Developer/Publisher Modal",
  confirmText = "Confirm",
  setModalReset,
  devpub = null,
}) => {
  const {
    data: { payload: countries } = { payload: [] },
    isLoading: isCountriesLoading,
  } = useGetAllCountrysQuery();
  const [name, setName] = useState(devpub?.name ?? "");
  const [description, setDescription] = useState(devpub?.description ?? "");
  const [website, setWebsite] = useState(devpub?.website ?? "");
  const [foundedDate, setFoundedDate] = useState(
    devpub?.foundedDate ? formatDateForInput(devpub.foundedDate) : ""
  );
  const [countryId, setCountryId] = useState(devpub?.countryId ?? null);

  useEffect(() => {
    if (setModalReset) {
      setModalReset(() => () => {
        setName("");
        setDescription("");
      });
    }
  }, [setModalReset]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      description,
      id: devpub ? devpub.id : undefined,
      countryId,
      foundedDate,
      website,
    });
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="modal-with-border-container" style={{ minWidth: 900 }}>
        <div className="modal-border"></div>
        <div className="modal-with-border-content">
          <button
            className="my-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <span style={{ fontSize: "2rem" }}>&times;</span>
          </button>
          <h2>{titleText}</h2>
          <form onSubmit={handleSubmit} className="create-devpub-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="devpub-name">Name</label>
                  <input
                    id="devpub-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Name"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="devpub-description">Description</label>
                  <textarea
                    id="devpub-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={4}
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="devpub-country">Country</label>
                  <Select
                    id="devpub-country"
                    defaultValue={
                      devpub && countries
                        ? countries
                            .map((country) => ({
                              value: country.id,
                              label: country.name,
                            }))
                            .find(
                              (option) => option.value === devpub.countryId
                            ) || null
                        : null
                    }
                    options={
                      countries &&
                      countries.map((country) => ({
                        value: country.id,
                        label: country.name,
                      }))
                    }
                    styles={selectStyles}
                    onChange={(opt) => setCountryId(opt ? opt.value : null)}
                    placeholder="Select country..."
                    isClearable
                    isLoading={isCountriesLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Founded Date</label>
                  <input
                    id="foundedDate"
                    name="foundedDate"
                    type="date"
                    value={foundedDate}
                    onChange={(e) => setFoundedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="devpub-website">Website</label>
                  <input
                    id="devpub-website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website (optional)"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="white-button" onClick={onClose}>
                <div>Cancel</div>
              </button>
              <button type="submit" className="rainbow-button">
                <div>{confirmText}</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
