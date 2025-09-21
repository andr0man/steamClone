import React, { useState, useEffect, useCallback } from 'react';
import './stats.scss';
import Notification from '../../../components/Notification';
import { TrendingUp, Users, DollarSign, BarChartHorizontal, AlertTriangle } from 'lucide-react';

const API_BASE_URL = '';

const initialStatsState = {
  topSellers: [],
  mostPlayed: [],
};

const Stats = () => {
  const [statsData, setStatsData] = useState(initialStatsState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [activeTab, setActiveTab] = useState('top_sellers');

  const fetchStatsData = useCallback(async (chartType) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats?chart=${chartType}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      setStatsData(prevData => ({
        ...prevData,
        [chartType === 'top_sellers' ? 'topSellers' : 'mostPlayed']: data.chart || [],
      }));

    } catch (err) {
      console.error(`Error loading stats for ${chartType}:`, err);
      setApiError(err.message || 'Failed to load stats data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatsData(activeTab);
  }, [activeTab, fetchStatsData]);

  const renderStatRow = (game, index) => (
    <li key={game.id || game._id} className="stat-row">
      <div className="stat-rank">{index + 1}</div>
      <div className="stat-game-image-container">
        <img src={game.imageUrl || 'https://via.placeholder.com/120x68/1e252e/c7d5e0?text=Game'} alt={game.title} />
      </div>
      <div className="stat-game-info">
        <h4 className="stat-game-title">{game.title || 'Unknown Game'}</h4>
        <p className="stat-game-developer">{game.developer || 'Unknown Developer'}</p>
      </div>
      <div className="stat-values">
        {activeTab === 'top_sellers' ? (
          <span className="stat-primary-value">${(game.revenue || 0).toLocaleString()}</span>
        ) : (
          <span className="stat-primary-value">{(game.currentPlayers || 0).toLocaleString()}</span>
        )}
        <span className="stat-secondary-value">
          {activeTab === 'most_played' && `Peak Today: ${(game.peakToday || 0).toLocaleString()}`}
        </span>
      </div>
    </li>
  );
  
  const currentChartData = activeTab === 'top_sellers' ? statsData.topSellers : statsData.mostPlayed;

  return (
    <div className="stats-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
      
      <header className="stats-header">
        <div className="header-icon-wrapper">
          <BarChartHorizontal size={48} />
        </div>
        <h1>Flux Platform Stats</h1>
        <p>Live data on the most popular and best-selling games on Flux.</p>
      </header>

      <main className="stats-main-content">
        <div className="tabs-navigation">
          <button
            className={`tab-button ${activeTab === 'top_sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('top_sellers')}
          >
            <DollarSign size={18} /> Top Sellers
          </button>
          <button
            className={`tab-button ${activeTab === 'most_played' ? 'active' : ''}`}
            onClick={() => setActiveTab('most_played')}
          >
            <Users size={18} /> Most Played
          </button>
        </div>

        {loading ? (
          <div className="stats-loading">
            <div className="spinner"></div>Loading chart data...
          </div>
        ) : currentChartData && currentChartData.length > 0 ? (
          <div className="stats-chart-container">
            <ol className="stats-list">
              {currentChartData.map(renderStatRow)}
            </ol>
          </div>
        ) : (
          <div className="no-results">
            <AlertTriangle size={48} />
            <p>{apiError ? "Error loading chart data." : "No data available for this chart."}</p>
            {apiError && <p className="error-details">{apiError}</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default Stats;