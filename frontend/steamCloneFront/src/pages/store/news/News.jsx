import React, { useState, useEffect, useCallback } from 'react';
import './news.scss';
import Notification from '../../../components/Notification';
import { Rss, Calendar, Tag, AlertTriangle } from 'lucide-react';

const API_BASE_URL = '';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      if (!response.ok) {
        throw new Error('Failed to load news articles.');
      }
      const data = await response.json();
      setNews(data.articles || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setApiError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  const featuredArticle = news.length > 0 ? news[0] : null;
  const otherArticles = news.length > 1 ? news.slice(1) : [];

  const renderArticleCard = (article, isFeatured = false) => (
    <div key={article.id} className={`news-card ${isFeatured ? 'featured' : ''}`}>
      <div className="news-card-image" style={{ backgroundImage: `url(${article.imageUrl})` }}></div>
      <div className="news-card-content">
        <div className="news-card-meta">
          <span className="news-card-category"><Tag size={14}/> {article.category}</span>
          <span className="news-card-date"><Calendar size={14}/> {new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-summary">{article.summary}</p>
        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );

  return (
    <div className="news-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

      <header className="news-header">
        <div className="header-icon-wrapper">
          <Rss size={48} />
        </div>
        <h1>Flux News Hub</h1>
        <p>Your source for the latest updates, announcements, and events.</p>
      </header>
      
      {loading ? (
        <div className="news-loading"><div className="spinner"></div></div>
      ) : news.length > 0 ? (
        <main className="news-content-grid">
          {featuredArticle && renderArticleCard(featuredArticle, true)}
          {otherArticles.map(article => renderArticleCard(article, false))}
        </main>
      ) : (
        <div className="no-results">
            <AlertTriangle size={48} />
            <p>{apiError ? "Error loading news." : `There are no news articles at the moment.`}</p>
        </div>
      )}
    </div>
  );
};

export default News;