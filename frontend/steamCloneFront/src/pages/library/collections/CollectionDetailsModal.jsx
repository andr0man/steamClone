import React, { useMemo } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plural = (n) => (n === 1 ? 'game' : 'games');

const CollectionDetailsModal = ({ collection, userLibrary, onClose, onRemoveGame, onAddGames }) => {
  const navigate = useNavigate();

  const games = useMemo(() => {
    const ids = collection?.gameIds || [];
    const map = new Map((userLibrary || []).map(g => [g.id, g]));
    return ids.map(id => map.get(id)).filter(Boolean);
  }, [collection, userLibrary]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{collection?.name} • {collection?.gameCount} {plural(collection?.gameCount || 0)}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="modal-btn add" onClick={onAddGames}>Add games</button>
            <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
          </div>
        </header>

        <div className="details-body">
          {games.length === 0 ? (
            <div className="list-loading" style={{ padding: '2rem', textAlign: 'center' }}>
              No games in this collection yet.
            </div>
          ) : (
            <div className="details-grid">
              {games.map(g => (
                <div key={g.id} className="details-tile">
                  <button
                    className="thumb"
                    title={g.title}
                    onClick={() => navigate(`/library/game/${g.id}`)}
                  >
                    <img src={g.imageUrl} alt={g.title} />
                    <span className="title">{g.title}</span>
                  </button>
                  <button
                    className="remove-btn"
                    title="Remove from collection"
                    onClick={() => onRemoveGame(g.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsModal;