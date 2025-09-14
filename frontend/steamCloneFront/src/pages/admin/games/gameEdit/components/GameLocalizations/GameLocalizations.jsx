import React, { useMemo, useState } from "react";
import "./GameLocalizations.scss";
import { useGetAllLanguagesQuery } from "../../../../../../services/language/languageApi";
import {
  useCreateGameLocalizationMutation,
  useUpdateGameLocalizationMutation,
  useDeleteGameLocalizationMutation,
} from "../../../../../../services/gameLocalization/gameLocalizationApi";
import Select from "react-select";
import { toast } from "react-toastify";
import selectStyles from "../../../../common/selectStyles";

const GameLocalizations = ({ game, gameId, onRefetch }) => {
  const {
    data: { payload: languages } = { payload: [] },
    isLoading: languagesLoading,
  } = useGetAllLanguagesQuery();

  const [createLoc, { isLoading: isCreating }] =
    useCreateGameLocalizationMutation();
  const [updateLoc, { isLoading: isUpdating }] =
    useUpdateGameLocalizationMutation();
  const [deleteLoc, { isLoading: isDeleting }] =
    useDeleteGameLocalizationMutation();

  const busy = isCreating || isUpdating || isDeleting;

  const locByLangId = useMemo(() => {
    const map = new Map();
    const list = Array.isArray(game?.localizations) ? game.localizations : [];
    list.forEach((l) => map.set(l.languageId ?? l.language?.id, l));
    return map;
  }, [game]);

  const [draft, setDraft] = useState({});
  const [createLangId, setCreateLangId] = useState(null);
  const [createRow, setCreateRow] = useState({
    interface: false,
    fullAudio: false,
    subtitles: false,
  });
  const getRowState = (langId) => {
    const existing = locByLangId.get(langId);
    const row = draft[langId] ?? {
      interface: existing?.interface ?? false,
      fullAudio: existing?.fullAudio ?? false,
      subtitles: existing?.subtitles ?? false,
    };
    return row;
  };
  const updateDraft = (langId, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [langId]: { ...getRowState(langId), [field]: value },
    }));
  };

  const handleCreate = async () => {
    const langId = createLangId;
    if (!langId) return;
    const row = createRow;
    try {
      await createLoc({
        gameId,
        languageId: langId,
        interface: row.interface,
        fullAudio: row.fullAudio,
        subtitles: row.subtitles,
      }).unwrap();
      toast.success("Localization created");
      setCreateLangId(null);
      setCreateRow({ interface: false, fullAudio: false, subtitles: false });
      await onRefetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create localization");
    }
  };

  const handleUpdate = async (langId) => {
    const existing = locByLangId.get(langId);
    if (!existing) return;
    const row = getRowState(langId);
    try {
      await updateLoc({
        id: existing.id,
        interface: row.interface,
        fullAudio: row.fullAudio,
        subtitles: row.subtitles,
      }).unwrap();
      await onRefetch?.();
      toast.success("Localization updated");
      setDraft((d) => ({ ...d, [langId]: undefined }));
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update localization");
    }
  };

  const handleDelete = async (langId) => {
    const existing = locByLangId.get(langId);
    if (!existing) return;
    try {
      await deleteLoc(existing.id).unwrap();
      toast.success("Localization deleted");
      setDraft((d) => ({ ...d, [langId]: undefined }));
      await onRefetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete localization");
    }
  };

  const options = (languages || [])
    .filter((l) => !locByLangId.has(l.id))
    .map((l) => ({ value: l.id, label: l.name || l.code || String(l.id) }));

  const getLangLabel = (langId) => {
    const lang = (languages || []).find((l) => l.id === langId);
    return lang?.name || lang?.code || String(langId);
  };

  const existingLocalizations = Array.isArray(game?.localizations)
    ? game.localizations
    : [];

  if (languagesLoading)
    return <div className="loading-overlay visible">Loading data...</div>;

  return (
    <div className="game-form-container flux-border">
      <div className="localizations-panel">
        <h3>Game Localizations</h3>
        <div className="localizations-table">
          <div className="thead">
            <div className="tr">
              <div className="th">Language</div>
              <div className="th">Interface</div>
              <div className="th">Full audio</div>
              <div className="th">Subtitles</div>
              <div className="th">Actions</div>
            </div>
          </div>
          <div className="tbody">
            {/* Create row */}
            <div className="tr">
              <div className="td lang-name" style={{ minWidth: "150px" }}>
                <Select
                  options={options}
                  value={
                    createLangId
                      ? {
                          value: createLangId,
                          label: getLangLabel(createLangId),
                        }
                      : null
                  }
                  onChange={(opt) => setCreateLangId(opt ? opt.value : null)}
                  placeholder="Language…"
                  isClearable
                  styles={selectStyles}
                />
              </div>
              <div className="td">
                <input
                  type="checkbox"
                  checked={!!createRow.interface}
                  onChange={(e) =>
                    setCreateRow((r) => ({ ...r, interface: e.target.checked }))
                  }
                />
              </div>
              <div className="td">
                <input
                  type="checkbox"
                  checked={!!createRow.fullAudio}
                  onChange={(e) =>
                    setCreateRow((r) => ({ ...r, fullAudio: e.target.checked }))
                  }
                />
              </div>
              <div className="td">
                <input
                  type="checkbox"
                  checked={!!createRow.subtitles}
                  onChange={(e) =>
                    setCreateRow((r) => ({ ...r, subtitles: e.target.checked }))
                  }
                />
              </div>
              <div className="td actions">
                <button disabled={busy || !createLangId} onClick={handleCreate}>
                  Create
                </button>
              </div>
            </div>

            {/* Existing localizations */}
            {existingLocalizations.map((loc) => {
              const langId = loc.languageId ?? loc.language?.id;
              const row = getRowState(langId);
              return (
                <div className="tr" key={loc.id}>
                  <div className="td lang-name">{getLangLabel(langId)}</div>
                  <div className="td">
                    <input
                      type="checkbox"
                      checked={!!row.interface}
                      onChange={(e) =>
                        updateDraft(langId, "interface", e.target.checked)
                      }
                    />
                  </div>
                  <div className="td">
                    <input
                      type="checkbox"
                      checked={!!row.fullAudio}
                      onChange={(e) =>
                        updateDraft(langId, "fullAudio", e.target.checked)
                      }
                    />
                  </div>
                  <div className="td">
                    <input
                      type="checkbox"
                      checked={!!row.subtitles}
                      onChange={(e) =>
                        updateDraft(langId, "subtitles", e.target.checked)
                      }
                    />
                  </div>
                  <div className="td actions">
                    <button
                      disabled={busy}
                      onClick={() => handleUpdate(langId)}
                    >
                      Update
                    </button>
                    <button
                      disabled={busy}
                      className="danger"
                      onClick={() => handleDelete(langId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLocalizations;
