import React, { useMemo, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Home.scss';
import ArrowLeft from "../../../src/assets/ArrowLeft.svg";
import ArrowRight from "../../../src/assets/ArrowRight.svg";
import { useGetAllGamesQuery } from "../../services/game/gameApi";
import {Footer} from "../../components/Footer/Footer.jsx";

const FALLBACK_IMG = "https://via.placeholder.com/640x360/1c232c/ffffff.png?text=Game";

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

const fmt = (n) => {
  if (n == null) return '-';
  const v = Number(n);
  if (Number.isNaN(v)) return String(n);
  return `${Math.round(v)}₴`;
};

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const nnum = (v) => (v == null ? null : Number(v));

const normalizeGames = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;
    const idRaw = g?.slug ?? g?.id ?? row?.gameId ?? row?.id ?? g?.name ?? g?.title;
    const id = String(idRaw ?? "").trim() || slugify(g?.name ?? g?.title ?? crypto.randomUUID());
    const imageUrl =
      g?.coverImageUrl ??
      g?.coverImage ??
      (Array.isArray(g?.screenshots) ? g.screenshots[0] : null) ??
      null;

    return {
      id: id,
      title: g?.name ?? g?.title ?? "Game",
      imageUrl: imageUrl || FALLBACK_IMG,
      price: nnum(g?.price ?? 0),
      discount: nnum(g?.discount ?? 0),
      isFree: Boolean(g?.isFree ?? (Number(g?.finalPrice ?? g?.price) === 0)),
      releaseDate: g?.releaseDate ?? g?.createdAt ?? g?.publishDate ?? null,
      popularity: nnum(g?.percentageOfPositiveReviews) ?? 0,
      genres: Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x) : [],
    };
  });
};

const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(0);
  };

const discountOf = (g) => {
  return nnum(g?.discount) || 0;
};

const priceBadge = (g) => {
  const disc = discountOf(g);

  if (g?.isFree) return <RegularPrice value="Free to play" />;
  
  const originalPrice = g.price;
  if (disc > 0) {
    const discountedPrice = calculateDiscountedPrice(originalPrice, disc);
    return <DiscountPrice off={`-${disc}%`} from={fmt(originalPrice)} to={fmt(discountedPrice)} />;
  }
  return <RegularPrice value={fmt(originalPrice)} />;
};

const toCard = (g) => ({
  id: g.id,
  src: g.imageUrl || FALLBACK_IMG,
  price: priceBadge(g),
});

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

const Hero = ({ items }) => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const cards = (items || []).slice(0, 3).map(toCard);
  const len = Math.max(1, cards.length);
  const ordered = useMemo(() => [idx % len, (idx + 1) % len, (idx + 2) % len], [idx, len]);
  const openGame = (slug) => navigate(`/store/game/${slug}`, { state: { slug, from: 'home-hero' } });

  if (!cards.length) {
    return (
      <section className="hero">
        <div className="hero-cards">
          <GameCard size="lg" src={FALLBACK_IMG} alt="Hero" price={<RegularPrice value="-" />} onClick={() => {}} />
          <GameCard size="md" src={FALLBACK_IMG} alt="Hero" price={<RegularPrice value="-" />} onClick={() => {}} />
          <GameCard size="md" src={FALLBACK_IMG} alt="Hero" price={<RegularPrice value="-" />} onClick={() => {}} />
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <Arrow dir="left" onClick={() => setIdx((p) => (p + len - 1) % len)} />
      <div className="hero-cards">
        <GameCard size="lg"   src={cards[ordered[0]].src} alt="Hero 1" price={cards[ordered[0]].price} onClick={() => openGame(cards[ordered[0]].id)} />
        {cards[1] && <GameCard size="md"   src={cards[ordered[1]].src} alt="Hero 2" price={cards[ordered[1]].price} onClick={() => openGame(cards[ordered[1]].id)} />}
        {cards[2] && <GameCard size="md"   src={cards[ordered[2]].src} alt="Hero 3" price={cards[ordered[2]].price} onClick={() => openGame(cards[ordered[2]].id)} />}
      </div>
      <Arrow dir="right" onClick={() => setIdx((p) => (p + 1) % len)} />
      <div className="dots">
        {cards.map((_, i) => (
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
  const openGame = (slug) => navigate(`/store/game/${slug}`, { state: { slug, from: 'home-row' } });

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

const HorizontalBlockRow = ({ title, topArr, bottomArr, from }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const open = (slug) => navigate(`/store/game/${slug}`, { state: { slug, from } });

  const blocks = [];
  const maxBlocks = Math.ceil(Math.max((topArr.length || 0) / 4, (bottomArr.length || 0) / 3));
  for (let i = 0; i < maxBlocks; i++) {
    blocks.push({
      top: topArr.slice(i * 4, i * 4 + 4),
      bottom: bottomArr.slice(i * 3, i * 3 + 3),
    });
  }

  const totalPages = blocks.length;
  if (!totalPages) return null;

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

const splitTopBottom = (items) => {
  const topArr = [];
  const bottomArr = [];
  for (let i = 0; i < items.length; i += 7) {
    const pageSlice = items.slice(i, i + 7);
    topArr.push(...pageSlice.slice(0, 4));
    bottomArr.push(...pageSlice.slice(4, 7));
  }
  return { topArr, bottomArr };
};

const Home = () => {
  const { data } = useGetAllGamesQuery();
  const games = useMemo(() => normalizeGames(data), [data]);

  const heroItems = useMemo(() => {
    return [...games].sort((a, b) => discountOf(b) - discountOf(a)).slice(0, 3);
  }, [games]);

  const monthlyDiscountsItems = useMemo(() => {
    return [...games].filter((g) => discountOf(g) > 0).sort((a, b) => discountOf(b) - discountOf(a)).slice(0, 8).map(toCard);
  }, [games]);

  const newTrendingCards = useMemo(() => {
    const parseDate = (d) => (d ? new Date(d).getTime() : 0);
    return [...games]
      .sort((a, b) => (parseDate(b.releaseDate) - parseDate(a.releaseDate)) || String(b.id).localeCompare(String(a.id)))
      .slice(0, 28)
      .map(toCard);
  }, [games]);

  const recommendedCards = useMemo(() => {
    const score = (g) => (g.popularity || 0) * 2 + discountOf(g);
    return [...games].sort((a, b) => score(b) - score(a)).slice(0, 28).map(toCard);
  }, [games]);

  const bestsellersCards = useMemo(() => {
    return [...games].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 28).map(toCard);
  }, [games]);

  const nt = useMemo(() => splitTopBottom(newTrendingCards), [newTrendingCards]);
  const rec = useMemo(() => splitTopBottom(recommendedCards), [recommendedCards]);
  const best = useMemo(() => splitTopBottom(bestsellersCards), [bestsellersCards]);

  return (
    <div className="store-home">
      <main className="page-inset">
        <StoreRailWrapper />
        <Hero items={heroItems} />
        <section className="store-section">
          <SectionHeader title="Monthly discounts" to="/store/featured" />
          <ScrollRow items={monthlyDiscountsItems} size="xl" />
        </section>
        <HorizontalBlockRow title="New & Trending" topArr={nt.topArr} bottomArr={nt.bottomArr} from="new-trending" />
        <HorizontalBlockRow title="Recommended for you" topArr={rec.topArr} bottomArr={rec.bottomArr} from="recommended" />
        <HorizontalBlockRow title="Bestsellers" topArr={best.topArr} bottomArr={best.bottomArr} from="bestsellers" />
        <section className="loop-cta">
          <div className="cta-inner">
            <div className="cta-text">
              <h4>Find your perfect world through Discovery Loop</h4>
              <p>Your queue of top-selling, new, and recommended titles</p>
            </div>
            <Arrow dir="right" onClick={() => {window.scrollTo(0, 0); location.assign("/store/discover");}} className='arrow'/>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;