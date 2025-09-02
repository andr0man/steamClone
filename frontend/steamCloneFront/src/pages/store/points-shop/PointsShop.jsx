import React, { useState, useEffect, useCallback } from 'react';
import './points-shop.scss';
import Notification from '../../../components/Notification';
import { Coins, Image, Smile, UserCircle, Award, AlertTriangle } from 'lucide-react';

const API_BASE_URL = '';

const initialPointsShopState = {
  userPoints: 0,
  items: [],
};

const PointsShop = () => {
  const [shopData, setShopData] = useState(initialPointsShopState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: <Award size={18}/> },
    { id: 'backgrounds', name: 'Profile Backgrounds', icon: <Image size={18}/> },
    { id: 'avatars', name: 'Avatars', icon: <UserCircle size={18}/> },
    { id: 'emoticons', name: 'Emoticons', icon: <Smile size={18}/> },
  ];

  const fetchPointsShopData = useCallback(async (category) => {
    setLoading(true);
    setApiError(null);
    try {
      const endpoint = category === 'all' ? '/api/points-shop' : `/api/points-shop?category=${category}`;
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to load points shop data.');
      }
      const data = await response.json();
      setShopData({
        userPoints: data.userPoints || 0,
        items: data.items || [],
      });
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointsShopData(activeCategory);
  }, [activeCategory, fetchPointsShopData]);
  
  const handlePurchase = (itemId, price) => {
    if (shopData.userPoints < price) {
      setApiError("Not enough points to purchase this item.");
      return;
    }
    console.log(`(API CALL) Purchasing item ${itemId} for ${price} points.`);
    setShopData(prev => ({...prev, userPoints: prev.userPoints - price}));
  };

  const renderItemCard = (item) => (
    <div key={item.id} className="ps-item-card">
      <div className="ps-item-preview" style={{ backgroundImage: `url(${item.previewUrl})` }}>
        <span className="ps-item-game-source">{item.gameName}</span>
      </div>
      <div className="ps-item-info">
        <h4 className="ps-item-name">{item.name}</h4>
        <div className="ps-item-footer">
          <div className="ps-item-price">
            <Coins size={16} />
            <span>{item.price.toLocaleString()}</span>
          </div>
          <button 
            className="ps-buy-button" 
            onClick={() => handlePurchase(item.id, item.price)}
            disabled={shopData.userPoints < item.price}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="points-shop-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

      <header className="ps-header">
        <div className="ps-header-content">
          <h1>Points Shop</h1>
          <p>Spend your points on items to customize your profile.</p>
        </div>
        <div className="ps-user-points">
          <span>Your Balance</span>
          <div className="points-value">
            <Coins size={24} /> {shopData.userPoints.toLocaleString()}
          </div>
        </div>
      </header>

      <main className="ps-main-content">
        <div className="tabs-navigation">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`tab-button ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="ps-loading"><div className="spinner"></div></div>
        ) : shopData.items.length > 0 ? (
          <div className="ps-item-grid">
            {shopData.items.map(renderItemCard)}
          </div>
        ) : (
          <div className="no-results">
            <AlertTriangle size={48} />
            <p>{apiError ? "Error loading items." : `No items found in this category.`}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PointsShop;