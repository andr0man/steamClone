import React, { useState } from "react";
import "./SystemRequirements.scss";
import { ConfirmModal } from "../../../../../../components/ConfirmModal";

const Row = ({ label, name, value, onChange, readOnly }) => (
  <div className="req-row">
    <label>{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      readOnly={readOnly}
    />
  </div>
);

const SystemRequirements = ({
  game,
  minForm,
  recForm,
  onMinChange,
  onRecChange,
  onCreateMinimum,
  onUpdateMinimum,
  onDeleteMinimum,
  onCreateRecommended,
  onUpdateRecommended,
  onDeleteRecommended,
  busy,
}) => {
  const [isDeleteMinReqOpen, setDeleteMinReqOpen] = useState(false);
  const [isDeleteRecReqOpen, setDeleteRecReqOpen] = useState(false);

  const handleDeleteMinReq = () => {
    onDeleteMinimum();
    setDeleteMinReqOpen(false);
  };

  const handleDeleteRecReq = () => {
    onDeleteRecommended();
    setDeleteRecReqOpen(false);
  };

  const minimum = Array.isArray(game.systemRequirements)
    ? game.systemRequirements.find(
        (req) => req.requirementType === "Minimum" && req.platform === "Windows"
      )
    : null;
  const recommended = Array.isArray(game.systemRequirements)
    ? game.systemRequirements.find(
        (req) =>
          req.requirementType === "Recommended" && req.platform === "Windows"
      )
    : null;

  const renderSection = (
    title,
    hasReq,
    form,
    onChange,
    onCreate,
    onUpdate,
    onDelete
  ) => (
    <div className="requirement-section">
      <h4>{title}</h4>
      <div className="req-grid">
        <Row
          label="OS"
          name="os"
          value={form?.os || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="Processor"
          name="processor"
          value={form?.processor || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="Memory"
          name="memory"
          value={form?.memory || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="Graphics"
          name="graphics"
          value={form?.graphics || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="DirectX"
          name="directX"
          value={form?.directX || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="Storage"
          name="storage"
          value={form?.storage || ""}
          onChange={onChange}
          readOnly={false}
        />
        <Row
          label="Network"
          name="network"
          value={form?.network || ""}
          onChange={onChange}
          readOnly={false}
        />
      </div>
      <div className="req-actions">
        {hasReq ? (
          <>
            <button disabled={busy} onClick={onUpdate}>
              Update
            </button>
            <button disabled={busy} className="danger" onClick={onDelete}>
              Delete
            </button>
          </>
        ) : (
          <button disabled={busy} onClick={onCreate}>
            Create
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="game-form-container flux-border">
      <div className="system-requirements-panel">
        <h3>System Requirements</h3>
        <div className="requirements-section">
          {renderSection(
            "Minimum",
            !!minimum,
            minForm,
            onMinChange,
            onCreateMinimum,
            onUpdateMinimum,
            () => setDeleteMinReqOpen(true)
          )}
          {renderSection(
            "Recommended",
            !!recommended,
            recForm,
            onRecChange,
            onCreateRecommended,
            onUpdateRecommended,
            () => setDeleteRecReqOpen(true)
          )}
        </div>
      </div>
      <ConfirmModal
        title="Delete Requirement"
        description="Are you sure you want to delete minimum system requirement?"
        isOpen={isDeleteMinReqOpen}
        onClose={() => setDeleteMinReqOpen(false)}
        onConfirm={handleDeleteMinReq}
      />
      <ConfirmModal
        title="Delete Requirement"
        description="Are you sure you want to delete recommended system requirement?"
        isOpen={isDeleteRecReqOpen}
        onClose={() => setDeleteRecReqOpen(false)}
        onConfirm={handleDeleteRecReq}
      />
    </div>
  );
};

export default SystemRequirements;
