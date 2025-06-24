import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './market.scss';
import Notification from '../../components/Notification';
import { Search, Tag, DollarSign, ChevronDown, ShoppingCart, Filter, ListChecks, ArrowDownUp, ServerCrash } from 'lucide-react';

const API_BASE_URL = ''; 

const initialMarketDataState = {
  items: [],
  uniqueGames: ['All Games'],
};

const Market = () => {
  const [marketData, setMarketData] = useState(initialMarketDataState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState('All Games');
  const [sortBy, setSortBy] = useState('price_asc');

  const { items, uniqueGames } = marketData;

  const fetchMarketItems = useCallback(async (currentSearchTerm, currentGameFilter, currentSortBy) => {
    setLoading(true);
    setApiError(null);
    setMarketData(prev => ({ ...prev, items: [] })); // Очищаємо перед новим запитом

    try {
      let queryParams = `?search=${encodeURIComponent(currentSearchTerm)}`;
      if (currentGameFilter !== 'All Games') {
        queryParams += `&game=${encodeURIComponent(currentGameFilter)}`;
      }
      queryParams += `&sort=${currentSortBy}`;
      
      // const token = localStorage.getItem('authToken'); // Приклад отримання токена
      // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      // const response = await fetch(`${API_BASE_URL}/api/market/items${queryParams}`, { headers });
      
      // Тимчасовий fetch до неіснуючого ендпоінту для демонстрації обробки помилок
      // потім замінити на реальний
      const response = await fetch(`${API_BASE_URL}/api/market/items_nonexistent_endpoint${queryParams}`);


      if (!response.ok) {
        let errorMessage = `Failed to load market items. Status: ${response.status}`;
         if (response.status === 401 || response.status === 403) {
          errorMessage = 'Access Denied. Please log in to view the market or this section.';
        } else if (response.status === 404) {
          errorMessage = 'Market data not found. The endpoint might be incorrect.';
        } else {
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) { /* Залишити errorMessage як є */ }
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setMarketData({
        items: data.items || [],
        uniqueGames: ['All Games', ...new Set(data.availableGameFilters || [])] 
      });

    } catch (err) {
      console.error("Error fetching market items:", err);
      let userFriendlyError = 'Could not load market items. ';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('TypeError: Failed to fetch')) {
        userFriendlyError += 'Please check your internet connection and ensure the server is reachable.';
      } else {
        userFriendlyError = err.message;
      }
      setApiError(userFriendlyError);
      setMarketData(initialMarketDataState); // Скидаємо до початкового стану з порожніми items
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchMarketItems(searchTerm, selectedGameFilter, sortBy);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, selectedGameFilter, sortBy, fetchMarketItems]);

  if (loading && items.length === 0 && !apiError) {
    return <div className="market-initial-loading"><div className="spinner-large"></div>Loading Community Market...</div>;
  }

  return (
    <div className="market-page-container">
      <Notification message={apiError && items.length === 0 ? apiError : null} type="error" onClose={() => setApiError(null)} />
      
      <header className="market-main-header">
        <h1>Community Market</h1>
        <p>Trade, buy, and sell unique in-game items with the Flux community.</p>
      </header>

      <div className="market-controls-panel">
        <div className="market-search-field">
          <Search className="search-icon" size={22} />
          <input
            type="text"
            placeholder="Search items by name or game..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="market-filter-sort-group">
          <div className="custom-select-container">
            <ListChecks size={18} className="select-prefix-icon" />
            <select 
              className="styled-select game-filter-select" 
              value={selectedGameFilter} 
              onChange={(e) => setSelectedGameFilter(e.target.value)}
              title="Filter by game"
              disabled={uniqueGames.length <= 1 && loading}
            >
              {uniqueGames.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
            <ChevronDown size={18} className="select-suffix-icon"/>
          </div>
          <div className="custom-select-container">
            <ArrowDownUp size={18} className="select-prefix-icon" />
            <select 
              className="styled-select sort-by-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort items"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A - Z</option>
              <option value="name_desc">Name: Z - A</option>
            </select>
            <ChevronDown size={18} className="select-suffix-icon"/>
          </div>
        </div>
      </div>

      {loading && items.length > 0 ? (
         <div className="market-inline-loader"><div className="spinner-small"></div>Filtering items...</div>
      ) : null}


      {!loading && apiError && items.length === 0 ? (
         <div className="market-empty-results api-error-display">
            <ServerCrash size={72} className="empty-icon"/>
            <h2>Connection Problem</h2>
            <p>{apiError}</p>
            <button onClick={() => fetchMarketItems(searchTerm, selectedGameFilter, sortBy)} className="action-button retry-button">
                Try Again
            </button>
         </div>
      ) : !loading && !apiError && items.length === 0 ? (
        <div className="market-empty-results">
          <Search size={72} className="empty-icon"/>
          <h2>No Items Found</h2>
          <p>Try adjusting your search or filter settings. The market might also be empty for your current selection.</p>
        </div>
      ) : !loading && !apiError && items.length > 0 ? (
        <div className="market-items-grid-container">
          {items.map(item => (
            <div key={item.id} className={`market-item-card ${!item.available ? 'unavailable' : ''}`}>
              <div className="item-image-section">
                <img src={item.imageUrl || 'https://via.placeholder.com/300x225/1c232c/657382?Text=No+Image'} alt={item.name} className="item-image" />
                {item.rarity && 
                  <span className={`item-rarity-tag rarity--${item.rarity.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.rarity}
                  </span>
                }
                 {!item.available && <div className="item-unavailable-overlay">Sold</div>}
              </div>
              <div className="item-details-section">
                <h3 className="item-name" title={item.name}>{item.name || 'Unnamed Item'}</h3>
                <p className="item-game-info">
                  <Tag size={15} /> 
                  <span>{item.game || 'N/A'}</span>
                  {item.condition && <span className="item-condition-chip">{item.condition}</span>}
                </p>
              </div>
              <div className="item-purchase-section">
                <div className="item-price-display">${(item.price || 0).toFixed(2)}</div>
                <button className="buy-button" disabled={!item.available}>
                  <ShoppingCart size={18}/> 
                  <span>{item.available ? 'Buy Now' : 'Sold'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Market;
