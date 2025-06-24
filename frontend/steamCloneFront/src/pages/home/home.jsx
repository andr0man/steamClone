import React, { useState, useEffect, useCallback } from 'react';
import './home.scss';
import Notification from '../../components/Notification';
import { Search, Tag, Percent, Star, Users, Gamepad2, CalendarDays, AlertTriangle } from 'lucide-react';

const API_BASE_URL = ''; 

const MOCK_CATEGORIES = [
  { id: 'rpg', name: 'RPG', slug: 'rpg' },
  { id: 'strategy', name: 'Strategy', slug: 'strategy' },
  { id: 'shooter', name: 'Shooters', slug: 'shooter' },
  { id: 'simulation', name: 'Simulators', slug: 'simulation' },
  { id: 'indie', name: 'Indie', slug: 'indie' },
];

const initialHomeDataState = {
  featuredGame: null,
  gamesForCurrentTab: [],
  categories: MOCK_CATEGORIES, 
};

const Home = () => {
  const [homeData, setHomeData] = useState(initialHomeDataState);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingPage, setLoadingPage] = useState(true); 
  const [loadingTabData, setLoadingTabData] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeTab, setActiveTab] = useState('featured');

  const { featuredGame, gamesForCurrentTab, categories } = homeData;

  const fetchApiData = useCallback(async (endpoint, options = {}) => {
    setApiError(null); 
    try {
      const response = await fetch(`${API_BASE_URL}/api/games${endpoint}`, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error loading data from ${API_BASE_URL}/api/games${endpoint}:`, err);
      setApiError(err.message || 'Failed to load data. Please try again later.');
      throw err; 
    }
  }, []); 

  useEffect(() => {
    const initializePage = async () => {
      setLoadingPage(true);
      try {
        const heroData = await fetchApiData('/hero-featured');
        setHomeData(prevData => ({
          ...prevData,
          featuredGame: heroData.featuredGame || null,
        }));
        
        // const categoriesData = await fetchApiData('/categories');
        // setHomeData(prevData => ({
        //   ...prevData,
        //   categories: categoriesData.categories || MOCK_CATEGORIES, 
        // }));

      } catch (err) {
        // apiError fetchApiData
      } finally {
        setLoadingPage(false);
      }
    };
    initializePage();
  }, [fetchApiData]);

  useEffect(() => {
    const loadTabData = async () => {
      if (loadingPage) return; 

      setLoadingTabData(true);
      setHomeData(prevData => ({ ...prevData, gamesForCurrentTab: [] }));

      try {
        let data;
        if (searchTerm) {
          data = await fetchApiData(`/search?term=${encodeURIComponent(searchTerm)}`);
        } else {
          let tabEndpoint = '/featured-recommended';
          if (activeTab === 'special') tabEndpoint = '/special-offers';
          else if (activeTab === 'new') tabEndpoint = '/new-releases';
          data = await fetchApiData(tabEndpoint);
        }
        setHomeData(prevData => ({
          ...prevData,
          gamesForCurrentTab: data.games || [],
        }));
      } catch (err) {
        setHomeData(prevData => ({ ...prevData, gamesForCurrentTab: [] }));
      } finally {
        setLoadingTabData(false);
      }
    };

    if (searchTerm) {
      const debounceSearch = setTimeout(() => {
        loadTabData();
      }, 500);
      return () => clearTimeout(debounceSearch);
    } else {
      loadTabData();
    }
  }, [activeTab, searchTerm, fetchApiData, loadingPage]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleTabChange = (tab) => {
    setSearchTerm(''); 
    setActiveTab(tab);
  };

  const renderGameCard = (game) => (
    <div key={game.id || game._id} className="game-card">
      <div className="game-card-image-container">
        <img src={game.imageUrl || 'https://via.placeholder.com/300x450/1e252e/c7d5e0?text=No+Image'} alt={game.title || 'Game'} className="game-card-image" />
        <div className="game-card-hover-overlay">
          <button className="game-card-button primary" onClick={() => console.log('Navigate to game:', game.id)}>Details</button>
          <button className="game-card-button secondary" onClick={() => console.log('Add to cart:', game.id)}>Add to Cart</button>
        </div>
      </div>
      <div className="game-card-info">
        <h3 className="game-card-title">{game.title || 'Untitled'}</h3>
        {game.tags && game.tags.length > 0 && (
          <div className="game-card-tags">
            {game.tags.slice(0, 3).map(tag => <span key={tag} className="game-tag"><Tag size={12}/> {tag}</span>)}
          </div>
        )}
        <div className="game-card-price">
          {game.discountPrice && game.price ? (
            <>
              <span className="game-price-original">${parseFloat(game.price).toFixed(2)}</span>
              <span className="game-price-discounted">${parseFloat(game.discountPrice).toFixed(2)}</span>
              <span className="game-price-badge">
                <Percent size={14}/> {Math.round(((parseFloat(game.price) - parseFloat(game.discountPrice)) / parseFloat(game.price)) * 100)}%
              </span>
            </>
          ) : game.price ? (
            <span className="game-price-current">${parseFloat(game.price).toFixed(2)}</span>
          ) : (
            <span className="game-price-current">N/A</span>
          )}
        </div>
      </div>
    </div>
  );

  if (loadingPage) {
    return <div className="home-loading">Loading Flux... <div className="spinner"></div></div>;
  }

  return (
    <div className="home-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

      {featuredGame && !searchTerm && (
         <section className="hero-section" style={{ backgroundImage: `linear-gradient(to top, rgba(24,30,37,1) 0%, rgba(24,30,37,0.7) 40%, rgba(24,30,37,0.1) 70%, transparent 100%), url(${featuredGame.bannerUrl || featuredGame.imageUrl || 'https://via.placeholder.com/1200x400/1A2838/66c0f4?text=Featured+Game'})` }}>
          <div className="hero-content">
            <h1 className="hero-title">{featuredGame.title || 'Flux Welcomes You!'}</h1>
            <p className="hero-description">{(featuredGame.description || 'The best games are waiting for you. Discover new worlds!').substring(0,150)}...</p>
            {featuredGame.title && (
                <div className="hero-meta">
                    {featuredGame.rating && <span><Star size={18}/> {parseFloat(featuredGame.rating).toFixed(1)}/5.0</span>}
                    {featuredGame.developer && <span><Users size={18}/> {featuredGame.developer}</span>}
                    {featuredGame.releaseDate && <span><CalendarDays size={18}/> {new Date(featuredGame.releaseDate).toLocaleDateString()}</span>}
                </div>
            )}
            <div className="hero-actions">
              <button className="hero-button primary"><Gamepad2 size={20} /> {featuredGame.title ? "Play Now" : "Browse Games"}</button>
              <button className="hero-button secondary">Add to Wishlist</button>
            </div>
          </div>
        </section>
      )}
      
      {!featuredGame && !searchTerm && !loadingPage && (
         <section className="hero-section hero-section-placeholder" >
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Flux!</h1>
            <p className="hero-description">Your new gaming platform. Discover amazing worlds and adventures.</p>
             <div className="hero-actions">
              <button className="hero-button primary" onClick={() => handleTabChange('new')}><Gamepad2 size={20} /> Browse New Releases</button>
            </div>
          </div>
        </section>
      )}


      <div className="home-main-content">
        <aside className="home-sidebar">
          <h2>Navigation</h2>
          <div className="search-bar-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search games..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {categories && categories.length > 0 && (
            <nav className="category-nav">
              <h3>Categories</h3>
              <ul>
                {categories.map(cat => (
                  <li key={cat.id || cat.name}><a href={`/games/category/${cat.slug || cat.name.toLowerCase()}`}>{cat.name}</a></li>
                ))}
              </ul>
            </nav>
          )}
          <div className="sidebar-promo">
            <h4>Summer Sale!</h4>
            <p>Huge discounts up to -75%!</p>
            <button onClick={() => handleTabChange('special')}>View Offers</button>
          </div>
        </aside>

        <main className="home-game-listings">
          <div className="tabs-navigation">
            <button 
              className={`tab-button ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => handleTabChange('featured')}
            >
              <Star size={18}/> Recommended
            </button>
            <button 
              className={`tab-button ${activeTab === 'special' ? 'active' : ''}`}
              onClick={() => handleTabChange('special')}
            >
              <Percent size={18}/> Special Offers
            </button>
            <button 
              className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => handleTabChange('new')}
            >
              <Gamepad2 size={18}/> New Releases
            </button>
          </div>
          
          {loadingTabData ? (
            <div className="tab-loading"><div className="spinner"></div>Loading games...</div>
          ) : gamesForCurrentTab && gamesForCurrentTab.length > 0 ? (
            <section className="game-section">
              <h2 className="section-title">
                {searchTerm ? `Search results for "${searchTerm}"` : 
                 activeTab === 'featured' ? 'Recommended for You' :
                 activeTab === 'special' ? 'Special Offers' : 'New & Trending'}
              </h2>
              <div className="game-grid">
                {gamesForCurrentTab.map(renderGameCard)}
              </div>
            </section>
          ) : (
            <div className="no-results">
              <AlertTriangle size={48} />
              <p>{apiError ? "Error loading games." : (searchTerm ? `Sorry, no results found for "${searchTerm}".` : `There are currently no games in this category.`)}</p>
              {apiError && <p className="error-details">{apiError}</p>}
              <p>Try changing your search query or browse other sections.</p>
            </div>
          )}
        </main>
      </div>
       <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Flux. All rights reserved.</p>
        <p>Flux and the Flux logo are trademarks or registered trademarks of Flux Inc. in Ukraine and/or other countries.</p>
      </footer>
    </div>
  );
};

export default Home;