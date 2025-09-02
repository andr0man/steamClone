import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './GameInfo.scss';
import Notification from '../../../components/Notification';
import { ArrowLeft, PlayCircle, DownloadCloud, ShoppingCart, Tag, CalendarDays, Users, CheckCircle, XCircle, Image as ImageIcon, Video, Info as InfoIcon, ServerCrash } from 'lucide-react';

const API_BASE_URL = '';

const initialGameDetailsState = {
  title: 'Loading Game...',
  tagline: '',
  headerImageUrl: 'https://via.placeholder.com/1200x400/10171F/5FA8F4?Text=Loading+Game',
  coverImageUrl: 'https://via.placeholder.com/300x400/1A2838/66c0f4?Text=Game',
  description: 'Loading description...',
  longDescription: 'Please wait while we fetch the full game details.',
  releaseDate: 'N/A',
  developer: 'N/A',
  publisher: 'N/A',
  genres: [],
  tags: [],
  price: null,
  discountPrice: null,
  storePageUrl: '',
  screenshots: [],
  videos: [],
  systemRequirements: { minimum: 'Loading...', recommended: 'Loading...' },
  isInstalled: false,
  isOwned: false, 
  hoursPlayed: 0,
};

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState(initialGameDetailsState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('screenshots');

  const fetchGameDetails = useCallback(async (id) => {
    setLoading(true);
    setApiError(null);
    setGameDetails(initialGameDetailsState); 
    try {
      // const token = localStorage.getItem('authToken'); 
      // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      // const response = await fetch(`${API_BASE_URL}/api/games/${id}`, { headers });

      // Симуляція API запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponses = {
        '1': { ok: true, json: async () => ({ id: 1, title: 'CyberRevolt 2088', tagline: 'The future is a neon-drenched battleground.', headerImageUrl: 'https://via.placeholder.com/1200x450/10171F/5FA8F4?Text=CyberRevolt+Header', coverImageUrl: 'https://via.placeholder.com/300x400/1A2838/66c0f4?Text=CyberRevolt', description: 'Dive into the dystopian Neo-Kyoto of 2088. As a renegade cyber-enhanced mercenary, navigate a web of corporate espionage, underground rebellion, and high-octane combat. Your choices will shape the fate of the city. Features deep customization, a branching narrative, and visceral first-person action. Explore vast cityscapes, engage in thrilling shootouts, and upgrade your cybernetics to become the ultimate urban legend.', releaseDate: '2025-10-27', developer: 'SynthCore Games', publisher: 'Fluxi Interactive', genres: ['RPG', 'Cyberpunk', 'Open World', 'FPS'], tags: ['Singleplayer', 'Story Rich', 'Atmospheric', 'Sci-fi', 'Action'], price: 59.99, discountPrice: 39.99, storePageUrl: '/store/game/1', screenshots: ['https://via.placeholder.com/800x450/1A2838/C7D0D8?Text=CR+Screenshot+1', 'https://via.placeholder.com/800x450/1A2838/A6ADC8?Text=CR+Screenshot+2', 'https://via.placeholder.com/800x450/1A2838/9AA6B3?Text=CR+Screenshot+3'], videos: [{ id: 'vid_cr1', type: 'youtube', videoId: 'U_t5pXoAGqY', name: 'Official Gameplay Trailer' }], systemRequirements: { minimum: "OS: Windows 10 (64-bit)\nProcessor: Intel Core i5-8700K\nMemory: 16 GB RAM\nGraphics: NVIDIA GeForce GTX 1070\nStorage: 150 GB", recommended: "OS: Windows 11 (64-bit)\nProcessor: Intel Core i7-10700K\nMemory: 32 GB RAM\nGraphics: NVIDIA GeForce RTX 3070\nStorage: 150 GB (SSD Recommended)"}, isInstalled: true, isOwned: true, hoursPlayed: 120 }) },
        '2': { ok: true, json: async () => ({ id: 2, title: 'The Witcher 3: Wild Hunt', tagline: 'Slay monsters. Choose your fate.', headerImageUrl: 'https://via.placeholder.com/1200x450/10171F/c0392b?Text=Witcher+3+Header', coverImageUrl: 'https://via.placeholder.com/300x400/FF0000/FFFFFF?Text=Witcher+3', description: 'The Witcher: Wild Hunt is a story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher, you play as professional monster hunter Geralt of Rivia tasked with finding a child of prophecy in a vast open world rich with merchant cities, pirate islands, dangerous mountain passes, and forgotten caverns to explore.', releaseDate: '2015-05-19', developer: 'CD PROJEKT RED', publisher: 'CD PROJEKT RED', genres: ['RPG', 'Fantasy', 'Open World'], tags: ['Story Rich', 'Mature', 'Great Soundtrack', 'Multiple Endings'], price: 39.99, discountPrice: null, storePageUrl: '/store/game/2', screenshots: ['https://via.placeholder.com/800x450/1A2838/C7D0D8?Text=W3+Screenshot+1', 'https://via.placeholder.com/800x450/1A2838/A6ADC8?Text=W3+Screenshot+2'], videos: [], systemRequirements: { minimum: "OS: Windows 7 (64-bit)\nProcessor: Intel Core i5-2500K\nMemory: 6 GB RAM\nGraphics: NVIDIA GeForce GTX 660\nStorage: 35 GB", recommended: "OS: Windows 10 (64-bit)\nProcessor: Intel Core i7-3770\nMemory: 8 GB RAM\nGraphics: NVIDIA GeForce GTX 770\nStorage: 35 GB"}, isInstalled: false, isOwned: false, hoursPlayed: 350 })},
        'nonexistent': { ok: false, status: 404, json: async () => ({ message: 'Game with this ID was not found on the server.' }) }
      };
      const response = mockResponses[id] || mockResponses['nonexistent'];

      if (!response.ok) {
        let errorMessage = `Failed to fetch game details. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setGameDetails(prev => ({ ...initialGameDetailsState, ...data }));

    } catch (err) {
      console.error(`Error fetching details for game ${id}:`, err);
      setApiError(err.message || `Could not load details for game ID ${id}.`);
      setGameDetails({ ...initialGameDetailsState, title: 'Error Loading Game', description: `Failed to load game details. ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails(gameId);
    } else {
      setApiError('No game ID specified in the URL.');
      setLoading(false);
      setGameDetails({ ...initialGameDetailsState, title: 'Invalid Game Request', description: 'No game ID was provided to display.' });
    }
  }, [gameId, fetchGameDetails]);
  
  const formatGameDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <div className="gameinfo-loading-page"><div className="spinner-xl-gi"></div>Loading Game Details...</div>;
  }

  if (apiError || !gameDetails || gameDetails.title === 'Game Not Found' || gameDetails.title === 'Error Loading Game' || gameDetails.title === 'Invalid Game Request') {
    return (
      <div className="gameinfo-error-state">
        <ServerCrash size={64} />
        <h2>{gameDetails?.title === 'Game Not Found' ? 'Game Not Found' : 'Error Loading Game Data'}</h2>
        <p>{apiError || gameDetails?.description || 'The requested game details could not be retrieved or the game does not exist.'}</p>
        <button onClick={() => navigate(-1)} className="action-button-gi back-button-gi">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const { title, tagline, headerImageUrl, coverImageUrl, description, longDescription, releaseDate, developer, publisher, genres, tags, price, discountPrice, storePageUrl, screenshots, videos, systemRequirements, isInstalled, isOwned, hoursPlayed } = gameDetails;

  return (
    <div className="gameinfo-page-wrapper">
      <button onClick={() => navigate(-1)} className="gameinfo-back-button">
        <ArrowLeft size={20} /> Back
      </button>

      <header className="gameinfo-header" style={{backgroundImage: `linear-gradient(to top, rgba(21,26,33,1) 10%, rgba(21,26,33,0.7) 50%, rgba(21,26,33,0.3) 80%, transparent 100%), url(${headerImageUrl})`}}>
        <div className="gameinfo-header-content">
            <div className="gameinfo-cover-art">
                <img src={coverImageUrl} alt={`${title} Cover Art`} />
            </div>
            <div className="gameinfo-title-meta">
                <h1>{title}</h1>
                {tagline && <p className="gameinfo-tagline">{tagline}</p>}
                <div className="gameinfo-quick-details">
                    {developer && <span><strong>Developer:</strong> {developer}</span>}
                    {publisher && <span><strong>Publisher:</strong> {publisher}</span>}
                    {releaseDate !== 'N/A' && <span><strong>Released:</strong> {formatGameDate(releaseDate)}</span>}
                </div>
            </div>
            <div className="gameinfo-actions-header">
                {isOwned ? (
                    <button className="action-button-gi primary">
                        {isInstalled ? <PlayCircle size={20}/> : <DownloadCloud size={20}/>}
                        {isInstalled ? `Play (${hoursPlayed}h)` : 'Install'}
                    </button>
                ) : price !== null ? (
                    <Link to={storePageUrl || `/store/game/${gameDetails.id}`} className="action-button-gi store-link">
                        <ShoppingCart size={20}/> 
                        {discountPrice ? (
                            <> <span className="original-price">${price.toFixed(2)}</span> ${discountPrice.toFixed(2)} </>
                        ) : `$${price.toFixed(2)}`}
                    </Link>
                ) : (
                  <span className="price-not-available">Not available for purchase</span>
                )}
            </div>
        </div>
      </header>

      <main className="gameinfo-main-content-area">
        <div className="gameinfo-left-column">
            <section className="gameinfo-section media-gallery">
                <h2>Media</h2>
                <div className="media-tabs">
                    <button className={`media-tab-button ${activeMediaTab === 'screenshots' ? 'active' : ''}`} onClick={() => setActiveMediaTab('screenshots')}>
                       <ImageIcon size={18}/> Screenshots ({(screenshots || []).length})
                    </button>
                    <button className={`media-tab-button ${activeMediaTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveMediaTab('videos')}>
                        <Video size={18}/> Videos ({(videos || []).length})
                    </button>
                </div>
                {activeMediaTab === 'screenshots' && (
                    <div className="screenshots-grid">
                        {(screenshots && screenshots.length > 0) ? screenshots.map((src, index) => (
                            <a href={src} target="_blank" rel="noopener noreferrer" key={index} className="screenshot-link">
                               <img src={src} alt={`Screenshot ${index + 1}`} />
                            </a>
                        )) : <p className="no-media">No screenshots available.</p>}
                    </div>
                )}
                {activeMediaTab === 'videos' && (
                    <div className="videos-list">
                        {(videos && videos.length > 0) ? videos.map((video) => (
                           <div key={video.id || video.videoId} className="video-item">
                             {video.type === 'youtube' && (
                                <iframe 
                                    width="100%" 
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.name || 'Game Video'}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen>
                                </iframe>
                             )}
                             <p className="video-title">{video.name || 'Game Trailer'}</p>
                           </div>
                        )) : <p className="no-media">No videos available.</p>}
                    </div>
                )}
            </section>
            
            <section className="gameinfo-section description-section">
                <h2><InfoIcon size={20}/> About This Game</h2>
                <div className="game-description-text" dangerouslySetInnerHTML={{ __html: longDescription?.replace(/\n/g, '<br />') || description || '<p>No detailed description provided.</p>' }} />
            </section>
        </div>

        <aside className="gameinfo-right-sidebar">
            <section className="gameinfo-section details-list">
                <h2>Game Details</h2>
                <ul>
                    {genres && genres.length > 0 && (
                        <li><strong>Genres:</strong> {genres.join(', ')}</li>
                    )}
                    {tags && tags.length > 0 && (
                        <li><strong>Tags:</strong> 
                            <div className="tags-container">
                                {tags.map(tag => <span key={tag} className="detail-tag">{tag}</span>)}
                            </div>
                        </li>
                    )}
                     <li><strong>Developer:</strong> {developer || 'N/A'}</li>
                     <li><strong>Publisher:</strong> {publisher || 'N/A'}</li>
                     <li><strong>Release Date:</strong> {formatGameDate(releaseDate)}</li>
                </ul>
            </section>
            <section className="gameinfo-section sys-req-section">
                <h2>System Requirements</h2>
                <div className="sys-req-columns">
                    <div>
                        <h3>Minimum</h3>
                        <pre>{systemRequirements?.minimum || 'Not specified.'}</pre>
                    </div>
                    <div>
                        <h3>Recommended</h3>
                        <pre>{systemRequirements?.recommended || 'Not specified.'}</pre>
                    </div>
                </div>
            </section>
        </aside>
      </main>
    </div>
  );
};

export default GameInfo;