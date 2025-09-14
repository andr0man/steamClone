import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Discover.scss';
import Notification from '../../../components/Notification'; 
import { Eye, Heart, XCircle, ChevronRight, Tag, ShoppingCart, Zap, TrendingUp, Percent } from 'lucide-react';

const API_BASE_URL = '';

const initialDiscoveryQueueItemState = {
  id: null,
  title: 'Loading Game...',
  mainImageUrl: 'https://via.placeholder.com/800x450/10171F/5FA8F4?Text=Loading...',
  shortDescription: 'Fetching details...',
  genres: [],
  tags: [],
  price: null,
  discountPrice: null,
  screenshots: [],
};

const MOCK_DISCOVERY_QUEUE = [
  { id: 'dq1', title: 'Astra Protocol', mainImageUrl: 'https://via.placeholder.com/800x450/2c3e50/ecf0f1?Text=Astra+Protocol', shortDescription: 'A tactical squad-based RPG set in a gritty cyberpunk future. Lead your team through challenging missions.', genres: ['RPG', 'Strategy', 'Cyberpunk'], tags: ['Tactical', 'Sci-Fi'], price: 29.99, screenshots: ['https://via.placeholder.com/150x84/2c3e50/ecf0f1?Text=AP1','https://via.placeholder.com/150x84/2c3e50/ecf0f1?Text=AP2','https://via.placeholder.com/150x84/2c3e50/ecf0f1?Text=AP3'] },
  { id: 'dq2', title: 'Verdant Bloom', mainImageUrl: 'https://via.placeholder.com/800x450/27ae60/ffffff?Text=Verdant+Bloom', shortDescription: 'A cozy farming simulation game with a magical twist. Restore an overgrown valley and uncover its secrets.', genres: ['Simulation', 'Farming', 'Casual'], tags: ['Cozy', 'Relaxing'], price: 19.99, discountPrice: 14.99, screenshots: ['https://via.placeholder.com/150x84/27ae60/ffffff?Text=VB1','https://via.placeholder.com/150x84/27ae60/ffffff?Text=VB2'] },
  { id: 'dq3', title: 'Quantum Racer', mainImageUrl: 'https://via.placeholder.com/800x450/8e44ad/f1c40f?Text=Quantum+Racer', shortDescription: 'High-speed futuristic racing with anti-gravity vehicles and challenging tracks.', genres: ['Racing', 'Sci-Fi', 'Arcade'], tags: ['Fast-Paced', 'Competitive'], price: 24.99, screenshots: ['https://via.placeholder.com/150x84/8e44ad/f1c40f?Text=QR1'] },
];

const MOCK_RECOMMENDATIONS = {
  newAndTrending: [
    { id: 'rec1', title: 'Chronoscape Renegade', imageUrl: 'https://via.placeholder.com/280x370/e74c3c/ffffff?Text=Chronoscape', price: 49.99, category: 'New Release' },
    { id: 'rec2', title: 'Legends of Aethel', imageUrl: 'https://via.placeholder.com/280x370/3498db/ffffff?Text=Aethel', price: 39.99, category: 'Popular' },
  ],
  specialOffers: [
    { id: 'rec3', title: 'Ironclad Tactics', imageUrl: 'https://via.placeholder.com/280x370/95a5a6/1c232c?Text=Ironclad', price: 19.99, discountPrice: 9.99, category: 'On Sale' },
  ]
};


const Discover = () => {
  const [discoveryQueue, setDiscoveryQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [recommendations, setRecommendations] = useState({ newAndTrending: [], specialOffers: [] });
  
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  const navigate = useNavigate();

  const fetchDiscoveryQueue = useCallback(async () => {
    setLoadingQueue(true);
    setApiError(null);
    try {
      // const response = await fetch(`${API_BASE_URL}/api/store/discovery-queue`);
      // if (!response.ok) throw new Error('Failed to fetch discovery queue');
      // const data = await response.json();
      // setDiscoveryQueue(data.queue || []);
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiscoveryQueue(MOCK_DISCOVERY_QUEUE);
      setCurrentQueueIndex(0);
    } catch (err) {
      console.error("Error fetching discovery queue:", err);
      setApiError(err.message || 'Could not load discovery queue.');
      setDiscoveryQueue([]);
    } finally {
      setLoadingQueue(false);
    }
  }, []);

  const fetchRecommendationsData = useCallback(async () => {
    setLoadingRecs(true);
    // setApiError(null); // Might clear error from queue fetch
    try {
      // const response = await fetch(`${API_BASE_URL}/api/store/recommendations`);
      // if (!response.ok) throw new Error('Failed to fetch recommendations');
      // const data = await response.json();
      // setRecommendations(data || { newAndTrending: [], specialOffers: [] });
      await new Promise(resolve => setTimeout(resolve, 700));
      setRecommendations(MOCK_RECOMMENDATIONS);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setApiError(err.message || 'Could not load recommendations.');
      setRecommendations({ newAndTrending: [], specialOffers: [] });
    } finally {
      setLoadingRecs(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscoveryQueue();
    fetchRecommendationsData();
  }, [fetchDiscoveryQueue, fetchRecommendationsData]);

  const handleNextInQueue = () => {
    if (currentQueueIndex < discoveryQueue.length - 1) {
      setCurrentQueueIndex(prevIndex => prevIndex + 1);
    } else {
      alert("Discovery queue finished! Come back later for more.");
      fetchDiscoveryQueue(); 
    }
  };
  
  const handleQueueAction = (action, gameId) => {
    if (action !== 'viewDetails') {
        handleNextInQueue(); 
    }
  };

  const currentQueueItem = discoveryQueue[currentQueueIndex] || initialDiscoveryQueueItemState;

  const renderRecommendationCard = (game) => (
    <Link to={`/games/${game.id}`} key={game.id} className="reco-game-card">
      <img src={game.imageUrl} alt={game.title} className="reco-game-image"/>
      <div className="reco-game-info">
        <h4>{game.title}</h4>
        {game.discountPrice ? (
          <div className="reco-price">
            <span className="reco-original-price">${game.price.toFixed(2)}</span>
            <span>${game.discountPrice.toFixed(2)}</span>
          </div>
        ) : (
          <p className="reco-price">${game.price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );


  return (
    <div className="discover-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

      <header className="discover-header">
        <h1>Explore Your Next Favorite Game</h1>
        <p>Discover new and interesting games tailored for you.</p>
      </header>

      <section className="discovery-queue-section">
        <h2>Your Discovery Queue</h2>
        {loadingQueue && !currentQueueItem.id ? (
          <div className="discover-loading-placeholder"><div className="spinner-discover"></div>Loading your queue...</div>
        ) : discoveryQueue.length > 0 ? (
          <div className="discovery-queue-card">
            <div className="dq-image-container">
                <img src={currentQueueItem.mainImageUrl} alt={currentQueueItem.title} className="dq-main-image"/>
                 <div className="dq-screenshots-preview">
                    {(currentQueueItem.screenshots || []).slice(0, 3).map((ss, idx) => (
                        <img key={idx} src={ss} alt={`Screenshot ${idx+1}`} />
                    ))}
                </div>
            </div>
            <div className="dq-info">
              <h3>{currentQueueItem.title}</h3>
              <p className="dq-description">{currentQueueItem.shortDescription}</p>
              {(currentQueueItem.genres || currentQueueItem.tags) && (
                <div className="dq-tags">
                  {(currentQueueItem.genres || []).map(g => <span key={g} className="tag genre-tag">{g}</span>)}
                  {(currentQueueItem.tags || []).map(t => <span key={t} className="tag misc-tag">{t}</span>)}
                </div>
              )}
              {currentQueueItem.price !== null && (
                <div className="dq-price">
                    {currentQueueItem.discountPrice ? (
                        <>
                         <span className="original">${currentQueueItem.price.toFixed(2)}</span>
                         <span>${currentQueueItem.discountPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span>${currentQueueItem.price.toFixed(2)}</span>
                    )}
                </div>
              )}
              <div className="dq-actions">
                <button onClick={() => handleQueueAction('wishlist', currentQueueItem.id)} className="action-btn wishlist"><Heart size={18}/> Wishlist</button>
                <button onClick={() => handleQueueAction('ignore', currentQueueItem.id)} className="action-btn ignore"><XCircle size={18}/> Not Interested</button>
                <button onClick={() => navigate(`/games/${currentQueueItem.id}`)} className="action-btn view-details"><Eye size={18}/> View Details</button>
                <button onClick={handleNextInQueue} className="action-btn next-in-queue primary"><ChevronRight size={18}/> Next</button>
              </div>
            </div>
          </div>
        ) : (
          <p className="discover-empty-text">Your discovery queue is currently empty. Check back later!</p>
        )}
      </section>

      <section className="recommendations-grid">
        {loadingRecs ? (
            <div className="discover-loading-placeholder"><div className="spinner-discover"></div>Loading recommendations...</div>
        ) : (
        <>
            {recommendations.newAndTrending.length > 0 && (
                <div className="reco-category-section">
                    <h2><TrendingUp size={24}/> New & Trending</h2>
                    <div className="reco-grid">{recommendations.newAndTrending.map(renderRecommendationCard)}</div>
                </div>
            )}
            {recommendations.specialOffers.length > 0 && (
                 <div className="reco-category-section">
                    <h2><Percent size={24}/> Special Offers</h2>
                    <div className="reco-grid">{recommendations.specialOffers.map(renderRecommendationCard)}</div>
                </div>
            )}
            {}
        </>
        )}
      </section>
    </div>
  );
};

export default Discover;