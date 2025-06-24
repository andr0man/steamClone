import React, { useState, useEffect, useCallback } from 'react';
import './collections.scss';
import Notification from '../../../components/Notification';
import CreateCollectionModal from './CreateCollectionModal'; // Імпортуємо новий компонент
import { Layers, Plus, MoreHorizontal, AlertTriangle } from 'lucide-react';

const API_BASE_URL = '';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLibrary, setUserLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/library/collections`);
      if (!response.ok) throw new Error('Failed to load collections.');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleOpenCreateModal = async () => {
    if (userLibrary.length === 0) { // Завантажуємо бібліотеку тільки при першому відкритті
      setLoadingLibrary(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/library/all-games`);
        if (!response.ok) throw new Error('Failed to load user library.');
        const data = await response.json();
        setUserLibrary(data.games || []);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoadingLibrary(false);
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveCollection = async (newCollectionData) => {
    console.log('(API CALL) Saving new collection:', newCollectionData);
    // Симуляція POST-запиту на бекенд
    // POST /api/library/collections body: { name: '...', gameIds: [...] }
    
    // Оптимістичне оновлення: додаємо колекцію в UI одразу
    const newCollection = {
      id: `new_${Date.now()}`,
      name: newCollectionData.name,
      gameCount: newCollectionData.gameIds.length,
      previewGames: newCollectionData.gameIds
        .map(id => userLibrary.find(game => game.id === id))
        .filter(Boolean) // Відфільтровуємо undefined на випадок помилки
    };
    setCollections(prev => [newCollection, ...prev]);

    handleCloseModal();
  };

  const renderCollectionCard = (collection) => (
    <div key={collection.id} className="collection-card">
      <div className="collection-card-grid">
        {(collection.previewGames || []).slice(0, 4).map((game, index) => (
          <div key={game?.id || index} className="grid-image" style={{ backgroundImage: `url(${game?.imageUrl})` }}></div>
        ))}
      </div>
      <div className="collection-card-overlay">
        <div className="collection-card-info">
          <h3 className="collection-title">{collection.name}</h3>
          <p className="collection-game-count">{collection.gameCount} games</p>
        </div>
        <div className="collection-card-actions">
          <button className="action-menu-btn"><MoreHorizontal size={20} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <CreateCollectionModal 
          onClose={handleCloseModal}
          onSave={handleSaveCollection}
          userLibrary={userLibrary}
          loadingLibrary={loadingLibrary}
        />
      )}
      <div className="collections-page-container">
        <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
        <header className="collections-header">
          <h1>My Collections</h1>
          <button className="create-collection-btn" onClick={handleOpenCreateModal}>
            <Plus size={20} /> Create a New Collection
          </button>
        </header>

        {loading ? (
          <div className="collections-loading"><div className="spinner"></div></div>
        ) : collections.length > 0 ? (
          <main className="collections-grid">
            {collections.map(renderCollectionCard)}
          </main>
        ) : (
          <div className="collections-empty">
            <Layers size={64} />
            <h2>No Collections Found</h2>
            <p>Create your first collection to organize your games.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Collections;