import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './library.scss';
import Notification from '../../components/Notification';
import { Search, LayoutGrid, List, ChevronDown, Star as StarIcon, Heart, CheckCircle, Tag as CategoryIcon, SlidersHorizontal, ServerCrash, Gamepad2, Info } from 'lucide-react';

const API_BASE_URL = ''; 

const initialLibraryDataState = {
  games: [],
};

const Library = () => {
  const [libraryData, setLibraryData] = useState(initialLibraryDataState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [filterByCategory, setFilterByCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('title_asc');
  const [viewMode, setViewMode] = useState('grid'); 
  const navigate = useNavigate();

  const { games } = libraryData;

  const fetchLibraryGames = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    setLibraryData(initialLibraryDataState); 
    try {
      // const token = localStorage.getItem('authToken'); 
      // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      // const response = await fetch(`${API_BASE_URL}/api/user/library`, { headers });
      
      // Тимчасово імітуємо запит, який, ймовірно, не вдасться, щоб показати обробку помилок
      // Замінити на реал Api
      const response = await fetch(`${API_BASE_URL}/api/user/library_nonexistent_endpoint`); 

      if (!response.ok) {
        let errorMessage = `Failed to fetch library. Status: ${response.status}`;
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'Access Denied. Please log in to view your library.';
        } else if (response.status === 404) {
          errorMessage = 'Could not find library data. Endpoint might be incorrect or you have no games.';
        } else {
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) { /* Keep original errorMessage */ }
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setLibraryData(prev => ({ ...prev, games: data.games || [] }));

    } catch (err) {
      console.error("Error fetching library:", err);
      let userFriendlyError = 'Could not load your game library. ';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('TypeError: Failed to fetch')) {
        userFriendlyError += 'Please check your internet connection and ensure the server is reachable.';
      } else if (err.message.includes('Access Denied')) {
        userFriendlyError = err.message;
      } else if (err.message.includes('404')) {
         userFriendlyError = 'No games found in your library or the API endpoint is incorrect.';
      }
      else {
        userFriendlyError += err.message || 'An unexpected error occurred.';
      }
      setApiError(userFriendlyError);
      setLibraryData(initialLibraryDataState); 
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchLibraryGames(); 
  }, [fetchLibraryGames]);
  
  const handleToggleFavorite = (gameId) => {
    setLibraryData(prevData => ({
      ...prevData,
      games: prevData.games.map(game =>
        game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
      ),
    }));
  };

  const processedGames = useMemo(() => {
    if (!games) return []; 
    let tempGames = [...games];
    if (searchTerm) {
      tempGames = tempGames.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterBy === 'installed') tempGames = tempGames.filter(game => game.isInstalled);
    else if (filterBy === 'favorites') tempGames = tempGames.filter(game => game.isFavorite);
    if (filterByCategory !== 'All Categories') tempGames = tempGames.filter(game => game.category === filterByCategory);
    
    switch (sortBy) {
      case 'title_asc': tempGames.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title_desc': tempGames.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'last_played':
        tempGames.sort((a, b) => {
          if (!a.lastPlayed) return 1; if (!b.lastPlayed) return -1;
          return new Date(b.lastPlayed) - new Date(a.lastPlayed);
        });
        break;
      case 'hours_played': tempGames.sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0)); break;
      default: break;
    }
    return tempGames;
  }, [games, searchTerm, filterBy, filterByCategory, sortBy]);

  const formatLastPlayed = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); 
    const diffTime = localNow.getTime() - localDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const uniqueCategoriesForFilter = useMemo(() => {
    if (!games) return ['All Categories'];
    const allGameCategories = games.map(game => game.category).filter(Boolean);
    return ['All Categories', ...new Set(allGameCategories)];
  }, [games]);

  const handleGameInfoClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  if (loading && games.length === 0 && !apiError) {
    return <div className="library-loading-page"><div className="spinner-xl"></div>Loading Your Games...</div>;
  }

  return (
    <div className={`library-page-container view-mode--${viewMode}`}>
      <Notification message={apiError && games.length === 0 ? apiError : null} type="error" onClose={() => setApiError(null)} />
      
      <header className="library-main-header">
        <h1>My Game Library</h1>
        <div className="library-view-controls">
          <div className="search-input-group">
            <Search className="control-icon" size={20} />
            <input type="text" placeholder="Search library..." className="control-input search-library-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="view-mode-toggle">
            <button className={`toggle-button ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View"><LayoutGrid size={20} /></button>
            <button className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View"><List size={20} /></button>
          </div>
        </div>
      </header>

      <aside className="library-filters-sidebar">
        <h2><SlidersHorizontal size={20}/> Filters & Sort</h2>
        <div className="filter-section">
          <label htmlFor="filterByStatus">Status</label>
          <div className="custom-select">
            <select id="filterByStatus" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">All Games</option>
              <option value="installed">Installed</option>
              <option value="favorites">Favorites</option>
            </select>
            <ChevronDown className="select-chevron" size={18}/>
          </div>
        </div>
        <div className="filter-section">
          <label htmlFor="filterByCategory">Category</label>
          <div className="custom-select">
            <select id="filterByCategory" value={filterByCategory} onChange={(e) => setFilterByCategory(e.target.value)} disabled={uniqueCategoriesForFilter.length <= 1}>
              {uniqueCategoriesForFilter.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown className="select-chevron" size={18}/>
          </div>
        </div>
         <div className="filter-section">
          <label htmlFor="sortBy">Sort By</label>
          <div className="custom-select">
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
              <option value="last_played">Last Played</option>
              <option value="hours_played">Hours Played</option>
            </select>
            <ChevronDown className="select-chevron" size={18}/>
          </div>
        </div>
      </aside>

      <main className="library-content-main">
        {loading && games.length > 0 && (
            <div className="library-inline-loader"><div className="spinner-md"></div>Updating library...</div>
        )}

        {!loading && apiError && games.length === 0 && (
             <div className="library-no-results-state api-error-state">
                <ServerCrash size={72} />
                <h2>Connection Issue</h2>
                <p>{apiError}</p>
                <button onClick={fetchLibraryGames} className="action-button retry-button">
                    Try Again
                </button>
             </div>
        )}
        
        {!loading && !apiError && processedGames.length === 0 && (
          <div className="library-no-results-state">
            <Gamepad2 size={72} />
            <h2>No Games Found</h2>
            <p>{searchTerm || filterBy !== 'all' || filterByCategory !== 'All Categories' ? "No games match your current filters." : "Your game library is empty. Time to explore the store!"}</p>
          </div>
        )}
        
        {!loading && !apiError && processedGames.length > 0 && (
          <div className={`games-collection-display ${viewMode === 'grid' ? 'grid-view-active' : 'list-view-active'}`}>
            {processedGames.map(game => (
              <div key={game.id} className="fluxi-game-card">
                <div className="game-card-banner"  onClick={() => handleGameInfoClick(game.id)} style={{cursor: 'pointer'}}>
                  <img src={game.imageUrl || 'https://via.placeholder.com/300x400/1e252e/657382?Text=No+Image'} alt={game.title} className="game-banner-image" />
                  <button className={`favorite-toggle-button ${game.isFavorite ? 'is-favorite' : ''}`} onClick={(e) => {e.stopPropagation(); handleToggleFavorite(game.id);}} title={game.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                    <Heart size={20} fill={game.isFavorite ? '#FF6B6B' : 'none'} />
                  </button>
                  {game.isInstalled && <div className="installed-chip"><CheckCircle size={14}/> Installed</div>}
                </div>
                <div className="game-card-info-content">
                  <h3 className="game-title-text" title={game.title} onClick={() => handleGameInfoClick(game.id)} style={{cursor: 'pointer'}}>{game.title}</h3>
                  {viewMode === 'list' && game.category && <p className="game-category-text"><CategoryIcon size={14}/> {game.category || 'N/A'}</p>}
                  <div className="game-stats-row">
                    <span>Last Played: {formatLastPlayed(game.lastPlayed)}</span>
                    <span>{game.hoursPlayed || 0}h Played</span>
                  </div>
                </div>
                <div className="game-card-action-footer">
                  <button className="action-button info-button" onClick={() => handleGameInfoClick(game.id)}>
                    <Info size={18}/>
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;