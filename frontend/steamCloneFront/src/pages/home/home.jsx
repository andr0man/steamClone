import React, { useMemo, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Home.scss';
import ArrowLeft from "../../../src/assets/ArrowLeft.svg";
import ArrowRight from "../../../src/assets/ArrowRight.svg";
import {Footer} from "../../components/Footer/Footer";


const Arrow = ({ dir = 'right', onClick, className = '' }) => (
  <button
    type="button"
    className={`nav-arrow ${dir} ${className}`}
    aria-label={dir === 'left' ? 'Prev' : 'Next'}
    onClick={onClick}
  >
    <img
      src={dir === 'left' ? ArrowLeft : ArrowRight}
      alt={dir === 'left' ? 'Previous' : 'Next'}
      className="arrow-icon"
    />
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
  { id: 'cyberpunk2077', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-40.png', price: <DiscountPrice off="-60%" from="1299₴" to="519₴" /> },
  { id: 'halo-infinite', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-41.png', price: <RegularPrice value="Free to play" /> },
  { id: 'elden-ring', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-42.png', price: <DiscountPrice off="-30%" from="1999₴" to="1399₴" /> },
  { id: 'minecraft', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-43.png', price: <RegularPrice value="649₴" /> },
];

const N_T_TOP = [
  { id: 'card-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29@2x.png', price: <DiscountPrice off="-20%" from="124₴" to="99₴" /> },
  { id: 'card-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33@2x.png', price: <DiscountPrice off="-10%" from="225₴" to="202₴" /> },
  { id: 'card-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36@2x.png', price: <RegularPrice value="949₴" /> },
  { id: 'card-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37@2x.png', price: <DiscountPrice off="-10%" from="259₴" to="233₴" /> },

  { id: 'card-8', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29@2x.png', price: <RegularPrice value="199₴" /> },
  { id: 'card-9', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33@2x.png', price: <DiscountPrice off="-50%" from="400₴" to="200₴" /> },
  { id: 'card-10', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36@2x.png', price: <RegularPrice value="349₴" /> },
  { id: 'card-11', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37@2x.png', price: <RegularPrice value="120₴" /> },

  { id: 'card-15', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29@2x.png', price: <RegularPrice value="199₴" /> },
  { id: 'card-16', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33@2x.png', price: <DiscountPrice off="-50%" from="400₴" to="200₴" /> },
  { id: 'card-17', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36@2x.png', price: <RegularPrice value="349₴" /> },
  { id: 'card-18', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37@2x.png', price: <RegularPrice value="120₴" /> },
];
const N_T_BOTTOM = [
  { id: 'card-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="159₴" /> },
  { id: 'card-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-1.png',price: <RegularPrice value="Free to play" /> },
  { id: 'card-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32.png',  price: <RegularPrice value="1079₴" /> },

  { id: 'card-12', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="649₴" /> },
  { id: 'card-13', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-1.png',price: <DiscountPrice off="-30%" from="300₴" to="210₴" /> },
  { id: 'card-14', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32.png',  price: <RegularPrice value="90₴" /> },

  { id: 'card-19', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="649₴" /> },
  { id: 'card-20', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-1.png',price: <DiscountPrice off="-30%" from="300₴" to="210₴" /> },
  { id: 'card-21', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32.png',  price: <RegularPrice value="90₴" /> },
];

const REC_TOP = [
  { id: 'rec-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png', price: <RegularPrice value="325₴" /> },
  { id: 'rec-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-2@2x.png', price: <RegularPrice value="225₴" /> },
  { id: 'rec-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-1@2x.png', price: <RegularPrice value="415₴" /> },
  { id: 'rec-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-1@2x.png', price: <RegularPrice value="429₴" /> },

  { id: 'rec-8', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png', price: <DiscountPrice off="-15%" from="200₴" to="170₴" /> },
  { id: 'rec-9', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-2@2x.png', price: <RegularPrice value="510₴" /> },
  { id: 'rec-10', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-1@2x.png', price: <DiscountPrice off="-40%" from="600₴" to="360₴" /> },
  { id: 'rec-11', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-1@2x.png', price: <RegularPrice value="180₴" /> },
];
const REC_BOTTOM = [
  { id: 'rec-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-1.png', price: <RegularPrice value="Free to play" /> },
  { id: 'rec-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-3.png', price: <RegularPrice value="415₴" /> },
  { id: 'rec-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-1.png', price: <RegularPrice value="699₴" /> },

  { id: 'rec-12', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-1.png', price: <RegularPrice value="99₴" /> },
  { id: 'rec-13', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-3.png', price: <RegularPrice value="349₴" /> },
  { id: 'rec-14', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-1.png', price: <DiscountPrice off="-25%" from="400₴" to="300₴" /> },
];

const BEST_TOP = [
  { id: 'best-1', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-2@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-2', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-4@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-3', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-2@2x.png', price: <RegularPrice value="Free to play" /> },
  { id: 'best-4', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png', price: <DiscountPrice off="-20%" from="469₴" to="375₴" /> },

  { id: 'best-8', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-2@2x.png', price: <RegularPrice value="499₴" /> },
  { id: 'best-9', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-4@2x.png', price: <DiscountPrice off="-35%" from="600₴" to="390₴" /> },
  { id: 'best-10', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-2@2x.png', price: <RegularPrice value="279₴" /> },
  { id: 'best-11', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png', price: <RegularPrice value="Free to play" /> },
];
const BEST_BOTTOM = [
  { id: 'best-5', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="159₴" /> },
  { id: 'best-6', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-2.png',price: <RegularPrice value="Free to play" /> },
  { id: 'best-7', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-2.png',price: <RegularPrice value="Free to play" /> },

  { id: 'best-12', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-35.png',  price: <RegularPrice value="249₴" /> },
  { id: 'best-13', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-2.png',price: <DiscountPrice off="-15%" from="199₴" to="169₴" /> },
  { id: 'best-14', src: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-2.png',price: <RegularPrice value="349₴" /> },
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
      <svg className="store-rail-bg" width="100%" height="80" viewBox="0 0 500 80" preserveAspectRatio="none">
        <polygon points="0,0 500,0 500,50 480,80 20,80 0,50" fill="#141320" stroke="#fff" strokeWidth="2"/>
      </svg>
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
      </div>
    </div>
  );
};

const StoreRailWrapper = () => {
  return (
    <div className="store-rail-wrapper">
      <div className="rail-edge left" />
      <StoreRail />
      <div className="rail-edge right" />
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const ordered = useMemo(() => [idx, (idx + 1) % HERO.length, (idx + 2) % HERO.length], [idx]);

  const openGame = (slug) => navigate(`/store/game/${slug}`, { state: { slug, from: 'home-hero' } });

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
        {HERO.map((_, i) => (
          <span key={i} className={`dot ${i === idx ? 'active' : ''}`} />
        ))}
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

const HorizontalBlockRow = ({ title, topArr, bottomArr, from }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const open = (slug) => navigate(`/library/gameinfo/${slug}`, { state: { slug, from } });

  const blocks = [];
  const maxBlocks = Math.ceil(Math.max(topArr.length / 4, bottomArr.length / 3));
  for (let i = 0; i < maxBlocks; i++) {
    blocks.push({
      top: topArr.slice(i * 4, i * 4 + 4),
      bottom: bottomArr.slice(i * 3, i * 3 + 3),
    });
  }

  const totalPages = blocks.length;

  const scroll = (dir) => {
  if (dir === "left") {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  } else {
    setPage((p) => (p + 1) % totalPages);
  }
};

  return (
    <section className="store-section">
      <SectionHeader title={title} to="/store/discover" />
      <div className="scroll-row">
        <Arrow dir="left" onClick={() => scroll("left")} className="row-arrow" />
        <div className="scroll-row__track-wrapper">
          <div
            className="scroll-row__track two-rows"
            ref={containerRef}
            style={{
              display: "flex",
              transition: "transform 0.5s ease",
              transform: `translateX(-${page * 100}%)`,
            }}
          >
            {blocks.map((block, i) => (
              <div className="block" key={i} style={{ minWidth: "100%"}}>
                <div className="row grid four">
                  {block.top.map((g, idx) => (
                    <GameCard key={g.id || idx} src={g.src} price={g.price} size="sm" onClick={() => open(g.id || `${from}-top-${i}-${idx}`)} />
                  ))}
                </div>
                <div className="row grid three">
                  {block.bottom.map((g, idx) => (
                    <GameCard key={g.id || idx} src={g.src} price={g.price} size="wide" onClick={() => open(g.id || `${from}-bottom-${i}-${idx}`)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Arrow dir="right" onClick={() => scroll("right")} className="row-arrow" />
      </div>
      <div className="dots">
        {blocks.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === page ? "active" : ""}`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>
    </section>
  );
};

const NewAndTrending = () => (
  <HorizontalBlockRow title="New & Trending" topArr={N_T_TOP} bottomArr={N_T_BOTTOM} from="new-trending" />
);

const RecommendedForYou = () => (
  <HorizontalBlockRow title="Recommended for you" topArr={REC_TOP} bottomArr={REC_BOTTOM} from="recommended" />
);

const Bestsellers = () => (
  <HorizontalBlockRow title="Bestsellers" topArr={BEST_TOP} bottomArr={BEST_BOTTOM} from="bestsellers" />
);

const DiscoveryLoopCTA = () => {
  const navigate = useNavigate();
  return(
    <section className="loop-cta">
      <div className="cta-inner">
        <div className="cta-text">
          <h4>Find your perfect world through Discovery Loop</h4>
          <p>Your queue of top-selling, new, and recommended titles</p>
        </div>
        <Arrow dir="right" onClick={() => {navigate("/store/discover"); window.scrollTo(0, 0);}} />
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="store-home">
      <main className="page-inset">
        <StoreRailWrapper />
        <Hero />
        <MonthlyDiscounts />
        <NewAndTrending />
        <RecommendedForYou />
        <Bestsellers />
        <DiscoveryLoopCTA />
      </main>
      <Footer/>
    </div>
  );
};

export default Home;