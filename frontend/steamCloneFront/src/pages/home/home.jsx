import React, { useMemo, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Home.scss';


const Arrow = ({ dir = 'right', onClick, className = '' }) => (
  <button
    type="button"
    className={`nav-arrow ${dir} ${className}`}
    aria-label={dir === 'left' ? 'Prev' : 'Next'}
    onClick={onClick}
  >
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  </button>
);

const RegularPrice = ({ value }) => (
  <div className="price-badge regular"><span className="now">{value}</span></div>
);

const DiscountPrice = ({ off, from, to }) => (
  <div className="price-badge discount">
    <span className="off">{off}</span>
    <div className="nums">
      <span className="from">{from}</span>
      <span className="now">{to}</span>
    </div>
  </div>
);

const GameCard = ({ src, alt = 'Game', price, size = 'sm', onClick }) => (
  <button type="button" className={`game-card ${size}`} onClick={onClick} aria-label={alt}>
    <img src={src} alt={alt} loading="lazy" />
    {price}
  </button>
);

const SectionHeader = ({ title, to }) => (
  <div className="section-head">
    <h3>{title}</h3>
    <NavLink to={to} className="see-all">See all</NavLink>
  </div>
);

const HERO = [
  { id: 'rdr2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-18.png',    price: <DiscountPrice off="-75%" from="2599₴" to="649₴" /> },
  { id: 'delta-force', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-22@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'expedition-33', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-20@2x.png', price: <RegularPrice value="1499₴" /> },
];

const MONTHLY = [
  { id: 'vrising', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-24.png',    price: <DiscountPrice off="-50%" from="700₴" to="350₴" /> },
  { id: 'room',    src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-18-1.png',  price: <DiscountPrice off="-75%" from="124-379₴" to="31-94₴" /> },
  { id: 'payday3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-20-1.png',  price: <DiscountPrice off="-70%" from="799₴" to="239₴" /> },
  { id: 'ffxvi',   src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-23@2x.png', price: <DiscountPrice off="-35%" from="1399₴" to="909₴" /> },
];

const N_T_TOP = [
  { id: 'card-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29@2x.png', price: <DiscountPrice off="-20%" from="124₴" to="99₴" /> },
  { id: 'card-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33@2x.png', price: <DiscountPrice off="-10%" from="225₴" to="202₴" /> },
  { id: 'card-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36@2x.png', price: <RegularPrice value="949₴" /> },
  { id: 'card-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37@2x.png', price: <DiscountPrice off="-10%" from="259₴" to="233₴" /> },
];
const N_T_BOTTOM = [
  { id: 'card-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="159₴" /> },
  { id: 'card-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-1.png',price: <RegularPrice value="Free to play" /> },
  { id: 'card-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32.png',  price: <RegularPrice value="1079₴" /> },
];

const REC_TOP = [
  { id: 'rec-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png', price: <RegularPrice value="325₴" /> },
  { id: 'rec-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-2@2x.png', price: <RegularPrice value="225₴" /> },
  { id: 'rec-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-1@2x.png', price: <RegularPrice value="415₴" /> },
  { id: 'rec-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-1@2x.png', price: <RegularPrice value="429₴" /> },
];
const REC_BOTTOM = [
  { id: 'rec-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-1.png', price: <RegularPrice value="Free to play" /> },
  { id: 'rec-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-3.png', price: <RegularPrice value="415₴" /> },
  { id: 'rec-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-1.png', price: <RegularPrice value="699₴" /> },
];

const BEST_TOP = [
  { id: 'best-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-2@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-4@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-2@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png', price: <DiscountPrice off="-20%" from="469₴" to="375₴" /> },
];
const BEST_BOTTOM = [
  { id: 'best-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="159₴" /> },
  { id: 'best-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-2.png',price: <RegularPrice value="Free to play" /> },
  { id: 'best-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-2.png',price: <RegularPrice value="Free to play" /> },
];

const StoreRail = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const doSearch = () => {
    if (!q.trim()) return;
    navigate(`/store/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="store-rail">
      <div className="rail-frame">
        <div className="rail-inner">
          <div className="rail-left">
            <NavLink to="/store/points-shop" className="rail-link">Points Shop</NavLink>
            <NavLink to="/chat" className="rail-link">Chat</NavLink>
            <NavLink to="/store/wishlist" className="rail-link">Wishlist</NavLink>
          </div>
          <div className="rail-right">
            <NavLink to="/home/search" className="filtered">Filtered Search</NavLink>
            <span className="slash">/</span>
            <div className="search" role="search">
              <input
                type="text"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                aria-label="Search games"
              />
              <button className="search-btn" type="button" onClick={doSearch} aria-label="Run search">
                <img src="https://c.animaapp.com/tF1DKM3X/img/fluent-search-sparkle-48-regular.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
        <span className="rgb-line" aria-hidden="true" />
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const ordered = useMemo(() => [idx, (idx + 1) % HERO.length, (idx + 2) % HERO.length], [idx]);

  const openGame = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from: 'home-hero' } });

  return (
    <section className="hero">
      <Arrow dir="left" onClick={() => setIdx((p) => (p + HERO.length - 1) % HERO.length)} />
      <div className="hero-cards">
        <GameCard size="lg"   src={HERO[ordered[0]].src} alt="Hero 1" price={HERO[ordered[0]].price} onClick={() => openGame(HERO[ordered[0]].id)} />
        <GameCard size="md"   src={HERO[ordered[1]].src} alt="Hero 2" price={HERO[ordered[1]].price} onClick={() => openGame(HERO[ordered[1]].id)} />
        <GameCard size="md"   src={HERO[ordered[2]].src} alt="Hero 3" price={HERO[ordered[2]].price} onClick={() => openGame(HERO[ordered[2]].id)} />
      </div>
      <Arrow dir="right" onClick={() => setIdx((p) => (p + 1) % HERO.length)} />
      <div className="dots">
        {HERO.map((_, i) => <span key={i} className={`dot ${i === idx ? 'active' : ''}`} />)}
      </div>
    </section>
  );
};

const ScrollRow = ({ items, size = 'xl' }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const scrollBy = (d) => ref.current?.scrollBy({ left: d, behavior: 'smooth' });
  const openGame = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from: 'home-row' } });

  return (
    <div className="scroll-row">
      <Arrow dir="left" onClick={() => scrollBy(-640)} className="row-arrow" />
      <div className="scroll-row__track" ref={ref}>
        {items.map((g, i) => (
          <GameCard key={g.id || i} src={g.src} alt="Game" price={g.price} size={size} onClick={() => openGame(g.id || `game-${i}`)} />
        ))}
      </div>
      <Arrow dir="right" onClick={() => scrollBy(640)} className="row-arrow" />
    </div>
  );
};

const MonthlyDiscounts = () => (
  <section className="store-section">
    <SectionHeader title="Monthly discounts" to="/store/featured" />
    <ScrollRow items={MONTHLY} size="xl" />
  </section>
);

const NewAndTrending = () => {
  const navigate = useNavigate();
  const open = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from: 'new-trending' } });
  return (
    <section className="store-section">
      <SectionHeader title="New & Trending" to="/store/discover" />
      <div className="row grid four">
        {N_T_TOP.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="sm" onClick={() => open(g.id || `nt-${i}`)} />)}
      </div>
      <div className="row grid three">
        {N_T_BOTTOM.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="wide" onClick={() => open(g.id || `ntb-${i}`)} />)}
      </div>
    </section>
  );
};

const RecommendedForYou = () => {
  const navigate = useNavigate();
  const open = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from: 'recommended' } });
  return (
    <section className="store-section">
      <SectionHeader title="Recommended for you" to="/store/discover?recommended=1" />
      <div className="row grid four">
        {REC_TOP.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="sm" onClick={() => open(g.id || `rec-${i}`)} />)}
      </div>
      <div className="row grid three">
        {REC_BOTTOM.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="wide" onClick={() => open(g.id || `recb-${i}`)} />)}
      </div>
    </section>
  );
};

const Bestsellers = () => {
  const navigate = useNavigate();
  const open = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from: 'bestsellers' } });
  return (
    <section className="store-section">
      <SectionHeader title="Bestsellers" to="/store/discover?sort=top" />
      <div className="row grid four">
        {BEST_TOP.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="sm" onClick={() => open(g.id || `best-${i}`)} />)}
      </div>
      <div className="row grid three">
        {BEST_BOTTOM.map((g, i) => <GameCard key={g.id || i} src={g.src} price={g.price} size="wide" onClick={() => open(g.id || `bestb-${i}`)} />)}
      </div>
    </section>
  );
};

const DiscoveryLoopCTA = () => (
  <section className="loop-cta">
    <div className="cta-inner">
      <div className="cta-text">
        <h4>Find your perfect world through Discovery Loop</h4>
        <p>Your queue of top-selling, new, and recommended titles</p>
      </div>
      <Arrow dir="right" onClick={() => {}} />
    </div>
  </section>
);

const Home = () => {
  return (
    <div className="store-home">
      <main className="page-inset">
        <StoreRail />
        <Hero />
        <MonthlyDiscounts />
        <NewAndTrending />
        <RecommendedForYou />
        <Bestsellers />
        <DiscoveryLoopCTA />
      </main>
    </div>
  );
};

export default Home;