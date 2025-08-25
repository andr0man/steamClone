import React, { useState, useEffect, useCallback } from 'react';
import './featured.scss';
import Notification from '../../../components/Notification';
import { Gamepad2, Star, Percent, Tag, AlertTriangle } from 'lucide-react';

const API_BASE_URL = '';

const initialFeaturedState = {
  heroGame: null,
  newReleases: [],
  topSellers: [],
  specialOffers: [],
};

const Featured = () => {
  const [featuredData, setFeaturedData] = useState(initialFeaturedState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchFeaturedData = useCallback(async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error loading data from ${endpoint}:`, err);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadAllFeaturedData = async () => {
      setLoading(true);
      setApiError(null);

      const results = await Promise.all([
        fetchFeaturedData('/hero-featured'),    
        fetchFeaturedData('/new-releases?limit=10'),
        fetchFeaturedData('/top-sellers?limit=10'),  
        fetchFeaturedData('/special-offers?limit=10')
      ]);

      const [heroData, newReleasesData, topSellersData, specialOffersData] = results;

      if (!heroData && !newReleasesData && !topSellersData && !specialOffersData) {
        setApiError('Could not load any data for the featured page. Please try again later.');
      }

      setFeaturedData({
        heroGame: heroData?.featuredGame || null,
        newReleases: newReleasesData?.games || [],
        topSellers: topSellersData?.games || [],
        specialOffers: specialOffersData?.games || [],
      });

      setLoading(false);
    };

    loadAllFeaturedData();
  }, [fetchFeaturedData]);
  
  const renderGameCard = (game) => (
    <div key={game.id || game._id} className="game-card">
      <div className="game-card-image-container">
        <img src={game.imageUrl || 'https://via.placeholder.com/300x450/1e252e/c7d5e0?text=No+Image'} alt={game.title || 'Game'} className="game-card-image" />
      </div>
      <div className="game-card-info">
        <h3 className="game-card-title">{game.title || 'Untitled'}</h3>
        <div className="game-card-price">
           {game.discountPrice ? (
             <>
               <span className="game-price-badge">-{Math.round(((game.price - game.discountPrice) / game.price) * 100)}%</span>
               <span className="game-price-original">${game.price.toFixed(2)}</span>
               <span className="game-price-discounted">${game.discountPrice.toFixed(2)}</span>
             </>
           ) : (
            <span className="game-price-current">${(game.price || 0).toFixed(2)}</span>
           )}
        </div>
      </div>
    </div>
  );
  
  const GameCarousel = ({ title, games, icon }) => {
    if (!games || games.length === 0) return null;
    return (
      <section className="featured-section">
        <h2 className="section-title">
          {icon} {title}
        </h2>
        <div className="game-carousel">
          {games.map(renderGameCard)}
        </div>
      </section>
    );
  };
  
  if (loading) {
    return <div className="featured-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="featured-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

      {featuredData.heroGame && (
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(to right, rgba(24,30,37,0.9) 20%, rgba(24,30,37,0.5) 50%, transparent 100%), url(${featuredData.heroGame.bannerUrl || 'https://via.placeholder.com/1600x600/1A2838/66c0f4?text=Featured'})` }}>
          <div className="hero-content">
            <img src={featuredData.heroGame.logoUrl || ''} alt={`${featuredData.heroGame.title} Logo`} className="hero-game-logo" />
            <p className="hero-description">{(featuredData.heroGame.description || '').substring(0, 120)}...</p>
            <div className="hero-actions">
              <button className="hero-button primary">Buy Now for ${featuredData.heroGame.price?.toFixed(2)}</button>
              <button className="hero-button secondary">Add to Wishlist</button>
            </div>
          </div>
        </section>
      )}

      <main className="featured-main-content">
        <GameCarousel title="New & Noteworthy" games={featuredData.newReleases} icon={<Gamepad2 size={24}/>} />
        <GameCarousel title="Top Sellers" games={featuredData.topSellers} icon={<Star size={24}/>} />
        <GameCarousel title="Special Offers" games={featuredData.specialOffers} icon={<Percent size={24}/>} />
        
        {!loading && !featuredData.heroGame && featuredData.newReleases.length === 0 && (
           <div className="no-results">
             <AlertTriangle size={48} />
             <p>{apiError ? "Error loading content." : "No featured content available at the moment."}</p>
             {apiError && <p className="error-details">{apiError}</p>}
           </div>
        )}
      </main>
    </div>
  );
};

export default Featured;