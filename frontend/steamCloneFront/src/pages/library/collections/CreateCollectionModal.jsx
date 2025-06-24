import React, { useState, useMemo } from 'react';
import { X, Search, CheckSquare, Square } from 'lucide-react';

const CreateCollectionModal = ({ onClose, onSave, userLibrary, loadingLibrary }) => {
  const [collectionName, setCollectionName] = useState('');
  const [selectedGames, setSelectedGames] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleGameToggle = (gameId) => {
    setSelectedGames(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(gameId)) {
        newSelected.delete(gameId);
      } else {
        newSelected.add(gameId);
      }
      return newSelected;
    });
  };

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return userLibrary;
    return userLibrary.filter(game => 
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, userLibrary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!collectionName || selectedGames.size === 0) return;
    onSave({
      name: collectionName,
      gameIds: Array.from(selectedGames),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Create New Collection</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
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
            <label>Select Games ({selectedGames.size})</label>
            <div className="game-search-wrapper">
              <Search size={18} className="search-icon"/>
              <input 
                type="text" 
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="modal-game-list">
              {loadingLibrary ? (
                <div className="list-loading">Loading games...</div>
              ) : (
                filteredLibrary.map(game => (
                  <div 
                    key={game.id} 
                    className={`modal-game-item ${selectedGames.has(game.id) ? 'selected' : ''}`}
                    onClick={() => handleGameToggle(game.id)}
                  >
                    {selectedGames.has(game.id) ? <CheckSquare className="checkbox-icon" /> : <Square className="checkbox-icon" />}
                    <img src={game.imageUrl} alt={game.title} />
                    <span>{game.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <footer className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn save" disabled={!collectionName || selectedGames.size === 0}>
              Save Collection
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;