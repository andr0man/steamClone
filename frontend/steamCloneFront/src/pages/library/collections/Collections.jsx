import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './collections.scss';
import Notification from '../../../components/Notification';
import CreateCollectionModal from './CreateCollectionModal';
import CollectionDetailsModal from './CollectionDetailsModal';
import { Layers, Plus, MoreHorizontal, Pencil, Eye, Trash2, Edit3 } from 'lucide-react';
import { useGetGameLibraryQuery } from '../../../services/gamelibrary/gameLibraryApi';

const LS_KEYS = {
  COL: 'mock:collections',
};

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

const mapFromApi = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;
    return {
      id: g?.id ?? row?.gameId ?? row?.id,
      title: g?.name ?? g?.title ?? 'Game',
      imageUrl: g?.coverImageUrl ?? g?.coverImage ?? '/common/gameNoImage.png',
      tags: Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x) : [],
      category: Array.isArray(g?.genres) && g.genres[0] ? g.genres[0].name : 'General',
      isInstalled: false,
      hoursPlayed: row?.hoursPlayed ?? g?.hoursPlayed ?? 0,
      lastPlayed: row?.lastPlayed ?? g?.lastPlayed ?? null,
    };
  });
};

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
  const { data: libData, isFetching: loadingLibrary, isError: libIsError, error: libErr } = useGetGameLibraryQuery();
  const userLibrary = useMemo(() => mapFromApi(libData), [libData]);

  const [rawCollections, setRawCollections] = useState([]);
  const collections = useMemo(() => shapeCollections(rawCollections, userLibrary), [rawCollections, userLibrary]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
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

  useEffect(() => {
    if (libIsError) setApiError(libErr?.data?.message || 'Failed to load library');
  }, [libIsError, libErr]);

  const plural = (n) => (n === 1 ? 'game' : 'games');

  const loadCollections = useCallback(() => {
    setLoading(true);
    setApiError(null);
    try {
      const rawCols = readLS(LS_KEYS.COL, []);
      setRawCollections(Array.isArray(rawCols) ? rawCols : []);
    } catch {
      setApiError('Failed to load local data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  useEffect(() => {
    if (loading) return;
    const toCreate = params.get('create');
    const toOpen = params.get('open');
    if (toCreate === '1') {
      setModalMode('create');
      setEditingCollection(null);
      setIsModalOpen(true);
      const next = new URLSearchParams(params);
      next.delete('create');
      setParams(next, { replace: true });
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
  }, [loading, params, collections, setParams]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const openEditModal = (collection) => {
    setModalMode('edit');
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const persistCollections = (raw) => {
    setRawCollections(raw);
    writeLS(LS_KEYS.COL, raw);
  };

  const handleSaveCollection = async ({ name, gameIds }) => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        const id = 'col_' + Date.now();
        const nextRaw = [{ id, name, gameIds }, ...rawCollections];
        persistCollections(nextRaw);
        setNotice('Collection created');
      } else if (modalMode === 'edit' && editingCollection) {
        const id = editingCollection.id;
        const nextRaw = rawCollections.map(c => c.id === id ? { ...c, name, gameIds } : c);
        persistCollections(nextRaw);
        const shaped = shapeCollections(nextRaw, userLibrary);
        if (detailsCollection?.id === id) {
          setDetailsCollection(shaped.find(c => c.id === id) || null);
        }
        setNotice('Collection updated');
      }
      setIsModalOpen(false);
    } catch {
      setApiError('Failed to save collection.');
      loadCollections();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollection = async (collection) => {
    const ok = window.confirm(`Delete collection "${collection.name}"?`);
    if (!ok) return;
    try {
      const nextRaw = rawCollections.filter(c => c.id !== collection.id);
      persistCollections(nextRaw);
      setNotice('Collection deleted');
      if (detailsCollection?.id === collection.id) {
        setDetailsOpen(false);
        setDetailsCollection(null);
      }
    } catch {
      setApiError('Failed to delete collection.');
      loadCollections();
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
      const nextRaw = rawCollections.map(c => {
        if (c.id !== collectionId) return c;
        return { ...c, gameIds: (c.gameIds || []).filter(id => id !== gameId) };
      });
      persistCollections(nextRaw);
      const shaped = shapeCollections(nextRaw, userLibrary);
      if (detailsCollection?.id === collectionId) {
        setDetailsCollection(shaped.find(c => c.id === collectionId) || null);
      }
    } catch {
      setApiError('Failed to remove game from collection.');
      loadCollections();
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
        const nextRaw = rawCollections.map(c => (c.id === collection.id ? { ...c, name: newName.trim() } : c));
        persistCollections(nextRaw);
        const shaped = shapeCollections(nextRaw, userLibrary);
        if (detailsCollection?.id === collection.id) {
          setDetailsCollection(shaped.find(c => c.id === collection.id) || null);
        }
        setNotice('Collection renamed');
      } catch {
        setApiError('Failed to rename collection.');
        loadCollections();
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