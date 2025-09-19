import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetGameByIdQuery,
  useUpdateCoverImageMutation,
  useUpdateGameMutation,
  useUpdateScreenshotsMutation,
} from "../../../../services/game/gameApi";
import {
  useCreateSystemRequirementMutation,
  useDeleteSystemRequirementMutation,
  useUpdateSystemRequirementMutation,
} from "../../../../services/gameSystemRequirements/gameSystemRequrementsApi";
import "../../../../styles/App.scss";
import MyGameCoverImage from "./components/game-cover-image/MyGameCoverImage";
import MyGameLocalizations from "./components/game-localizations/MyGameLocalizations";
import MyGameMainInformation from "./components/MyGameMainInformation";
import MyGameScreenshots from "./components/game-screenshots/MyGameScreenshots";
import SystemRequirements from "./components/system-requirements/SystemRequirements"
import "./MyGameEdit.scss";
import { formatDateForInput } from "../../../admin/common/formatDateForInput";

const MyGameEdit = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const {
    data: { payload: game } = {},
    isLoading: isGameLoading,
    error,
    refetch: refetchGame,
  } = useGetGameByIdQuery(gameId);

  const [updateGame, { isLoading }] = useUpdateGameMutation();
  const [updateScreenshots, { isLoading: isUpdatingScreenshots }] =
    useUpdateScreenshotsMutation();
  const [updateCoverImage, { isLoading: isUpdatingCoverImage }] =
    useUpdateCoverImageMutation();

  // form створюється після завантаження гри
  const [form, setForm] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  // System requirements forms (Windows platform, Minimum & Recommended)
  const blankReqForm = {
    os: "",
    processor: "",
    memory: "",
    graphics: "",
    directX: "",
    storage: "",
    network: "",
  };
  const [minReqForm, setMinReqForm] = useState(null);
  const [recReqForm, setRecReqForm] = useState(null);

  useEffect(() => {
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
  }, [isGameLoading]);

  useEffect(() => {
    if (!isGameLoading && game) {
      setCoverImagePreview(game.coverImageUrl);
      // Initialize system requirements forms
      const sysReqs = Array.isArray(game.systemRequirements)
        ? game.systemRequirements
        : [];
      const min = sysReqs.find(
        (r) => r.requirementType === "Minimum" && r.platform === "Windows"
      );
      const rec = sysReqs.find(
        (r) => r.requirementType === "Recommended" && r.platform === "Windows"
      );
      setMinReqForm(
        min
          ? {
              os: min.os || "",
              processor: min.processor || "",
              memory: min.memory || "",
              graphics: min.graphics || "",
              directX: min.directX || "",
              storage: min.storage || "",
              network: min.network || "",
            }
          : { ...blankReqForm }
      );
      setRecReqForm(
        rec
          ? {
              os: rec.os || "",
              processor: rec.processor || "",
              memory: rec.memory || "",
              graphics: rec.graphics || "",
              directX: rec.directX || "",
              storage: rec.storage || "",
              network: rec.network || "",
            }
          : { ...blankReqForm }
      );
    }
  }, [isGameLoading, game]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [coverImageFile, setCoverImageFile] = useState(null);

  const onFileSelectionChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const cancelCoverImageChange = () => {
    setCoverImageFile(null);
    setCoverImagePreview(game.coverImageUrl);
  };

  const onCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null);
    }
  };

  const markImageForDeletion = (image) => {
    setImagesToDelete((prev) => [...prev, image]);
  };

  const handleCoverImageUpload = async ({ globalSaving = false }) => {
    if (!coverImageFile) {
      if (globalSaving) return true;
      toast.error("Please select a cover image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);
      await updateCoverImage({ gameId, formData }).unwrap();
      setCoverImageFile(null);
      if (globalSaving) {
        setCoverImagePreview(null);
      }
      if (globalSaving) return true;
      toast.success("Cover image updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update cover image");
      return false;
    }
  };

  const handleUpdateScreenshots = async ({ globalSaving = false }) => {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("newImages", file);
    });

    imagesToDelete.forEach((img) => {
      formData.append("imagesToDelete", img);
    });

    try {
      await updateScreenshots({ gameId, formData }).unwrap();
      setSelectedFiles([]);
      // Wait for game data to reload before clearing imagesToDelete
      await refetchGame();
      setImagesToDelete([]);
      if (globalSaving) return true;
      toast.success("Screenshots updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update screenshots");
      return false;
    }
  };

  const cancelScreenshotsChange = () => {
    setSelectedFiles([]);
    setImagesToDelete([]);
  };

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

  const handleDevelopersChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      developerId: selectedOption ? selectedOption.value : "",
    }));
  };

  const handlePublishersChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      publisherId: selectedOption ? selectedOption.value : "",
    }));
  };

  // System requirements CRUD
  const [createSystemRequirement, { isLoading: isCreatingSysReq }] =
    useCreateSystemRequirementMutation();
  const [updateSystemRequirement, { isLoading: isUpdatingSysReq }] =
    useUpdateSystemRequirementMutation();
  const [deleteSystemRequirement, { isLoading: isDeletingSysReq }] =
    useDeleteSystemRequirementMutation();

  const anySysReqBusy =
    isCreatingSysReq || isUpdatingSysReq || isDeletingSysReq || isGameLoading;

  const handleMinReqChange = (e) => {
    const { name, value } = e.target;
    setMinReqForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRecReqChange = (e) => {
    const { name, value } = e.target;
    setRecReqForm((prev) => ({ ...prev, [name]: value }));
  };

  const getReqByType = (type) => {
    const sysReqs = Array.isArray(game?.systemRequirements)
      ? game.systemRequirements
      : [];
    const found = sysReqs.find(
      (r) => r.requirementType === type && r.platform === "Windows"
    );
    if (!found) return null;
    // Return a new object with correct numeric platform/type for API
    return {
      ...found,
      platform: 0, // Windows
      requirementType: type === "Minimum" ? 0 : 1,
    };
  };

  const createMinimum = async () => {
    try {
      await createSystemRequirement({
        gameId,
        platform: 0,
        requirementType: 0,
        ...minReqForm,
      }).unwrap();
      toast.success("Minimum requirements created");
      await refetchGame();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to create minimum requirements"
      );
    }
  };
  const updateMinimum = async ({ globalSaving = false }) => {
    const current = getReqByType("Minimum");
    if (!current) return true; // nothing to update
    try {
      await updateSystemRequirement({
        id: current.id,
        ...current,
        ...minReqForm,
      }).unwrap();
      if (!globalSaving) {
        toast.success("Minimum requirements updated");
      }
      await refetchGame();
      return true;
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update minimum requirements"
      );
      return false;
    }
  };
  const deleteMinimum = async () => {
    const current = getReqByType("Minimum");
    if (!current) return;
    try {
      await deleteSystemRequirement(current.id).unwrap();
      setMinReqForm({ ...blankReqForm });
      toast.success("Minimum requirements deleted");
      await refetchGame();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to delete minimum requirements"
      );
    }
  };

  const createRecommended = async () => {
    try {
      await createSystemRequirement({
        gameId,
        platform: 0,
        requirementType: 1,
        ...recReqForm,
      }).unwrap();
      toast.success("Recommended requirements created");
      await refetchGame();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to create recommended requirements"
      );
    }
  };
  const updateRecommended = async ({ globalSaving = false }) => {
    const current = getReqByType("Recommended");
    if (!current) return true; // nothing to update
    try {
      await updateSystemRequirement({
        id: current.id,
        ...current,
        ...recReqForm,
      }).unwrap();
      if (!globalSaving) {
        toast.success("Recommended requirements updated");
      }
      await refetchGame();
      return true;
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update recommended requirements"
      );
      return false;
    }
  };
  const deleteRecommended = async () => {
    const current = getReqByType("Recommended");
    if (!current) return;
    try {
      await deleteSystemRequirement(current.id).unwrap();
      setRecReqForm({ ...blankReqForm });
      toast.success("Recommended requirements deleted");
      await refetchGame();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to delete recommended requirements"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGame({
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
        id: gameId,
      }).unwrap();

      if (!(await handleUpdateScreenshots({ globalSaving: true }))) {
        return;
      }
      if (!(await handleCoverImageUpload({ globalSaving: true }))) {
        return;
      }
      if (!(await updateMinimum({ globalSaving: true }))) {
        return;
      }
      if (!(await updateRecommended({ globalSaving: true }))) {
        return;
      }

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
      navigate("/manager/my-games");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update game");
    }
  };

  if (isGameLoading || !form)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading game</div>;

  return (
    <div className="game-forms-containers">
      <div className="edit-topbar">
        <div className="form-actions">
          <button
            type="button"
            className="cancel-game-btn"
            onClick={() => navigate("/manager/my-games")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-game-btn"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Updating..." : "Update Game"}
          </button>
        </div>
      </div>
      <MyGameMainInformation
        game={game}
        form={form}
        handleChange={handleChange}
        handleGenresChange={handleGenresChange}
        handleDevelopersChange={handleDevelopersChange}
        handlePublishersChange={handlePublishersChange}
        isGameLoading={isGameLoading}
      />

      <div className="game-images-containers">
        <MyGameScreenshots
          game={game}
          handleFileChange={onFileSelectionChange}
          markImageForDeletion={markImageForDeletion}
          imagesToDelete={imagesToDelete}
          handleUpdate={handleUpdateScreenshots}
          selectedFiles={selectedFiles}
          cancelScreenshotsChange={cancelScreenshotsChange}
        />
        <MyGameCoverImage
          cancelCoverImageChange={cancelCoverImageChange}
          coverImageFile={coverImageFile}
          handleFileChange={onCoverImageChange}
          coverImagePreview={coverImagePreview}
          handleUpdate={handleCoverImageUpload}
        />
      </div>
      <div className="sys-req-and-localizations">
        <SystemRequirements
          game={game}
          minForm={minReqForm}
          recForm={recReqForm}
          onMinChange={handleMinReqChange}
          onRecChange={handleRecReqChange}
          onCreateMinimum={createMinimum}
          onUpdateMinimum={updateMinimum}
          onDeleteMinimum={deleteMinimum}
          onCreateRecommended={createRecommended}
          onUpdateRecommended={updateRecommended}
          onDeleteRecommended={deleteRecommended}
          busy={anySysReqBusy}
        />
        <MyGameLocalizations
          game={game}
          gameId={gameId}
          onRefetch={refetchGame}
        />
      </div>
    </div>
  );
};

export default MyGameEdit;
