import React, { useState } from "react";
import "./GameEdit.scss";
import {
  useUpdateGameMutation,
  useGetGameByIdQuery,
  useUpdateScreenshotsMutation,
  useUpdateCoverImageMutation,
} from "../../../../services/game/gameApi";
import "../../../../styles/App.scss";
import "../components/common/StylesForGameForm.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGenresQuery } from "../../../../services/genre/genreApi";
import { useGetAllDevelopersAndPublishersQuery } from "../../../../services/developerAndPublisher/developerAndPublisherApi";
import { toast } from "react-toastify";
import GameMainInformation from "./components/GameMainInformation";
import GameScreenshots from "./components/GameScreenshots/GameScreenshots";
import GameCoverImage from "./components/GameCoverImage/GameCoverImage";

const GameEdit = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const {
    data: { payload: game } = {},
    isLoading: isGameLoading,
    error,
  } = useGetGameByIdQuery(gameId);

  const [updateGame, { isLoading }] = useUpdateGameMutation();
  const [updateScreenshots, { isLoading: isUpdatingScreenshots }] =
    useUpdateScreenshotsMutation();
  const [updateCoverImage, { isLoading: isUpdatingCoverImage }] =
    useUpdateCoverImageMutation();
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
  const [coverImagePreview, setCoverImagePreview] = useState(null);


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
      setCoverImagePreview(game.coverImageUrl);
    }
  }, [isGameLoading, game]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [coverImageFile, setCoverImageFile] = useState(null);

  const onFileSelectionChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
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

  const handleCoverImageUpload = async ({globalSaving = false}) => {
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
      setCoverImagePreview(null);
      if (globalSaving) return true;
      toast.success("Cover image updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update cover image");
      return false;
    }
  }

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
      setImagesToDelete([]);
      if (globalSaving) return true;
      toast.success("Screenshots updated successfully");
    }
    catch (err) {
      toast.error(err?.data?.message || "Failed to update screenshots");
      return false;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGame({
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
        id: gameId,
      }).unwrap();
      const isScreenshotsUpdated = await handleUpdateScreenshots({ globalSaving: true });
      const isCoverImageUpdated = await handleCoverImageUpload({ globalSaving: true });
      if (!isScreenshotsUpdated || !isCoverImageUpdated) {
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
      navigate("/admin/games");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update game");
    }
  };

  if (isGameLoading || genresLoading || developersAndPublishersLoading || !form)
    return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading game</div>;

  return (
    <div className="game-forms-containers">
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
            {isLoading ? "Updating..." : "Update Game"}
          </button>
        </div>
      </div>
      <GameMainInformation
        game={game}
        form={form}
        handleChange={handleChange}
        handleGenresChange={handleGenresChange}
        genres={genres}
        handleDevelopersChange={handleDevelopersChange}
        handlePublishersChange={handlePublishersChange}
        developersAndPublishers={developersAndPublishers}
        genresLoading={genresLoading}
        developersAndPublishersLoading={developersAndPublishersLoading}
        isGameLoading={isGameLoading}
      />

      <div className="game-images-containers">
        <GameScreenshots
          game={game}
          handleFileChange={onFileSelectionChange}
          markImageForDeletion={markImageForDeletion}
          imagesToDelete={imagesToDelete}
        />
        <GameCoverImage
          handleFileChange={onCoverImageChange}
          coverImagePreview={coverImagePreview}
        />
      </div>
    </div>
  );
};

export default GameEdit;
