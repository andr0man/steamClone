import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, CheckSquare, Square, XCircle } from 'lucide-react';

const plural = (n) => (n === 1 ? 'game' : 'games');

const CreateCollectionModal = ({
  mode = 'create',
  onClose,
  onSave,
  userLibrary,
  loadingLibrary,
  initialName = '',
  initialSelectedGameIds = new Set(),
  saving = false,
}) => {
  const [collectionName, setCollectionName] = useState(initialName);
  const [selectedGames, setSelectedGames] = useState(new Set(initialSelectedGameIds));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCollectionName(initialName);
    setSelectedGames(new Set(initialSelectedGameIds));
  }, [initialName, initialSelectedGameIds]);

  const filteredLibrary = useMemo(() => {
    const list = Array.isArray(userLibrary) ? userLibrary : [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter(game => (game.title || '').toLowerCase().includes(q));
  }, [searchTerm, userLibrary]);

  const allFilteredSelected = useMemo(() => {
    if (!filteredLibrary.length) return false;
    return filteredLibrary.every(g => selectedGames.has(g.id));
  }, [filteredLibrary, selectedGames]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleToggleSelectAllFiltered();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleClearSelection();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filteredLibrary, selectedGames]);

  const handleGameToggle = (gameId) => {
    setSelectedGames(prev => {
      const next = new Set(prev);
      if (next.has(gameId)) next.delete(gameId);
      else next.add(gameId);
      return next;
    });
  };

  const handleToggleSelectAllFiltered = () => {
    setSelectedGames(prev => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredLibrary.forEach(g => next.delete(g.id));
      } else {
        filteredLibrary.forEach(g => next.add(g.id));
      }
      return next;
    });
  };

  const handleClearSelection = () => setSelectedGames(new Set());

  const selectedList = useMemo(() => {
    const map = new Map((userLibrary || []).map(g => [g.id, g]));
    return Array.from(selectedGames).map(id => map.get(id)).filter(Boolean);
  }, [selectedGames, userLibrary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!collectionName.trim() || selectedGames.size === 0 || saving) return;
    onSave({ name: collectionName.trim(), gameIds: Array.from(selectedGames) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{mode === 'create' ? 'Create New Collection' : 'Edit Collection'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="collection-name">Collection Name</label>
            <input 
              type="text" 
              id="collection-name" 
              placeholder="e.g., Favorite RPGs"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Select Games ({selectedGames.size} {plural(selectedGames.size)})
            </label>

            <div className="game-search-wrapper">
              <Search size={18} className="search-icon"/>
              <input 
                type="text" 
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search games"
              />
            </div>

            <div className="modal-toolbar">
              <div className="sel-info">
                Selected: <b>{selectedGames.size}</b>
                {filteredLibrary.length > 0 && (
                  <span className="dim"> • in view: {filteredLibrary.length}</span>
                )}
              </div>
              <div className="toolbar-actions">
                <button
                  type="button"
                  className="tiny-btn"
                  onClick={handleToggleSelectAllFiltered}
                  disabled={!filteredLibrary.length}
                  title={allFilteredSelected ? 'Unselect filtered (Ctrl/Cmd+A)' : 'Select all filtered (Ctrl/Cmd+A)'}
                >
                  {allFilteredSelected ? 'Unselect filtered' : 'Select all (filtered)'}
                </button>
                <button
                  type="button"
                  className="tiny-btn ghost"
                  onClick={handleClearSelection}
                  disabled={selectedGames.size === 0}
                  title="Clear selection (Ctrl/Cmd+D)"
                >
                  Clear
                </button>
              </div>
            </div>

            {selectedList.length > 0 && (
              <div className="selected-chips">
                {selectedList.slice(0, 8).map(g => (
                  <span key={g.id} className="chip" title={g.title}>
                    {g.title}
                    <button
                      type="button"
                      aria-label={`Remove ${g.title}`}
                      onClick={() => handleGameToggle(g.id)}
                    >
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
                {selectedList.length > 8 && (
                  <span className="chip more">+{selectedList.length - 8} more</span>
                )}
              </div>
            )}

            <div className="modal-game-list">
              {loadingLibrary ? (
                <div className="list-loading">Loading games...</div>
              ) : filteredLibrary.length === 0 ? (
                <div className="list-empty">No games match your search</div>
              ) : (
                filteredLibrary.map(game => (
                  <div 
                    key={game.id} 
                    className={`modal-game-item ${selectedGames.has(game.id) ? 'selected' : ''}`}
                    onClick={() => handleGameToggle(game.id)}
                    role="button"
                    title={game.title}
                  >
                    {selectedGames.has(game.id)
                      ? <CheckSquare className="checkbox-icon" />
                      : <Square className="checkbox-icon" />
                    }
                    <img src={game.imageUrl} alt={game.title} />
                    <span>{game.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <footer className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="modal-btn save"
              disabled={!collectionName.trim() || selectedGames.size === 0 || saving}
            >
              {saving ? 'Saving...' : (mode === 'create' ? 'Save Collection' : 'Save Changes')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;