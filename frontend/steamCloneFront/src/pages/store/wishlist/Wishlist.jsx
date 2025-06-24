import React, { useState, useEffect, useCallback } from 'react';
import './wishlist.scss';
import Notification from '../../../components/Notification';
import { Heart, ShoppingCart, X, Tag, Percent, ArrowDownUp, Filter, AlertTriangle } from 'lucide-react';

const API_BASE_URL = ''; 

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [sortBy, setSortBy] = useState('date_added');
  const [filterOnSale, setFilterOnSale] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const queryParams = new URLSearchParams({ sortBy, onSale: filterOnSale });
      const response = await fetch(`${API_BASE_URL}/api/wishlist?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWishlistItems(data.items || []);

    } catch (err) {
      console.error('Error loading wishlist:', err);
      setApiError(err.message || 'Failed to load your wishlist.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, filterOnSale]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = (itemId) => {
    console.log(`(API CALL) Removing item ${itemId} from wishlist`);
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (itemId) => {
    console.log(`(API CALL) Adding item ${itemId} to cart`);
  };

  const renderWishlistItem = (game) => (
    <div key={game.id || game._id} className="wishlist-item-row">
      <img src={game.imageUrl || 'https://via.placeholder.com/200x112/1e252e/c7d5e0?text=Game'} alt={game.title} className="wishlist-item-image" />
      <div className="wishlist-item-info">
        <h4 className="wishlist-item-title">{game.title || 'Untitled Game'}</h4>
        <div className="wishlist-item-tags">
          {(game.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="game-tag"><Tag size={12}/> {tag}</span>
          ))}
        </div>
      </div>
      <div className="wishlist-item-price">
        {game.discountPrice ? (
          <>
            <span className="game-price-badge">
              <Percent size={14}/> {Math.round(((game.price - game.discountPrice) / game.price) * 100)}%
            </span>
            <div className="price-wrapper">
              <span className="game-price-original">${game.price.toFixed(2)}</span>
              <span className="game-price-discounted">${game.discountPrice.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <span className="game-price-current">${(game.price || 0).toFixed(2)}</span>
        )}
      </div>
      <div className="wishlist-item-actions">
        <button className="action-btn add-to-cart" onClick={() => handleAddToCart(game.id)}>
          <ShoppingCart size={18} /> Add to Cart
        </button>
        <button className="action-btn remove" title="Remove from Wishlist" onClick={() => handleRemoveFromWishlist(game.id)}>
          <X size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="wishlist-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
      
      <header className="wishlist-header">
        <div className="header-icon-wrapper">
          <Heart size={48} />
        </div>
        <h1>My Wishlist</h1>
        {!loading && <p>You have {wishlistItems.length} items on your wishlist.</p>}
      </header>

      <main className="wishlist-main-content">
        <div className="wishlist-controls">
          <div className="control-group">
            <label htmlFor="sort-by"><ArrowDownUp size={16} /> Sort by:</label>
            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="custom-select">
              <option value="date_added">Date Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="filter-sale"><Filter size={16} /> Filter:</label>
            <div className="toggle-switch">
              <input type="checkbox" id="filter-sale" checked={filterOnSale} onChange={(e) => setFilterOnSale(e.target.checked)} />
              <label htmlFor="filter-sale">On Sale</label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="wishlist-loading"><div className="spinner"></div>Loading your wishlist...</div>
        ) : wishlistItems.length > 0 ? (
          <div className="wishlist-items-container">
            {wishlistItems.map(renderWishlistItem)}
          </div>
        ) : (
          <div className="wishlist-empty">
            <Heart size={64} />
            <h2>Your Wishlist is Empty</h2>
            <p>Games you add to your wishlist will appear here. Start exploring the store!</p>
            <button className="browse-games-btn" onClick={() => {/* navigate to store */}}>Browse Games</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;