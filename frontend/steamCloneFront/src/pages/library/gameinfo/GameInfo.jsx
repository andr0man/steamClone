import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './GameInfo.scss';
import Notification from '../../../components/Notification';
import {
  ArrowLeft,
  PlayCircle,
  DownloadCloud,
  ShoppingCart,
  Image as ImageIcon,
  Video,
  Info as InfoIcon,
  ServerCrash
} from 'lucide-react';
import {
  useGetGameByIdQuery,
  useBuyGameMutation,
} from '../../../services/game/gameApi';
import {
  useGetIsInGameLibraryQuery,
} from '../../../services/game-library/gameLibraryApi';

const FALLBACK_HEADER = 'https://via.placeholder.com/1200x400/10171F/5FA8F4?text=Game+Header';
const FALLBACK_COVER = 'https://via.placeholder.com/300x400/1A2838/66c0f4?text=Game';
const moneyUAH = (n) => `${Math.round(Number(n || 0))}₴`;
const nnum = (v) => (v == null ? null : Number(v));

const mapGame = (resp) => {
  const g = resp?.payload ?? resp ?? {};
  const title = g?.name ?? g?.title ?? 'Game';
  const headerImageUrl =
    g?.headerImageUrl ??
    g?.coverImageUrl ??
    (Array.isArray(g?.screenshots) && g.screenshots[0]) ??
    FALLBACK_HEADER;
  const coverImageUrl =
    g?.coverImageUrl ??
    (Array.isArray(g?.screenshots) && g.screenshots[0]) ??
    FALLBACK_COVER;

  const basePrice = nnum(g?.originalPrice ?? g?.basePrice ?? g?.standardPrice ?? g?.price ?? g?.finalPrice);
  const nowPrice = nnum(g?.finalPrice ?? g?.price ?? basePrice);
  let discountPercent = nnum(g?.discountPercent ?? g?.discount);
  if (discountPercent == null && basePrice != null && nowPrice != null && nowPrice < basePrice && basePrice > 0) {
    discountPercent = Math.round((1 - nowPrice / basePrice) * 100);
  }

  const genres = Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x).filter(Boolean) : [];
  const tags = Array.isArray(g?.tags) ? g.tags.map((x) => x?.name ?? x).filter(Boolean) : [];

  let minReq = '';
  let recReq = '';
  const sr = g?.systemRequirements;
  if (sr && typeof sr === 'object' && !Array.isArray(sr)) {
    minReq = sr.minimum || '';
    recReq = sr.recommended || '';
  } else if (Array.isArray(sr)) {
    const toBlock = (arr) =>
      arr
        .map((r) => {
          const key = r?.requirementType ?? r?.type ?? r?.level ?? '';
          const lines = [
            r?.os && `OS: ${r.os}`,
            r?.processor && `Processor: ${r.processor}`,
            r?.memory && `Memory: ${r.memory}`,
            r?.graphics && `Graphics: ${r.graphics}`,
            r?.storage && `Storage: ${r.storage}`,
            r?.notes && `Notes: ${r.notes}`,
          ].filter(Boolean);
          return { key: String(key).toLowerCase(), text: lines.join('\n') };
        })
        .filter((x) => x.text);
    const blocks = toBlock(sr);
    minReq = blocks.find((b) => b.key.includes('min'))?.text || '';
    recReq = blocks.find((b) => b.key.includes('rec'))?.text || '';
  }

  const screenshots = Array.isArray(g?.screenshots) ? g.screenshots : [];
  const videos = Array.isArray(g?.videos) ? g.videos : [];

  return {
    id: g?.id ?? g?.slug ?? '',
    title,
    tagline: g?.tagline ?? '',
    headerImageUrl,
    coverImageUrl,
    description: g?.description ?? g?.shortDescription ?? '',
    longDescription: g?.longDescription ?? g?.description ?? '',
    releaseDate: g?.releaseDate ?? g?.createdAt ?? null,
    developer: g?.developer?.name ?? g?.developerName ?? g?.developer ?? null,
    publisher: g?.publisher?.name ?? g?.publisherName ?? g?.publisher ?? null,
    genres,
    tags,
    basePrice,
    nowPrice,
    discountPercent,
    screenshots,
    videos,
    systemRequirements: {
      minimum: minReq || 'Not specified.',
      recommended: recReq || 'Not specified.',
    },
  };
};

const boolish = (val) => {
  if (typeof val === 'boolean') return val;
  if (val && typeof val === 'object') {
    if ('payload' in val) return !!val.payload;
    if ('isInLibrary' in val) return !!val.isInLibrary;
    if ('inLibrary' in val) return !!val.inLibrary;
    if ('bought' in val) return !!val.bought;
    if ('value' in val) return !!val.value;
  }
  return !!val;
};

const fmtDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? 'N/A'
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { data, isFetching, isError, error, refetch } = useGetGameByIdQuery(gameId, { skip: !gameId });
  const { data: inLibData, refetch: refetchInLib } = useGetIsInGameLibraryQuery(gameId, { skip: !gameId });
  const [buyGame, { isLoading: buying }] = useBuyGameMutation();

  const [activeMediaTab, setActiveMediaTab] = useState('screenshots');
  const [apiError, setApiError] = useState(null);
  const [notice, setNotice] = useState(null);

  const details = useMemo(() => mapGame(data), [data]);
  const isOwned = useMemo(() => boolish(inLibData), [inLibData]);
  const isInstalled = false;
  const hoursPlayed = 0;

  const handleBuy = async () => {
    if (!details?.id) return;
    setApiError(null);
    setNotice(null);
    try {
      await buyGame(details.id).unwrap();
      setNotice('Game purchased and added to your library');
      await Promise.all([refetchInLib(), refetch()]);
    } catch (e) {
      setApiError(e?.data?.message || 'Purchase failed');
    }
  };

  if (!gameId) {
    return (
      <div className="gameinfo-error-state">
        <ServerCrash size={64} />
        <h2>Error Loading Game Data</h2>
        <p>No game ID specified in the URL.</p>
        <button onClick={() => navigate(-1)} className="action-button-gi back-button-gi">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="gameinfo-loading-page">
        <div className="spinner-xl-gi"></div>
        Loading Game Details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="gameinfo-error-state">
        <ServerCrash size={64} />
        <h2>Error Loading Game Data</h2>
        <p>{error?.data?.message || 'Failed to load game details.'}</p>
        <button onClick={() => navigate(-1)} className="action-button-gi back-button-gi">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const {
    id,
    title,
    tagline,
    headerImageUrl,
    coverImageUrl,
    description,
    longDescription,
    releaseDate,
    developer,
    publisher,
    genres,
    tags,
    basePrice,
    nowPrice,
    discountPercent,
    screenshots,
    videos,
    systemRequirements,
  } = details;

  const hasPrice = basePrice != null || nowPrice != null;
  const showDiscount = discountPercent != null && discountPercent > 0 && basePrice != null && nowPrice != null && nowPrice < basePrice;

  return (
    <div className="gameinfo-page-wrapper">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
      <Notification message={notice} type="success" onClose={() => setNotice(null)} />

      <button onClick={() => navigate(-1)} className="gameinfo-back-button">
        <ArrowLeft size={20} /> Back
      </button>

      <header
        className="gameinfo-header"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(21,26,33,1) 10%, rgba(21,26,33,0.7) 50%, rgba(21,26,33,0.3) 80%, transparent 100%), url(${headerImageUrl || FALLBACK_HEADER})`,
        }}
      >
        <div className="gameinfo-header-content">
          <div className="gameinfo-cover-art">
            <img src={coverImageUrl || FALLBACK_COVER} alt={`${title} Cover Art`} />
          </div>
          <div className="gameinfo-title-meta">
            <h1>{title}</h1>
            {tagline && <p className="gameinfo-tagline">{tagline}</p>}
            <div className="gameinfo-quick-details">
              {developer && <span><strong>Developer:</strong> {developer}</span>}
              {publisher && <span><strong>Publisher:</strong> {publisher}</span>}
              {releaseDate && <span><strong>Released:</strong> {fmtDate(releaseDate)}</span>}
            </div>
          </div>
          <div className="gameinfo-actions-header">
            {isOwned ? (
              <button className="action-button-gi primary">
                {isInstalled ? <PlayCircle size={20} /> : <DownloadCloud size={20} />}
                {isInstalled ? `Play (${hoursPlayed}h)` : 'Install'}
              </button>
            ) : hasPrice ? (
              <button className="action-button-gi store-link" disabled={buying} onClick={handleBuy}>
                <ShoppingCart size={20} />
                {showDiscount ? (
                  <>
                    <span className="original-price">{moneyUAH(basePrice)}</span> {moneyUAH(nowPrice)}
                  </>
                ) : (
                  moneyUAH(nowPrice ?? basePrice)
                )}
              </button>
            ) : (
              <span className="price-not-available">Not available for purchase</span>
            )}
            {!isOwned && (
              <Link to={`/store/game/${id}`} className="action-button-gi secondary">
                View Store Page
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="gameinfo-main-content-area">
        <div className="gameinfo-left-column">
          <section className="gameinfo-section media-gallery">
            <h2>Media</h2>
            <div className="media-tabs">
              <button
                className={`media-tab-button ${activeMediaTab === 'screenshots' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('screenshots')}
              >
                <ImageIcon size={18} /> Screenshots ({(screenshots || []).length})
              </button>
              <button
                className={`media-tab-button ${activeMediaTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('videos')}
              >
                <Video size={18} /> Videos ({(videos || []).length})
              </button>
            </div>
            {activeMediaTab === 'screenshots' && (
              <div className="screenshots-grid">
                {(screenshots && screenshots.length > 0) ? (
                  screenshots.map((src, index) => (
                    <a href={src} target="_blank" rel="noopener noreferrer" key={index} className="screenshot-link">
                      <img src={src} alt={`Screenshot ${index + 1}`} />
                    </a>
                  ))
                ) : (
                  <p className="no-media">No screenshots available.</p>
                )}
              </div>
            )}
            {activeMediaTab === 'videos' && (
              <div className="videos-list">
                {(videos && videos.length > 0) ? (
                  videos.map((video) => (
                    <div key={video.id || video.videoId} className="video-item">
                      {video.type === 'youtube' && (
                        <iframe
                          width="100%"
                          src={`https://www.youtube.com/embed/${video.videoId}`}
                          title={video.name || 'Game Video'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      <p className="video-title">{video.name || 'Game Trailer'}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-media">No videos available.</p>
                )}
              </div>
            )}
          </section>

          <section className="gameinfo-section description-section">
            <h2><InfoIcon size={20} /> About This Game</h2>
            <div
              className="game-description-text"
              dangerouslySetInnerHTML={{
                __html:
                  (longDescription || description || 'No detailed description provided.')
                    .replace(/\n/g, '<br />'),
              }}
            />
          </section>
        </div>

        <aside className="gameinfo-right-sidebar">
          <section className="gameinfo-section details-list">
            <h2>Game Details</h2>
            <ul>
              {!!genres?.length && (
                <li><strong>Genres:</strong> {genres.join(', ')}</li>
              )}
              {!!tags?.length && (
                <li>
                  <strong>Tags:</strong>
                  <div className="tags-container">
                    {tags.map((t) => (
                      <span key={t} className="detail-tag">{t}</span>
                    ))}
                  </div>
                </li>
              )}
              <li><strong>Developer:</strong> {developer || 'N/A'}</li>
              <li><strong>Publisher:</strong> {publisher || 'N/A'}</li>
              <li><strong>Release Date:</strong> {fmtDate(releaseDate)}</li>
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