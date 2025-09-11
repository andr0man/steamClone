import React, { useState, useEffect } from "react";
import "./ItemModal.scss";

const ItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  titleText = "Game Item Modal",
  confirmText = "Confirm",
  setModalReset,
  item = null,
  isLoading = false,
}) => {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (setModalReset) {
      setModalReset(() => () => {
        setName("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      });
    }
  }, [setModalReset]);

  useEffect(() => {
    if (item?.imageUrl) setImagePreview(item.imageUrl);
    setName(item?.name ?? "");
    setDescription(item?.description ?? "");
  }, [item]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      description,
      id: item ? item.id : undefined,
      imageFile,
    });
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="modal-with-border-container">
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
          <form onSubmit={handleSubmit} className="create-item-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="item-image">Image</label>
                  <input
                    id="item-image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleFileChange}
                  />
                  {imagePreview ? (
                    <div className="item-image-preview">
                      <img src={imagePreview} alt="Item Preview" />
                    </div>
                  ) : (
                    <p>No image selected</p>
                  )}
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="item-name">Name</label>
                  <input
                    id="item-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Item name"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-description">Description</label>
                  <textarea
                    id="item-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Item description (optional)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="white-button" onClick={onClose}>
                <div>Cancel</div>
              </button>
              <button
                type="submit"
                className="rainbow-button"
                disabled={isLoading}
              >
                <div>{confirmText}</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
