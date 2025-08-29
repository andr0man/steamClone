import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './collections.scss';
import Notification from '../../../components/Notification';
import CreateCollectionModal from './CreateCollectionModal';
import CollectionDetailsModal from './CollectionDetailsModal';
import { Layers, Plus, MoreHorizontal, Pencil, Eye, Trash2, Edit3 } from 'lucide-react';

const LS_KEYS = {
  LIB: 'mock:library-games',
  COL: 'mock:collections',
};

const DEFAULT_LIBRARY = [
  { id: 'obs', title: 'PEKA', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-3.png', tags: ['Tool'], category: 'Fav', isInstalled: true, hoursPlayed: 12, lastPlayed: '2025-08-05' },
  { id: 'stray', title: 'Rust', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-1.png', tags: ['Adventure'], category: 'RPG', isInstalled: true, hoursPlayed: 4, lastPlayed: '2025-08-02' },
  { id: 'bg3', title: 'Baldur’s Gate 3', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-1@2x.png', tags: ['RPG'], category: 'RPG', isInstalled: false, hoursPlayed: 0, lastPlayed: '' },
  { id: 'ln2', title: 'Phasmophobia', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-1@2x.png', tags: ['Indie'], category: 'Fav', isInstalled: true, hoursPlayed: 9, lastPlayed: '2025-07-30' },
  { id: 'cult', title: 'Cult of the Lamb', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-2@2x.png', tags: ['Indie', 'Action'], category: 'Strategies', isInstalled: true, hoursPlayed: 20, lastPlayed: '2025-07-29' },
  { id: 'hades', title: 'Hades', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png', tags: ['Action', 'Indie'], category: 'Fav', isInstalled: true, hoursPlayed: 51, lastPlayed: '2025-07-28' },
  { id: 'witcher3', title: 'Counter Strike 2', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-2@2x.png', tags: ['RPG'], category: 'RPG', isInstalled: false, hoursPlayed: 120, lastPlayed: '2025-06-15' },
  { id: 'disco', title: 'Disco Elysium', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png', tags: ['RPG', 'Indie'], category: 'Strategies', isInstalled: true, hoursPlayed: 33, lastPlayed: '2025-07-20' },
  { id: 'rdr2', title: 'Red Dead Redemption 2', imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-18.png', tags: ['Action', 'Adventure'], category: 'Fav', isInstalled: false, hoursPlayed: 0, lastPlayed: '' },
];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function shapeCollections(rawList, library) {
  const map = new Map(library.map(g => [g.id, g]));
  return (rawList || []).map(c => {
    const gameIds = Array.from(new Set(c.gameIds || []));
    const previewGames = gameIds.map(id => map.get(id)).filter(Boolean).slice(0,4);
    return {
      id: c.id,
      name: c.name,
      gameIds,
      gameCount: gameIds.length,
      previewGames
    };
  });
}

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingCollection, setEditingCollection] = useState(null);
  const [saving, setSaving] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsCollection, setDetailsCollection] = useState(null);

  const [menuFor, setMenuFor] = useState(null);
  const menuRef = useRef(null);

  const [params, setParams] = useSearchParams();

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuFor(null);
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setMenuFor(null);
        setIsModalOpen(false);
        setDetailsOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const plural = (n) => (n === 1 ? 'game' : 'games');

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      // seed library if not exists
      let lib = readLS(LS_KEYS.LIB, null);
      if (!lib || !Array.isArray(lib) || lib.length === 0) {
        lib = DEFAULT_LIBRARY;
        writeLS(LS_KEYS.LIB, lib);
      }
      const rawCols = readLS(LS_KEYS.COL, []);
      const shaped = shapeCollections(rawCols, lib);
      setUserLibrary(lib);
      setCollections(shaped);
    } catch (err) {
      setApiError('Failed to load local data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const ensureLibraryLoaded = useCallback(async () => {
    if (userLibrary.length) return;
    setLoadingLibrary(true);
    try {
      let lib = readLS(LS_KEYS.LIB, null);
      if (!lib || !Array.isArray(lib) || lib.length === 0) {
        lib = DEFAULT_LIBRARY;
        writeLS(LS_KEYS.LIB, lib);
      }
      setUserLibrary(lib);
    } finally {
      setLoadingLibrary(false);
    }
  }, [userLibrary.length]);

  useEffect(() => {
    if (loading) return;
    const toCreate = params.get('create');
    const toOpen = params.get('open');
    if (toCreate === '1') {
      (async () => {
        await ensureLibraryLoaded();
        setModalMode('create');
        setEditingCollection(null);
        setIsModalOpen(true);
        const next = new URLSearchParams(params);
        next.delete('create');
        setParams(next, { replace: true });
      })();
    } else if (toOpen) {
      const col = collections.find(c => c.id === toOpen);
      if (col) {
        setDetailsCollection(col);
        setDetailsOpen(true);
        const next = new URLSearchParams(params);
        next.delete('open');
        setParams(next, { replace: true });
      }
    }
  }, [loading, params, collections, ensureLibraryLoaded, setParams]);

  const openCreateModal = async () => {
    await ensureLibraryLoaded();
    setModalMode('create');
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (collection) => {
    await ensureLibraryLoaded();
    setModalMode('edit');
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const persistCollections = (list) => {
    setCollections(list);
    const raw = list.map(c => ({ id: c.id, name: c.name, gameIds: c.gameIds }));
    writeLS(LS_KEYS.COL, raw);
  };

  const handleSaveCollection = async ({ name, gameIds }) => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        const id = 'col_' + Date.now();
        const previewGames = userLibrary.filter(g => gameIds.includes(g.id)).slice(0,4);
        const newCol = { id, name, gameIds, gameCount: gameIds.length, previewGames };
        persistCollections([newCol, ...collections]);
        setNotice('Collection created');
      } else if (modalMode === 'edit' && editingCollection) {
        const id = editingCollection.id;
        const previewGames = userLibrary.filter(g => gameIds.includes(g.id)).slice(0,4);
        const next = collections.map(c => c.id === id
          ? { ...c, name, gameIds, gameCount: gameIds.length, previewGames }
          : c
        );
        persistCollections(next);
        setNotice('Collection updated');
        if (detailsCollection?.id === id) {
          setDetailsCollection(next.find(c => c.id === id));
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setApiError('Failed to save collection.');
      await loadCollections(); // rollback
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollection = async (collection) => {
    const ok = window.confirm(`Delete collection "${collection.name}"?`);
    if (!ok) return;
    try {
      const next = collections.filter(c => c.id !== collection.id);
      persistCollections(next);
      setNotice('Collection deleted');
      if (detailsCollection?.id === collection.id) {
        setDetailsOpen(false);
        setDetailsCollection(null);
      }
    } catch (err) {
      setApiError('Failed to delete collection.');
      await loadCollections();
    }
  };

  const handleOpenDetails = (collection) => {
    setDetailsCollection(collection);
    setDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setDetailsCollection(null);
  };

  const handleRemoveGameFromDetails = async (collectionId, gameId) => {
    try {
      const next = collections.map(c => {
        if (c.id !== collectionId) return c;
        const gameIds = c.gameIds.filter(id => id !== gameId);
        const previewGames = userLibrary.filter(g => gameIds.includes(g.id)).slice(0,4);
        return { ...c, gameIds, gameCount: gameIds.length, previewGames };
      });
      persistCollections(next);
      const updated = next.find(c => c.id === collectionId);
      if (detailsCollection?.id === collectionId) setDetailsCollection(updated);
    } catch (err) {
      setApiError('Failed to remove game from collection.');
      await loadCollections();
    }
  };

  const menuActions = useMemo(
    () => [
      { key: 'open', icon: <Eye size={16} />, label: 'Open' },
      { key: 'rename', icon: <Pencil size={16} />, label: 'Rename' },
      { key: 'edit', icon: <Edit3 size={16} />, label: 'Edit games' },
      { key: 'delete', icon: <Trash2 size={16} />, label: 'Delete', danger: true },
    ],
    []
  );

  const handleMenuAction = async (action, collection) => {
    setMenuFor(null);
    if (action === 'open') {
      handleOpenDetails(collection);
    } else if (action === 'rename') {
      const newName = window.prompt('New collection name:', collection.name);
      if (!newName || newName.trim() === '' || newName === collection.name) return;
      try {
        const next = collections.map(c => (c.id === collection.id ? { ...c, name: newName.trim() } : c));
        persistCollections(next);
        setNotice('Collection renamed');
        if (detailsCollection?.id === collection.id) {
          setDetailsCollection(next.find(c => c.id === collection.id));
        }
      } catch (err) {
        setApiError('Failed to rename collection.');
        await loadCollections();
      }
    } else if (action === 'edit') {
      openEditModal(collection);
    } else if (action === 'delete') {
      handleDeleteCollection(collection);
    }
  };

  const renderCollectionCard = (collection) => (
    <div
      key={collection.id}
      className="collection-card"
      onClick={() => handleOpenDetails(collection)}
      role="button"
      title={collection.name}
    >
      <div className="card-inner">
        <div className="collection-card-grid">
          {(collection.previewGames || []).slice(0, 4).map((game, index) => (
            <div key={game?.id || index} className="grid-image" style={{ backgroundImage: `url(${game?.imageUrl})` }} />
          ))}
        </div>
        <div className="collection-card-overlay">
          <div className="collection-card-info">
            <h3 className="collection-title">{collection.name}</h3>
            <p className="collection-game-count">{collection.gameCount} {plural(collection.gameCount)}</p>
          </div>
          <div className="collection-card-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="action-menu-btn"
              onClick={() => setMenuFor(prev => (prev === collection.id ? null : collection.id))}
              aria-label="More actions"
              aria-expanded={menuFor === collection.id}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      {menuFor === collection.id && (
        <div className="action-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          {menuActions.map(a => (
            <button
              key={a.key}
              className={`menu-item ${a.danger ? 'danger' : ''}`}
              onClick={() => handleMenuAction(a.key, collection)}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <CreateCollectionModal
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSaveCollection}
          userLibrary={userLibrary}
          loadingLibrary={loadingLibrary}
          initialName={editingCollection?.name || ''}
          initialSelectedGameIds={new Set(editingCollection?.gameIds || [])}
          saving={saving}
        />
      )}

      {detailsOpen && detailsCollection && (
        <CollectionDetailsModal
          collection={detailsCollection}
          userLibrary={userLibrary}
          onClose={handleCloseDetails}
          onRemoveGame={(gid) => handleRemoveGameFromDetails(detailsCollection.id, gid)}
          onAddGames={() => {
            handleCloseDetails();
            openEditModal(detailsCollection);
          }}
        />
      )}

      <div className="collections-page-container">
        <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
        <Notification message={notice} type="success" onClose={() => setNotice(null)} />

        <header className="collections-header">
          <h1>My Collections</h1>
          <button className="create-collection-btn" onClick={openCreateModal}>
            <Plus size={20} /> Create a New Collection
          </button>
        </header>

        {loading ? (
          <div className="collections-loading">
            <div className="spinner"></div>
          </div>
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