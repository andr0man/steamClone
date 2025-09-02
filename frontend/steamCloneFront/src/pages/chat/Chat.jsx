import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Chat.scss';

const ts = () => Date.now();
const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'account', label: 'Account' },
  { id: 'security', label: 'Security' },
  { id: 'store', label: 'Store' },
  { id: 'library', label: 'Library' },
  { id: 'market', label: 'Market' },
  { id: 'points', label: 'Points Shop' },
  { id: 'profile', label: 'Profile' },
  { id: 'payments', label: 'Payments' },
];

const QA_DB = [
  {
    id: 'reset-password',
    cat: 'account',
    title: 'Reset password',
    tags: ['forgot password', 'reset password', 'email link', 'login issue', 'не можу увійти', 'відновити доступ'],
    answer: [
      'Open the login window and click Forgot password?.',
      'Enter your account email and confirm.',
      'Check inbox and spam. Follow the link in the message.',
      'After reset — sign in with the new password.',
    ],
    links: [{ text: 'Open Login', href: '/login' }]
  },
  {
    id: 'change-email',
    cat: 'account',
    title: 'Change account email',
    tags: ['change email', 'update email', 'новий емейл', 'пошта'],
    answer: [
      'Go to Profile → Edit.',
      'Update your email in account details.',
      'Confirm via email link if requested.',
    ],
    links: [{ text: 'Edit Profile', href: '/profile/edit' }]
  },
  {
    id: 'enable-2fa',
    cat: 'security',
    title: 'Enable 2FA',
    tags: ['2fa', 'two-factor', 'authenticator', 'security'],
    answer: [
      'Open Profile → Edit → Security.',
      'Scan the QR code in your authenticator app.',
      'Enter the 6-digit code to confirm.',
    ],
  },
  {
    id: 'purchase-game',
    cat: 'store',
    title: 'How to purchase a game',
    tags: ['buy', 'purchase', 'купити', 'оплата', 'store'],
    answer: [
      'Open Store and find the game.',
      'Press Purchase, choose payment method.',
      'Complete the payment and wait for confirmation.',
      'The game appears in your Library.',
    ],
    links: [{ text: 'Open Store', href: '/store' }]
  },
  {
    id: 'refund',
    cat: 'payments',
    title: 'Refund policy',
    tags: ['refund', 'повернення', 'гроші', 'оплата'],
    answer: [
      'Refunds are eligible within 14 days of purchase and less than 2 hours of playtime.',
      'Open Purchase history and Request refund for the order.',
    ],
    links: [{ text: 'Purchase History', href: '/store/purchase' }]
  },
  {
    id: 'install-game',
    cat: 'library',
    title: 'Install a game',
    tags: ['install', 'download', 'встановити', 'library'],
    answer: [
      'Go to Library, pick the game.',
      'Press Install and choose the destination.',
      'Wait until download completes.',
    ],
    links: [{ text: 'Open Library', href: '/library' }]
  },
  {
    id: 'verify-files',
    cat: 'library',
    title: 'Verify game files',
    tags: ['verify', 'integrity', 'fix crash', 'помилки', 'файли'],
    answer: [
      'Open Library, right-click the game.',
      'Select Verify files.',
      'Wait for validation to complete.',
    ],
  },
  {
    id: 'sell-market',
    cat: 'market',
    title: 'Sell an item on Market',
    tags: ['market', 'sell', 'продати', 'ринок'],
    answer: [
      'Open Market → Inventory.',
      'Select an item and set a price.',
      'Confirm listing. The item goes public.',
    ],
    links: [{ text: 'Open Market', href: '/market' }]
  },
  {
    id: 'market-fee',
    cat: 'market',
    title: 'Market fee',
    tags: ['fee', 'комісія', 'market'],
    answer: ['A dynamic fee up to 10% is applied per sale and shown before confirming the listing.'],
  },
  {
    id: 'points-usage',
    cat: 'points',
    title: 'How Points Shop works',
    tags: ['points', 'loyalty', 'нагороди', 'магазин балів'],
    answer: [
      'Earn points by purchases and events.',
      'Spend them in Points Shop for cosmetics.',
      'Some items are seasonal and limited.',
    ],
    links: [{ text: 'Open Points Shop', href: '/store/points-shop' }]
  },
  {
    id: 'wishlist',
    cat: 'store',
    title: 'Wishlist and notifications',
    tags: ['wishlist', 'список бажаного', 'сповіщення', 'sale'],
    answer: [
      'On a game page press Add to wishlist.',
      'You will get notifications about discounts or releases.',
    ],
    links: [{ text: 'Open Wishlist', href: '/store/wishlist' }]
  },
  {
    id: 'edit-profile',
    cat: 'profile',
    title: 'Edit profile',
    tags: ['avatar', 'username', 'edit profile', 'профіль'],
    answer: ['Go to Profile → Edit. Update avatar, username, bio, social links, and save.'],
    links: [{ text: 'Profile', href: '/profile' }, { text: 'Edit', href: '/profile/edit' }]
  },
  {
    id: 'download-slow',
    cat: 'library',
    title: 'Slow download speed',
    tags: ['slow', 'download', 'network', 'повільно'],
    answer: [
      'Pause and resume the download.',
      'Check your router and close heavy apps.',
      'Try another CDN region in Settings.',
    ],
  },
  {
    id: 'suspicious-login',
    cat: 'security',
    title: 'Suspicious login alert',
    tags: ['suspicious', 'alert', 'security', 'hack', 'підозрілий'],
    answer: [
      'Immediately change your password.',
      'Revoke active sessions in Security.',
      'Enable 2FA.',
    ],
  },
  {
    id: 'collections',
    cat: 'library',
    title: 'Collections',
    tags: ['collection', 'group', 'organize', 'колекції'],
    answer: [
      'Open Library → Collections.',
      'Create a collection and add games by category or tag.',
    ],
    links: [{ text: 'Open Collections', href: '/library/collections' }]
  },
  {
    id: 'news',
    cat: 'store',
    title: 'Where to read news',
    tags: ['news', 'updates', 'blog', 'новини'],
    answer: ['Open Store → News to read updates, patch notes and events.'],
    links: [{ text: 'Open News', href: '/store/news' }]
  },
  {
    id: 'stats',
    cat: 'store',
    title: 'Store stats',
    tags: ['stats', 'charts', 'тренди', 'аналітика'],
    answer: ['Open Store → Stats to view live trends and top products.'],
    links: [{ text: 'Open Stats', href: '/store/stats' }]
  },
  {
    id: 'purchase-history',
    cat: 'payments',
    title: 'View purchase history',
    tags: ['history', 'orders', 'покупки', 'чеки'],
    answer: ['Go to Store → Purchase to review orders and receipts.'],
    links: [{ text: 'Open Purchase History', href: '/store/purchase' }]
  },
];

const QUICK_TIPS = [
  'Reset password',
  'Install a game',
  'Refund policy',
  'Sell on Market',
  'Enable 2FA',
  'Wishlist notifications',
];

const findBestAnswer = (text, cat = 'all') => {
  const q = (text || '').toLowerCase();
  let base = QA_DB;
  if (cat !== 'all') base = base.filter(x => x.cat === cat);
  let best = null;
  let bestScore = 0;
  for (const item of base) {
    let score = 0;
    if (q.includes(item.title.toLowerCase())) score += 3;
    for (const tag of item.tags) {
      if (q.includes(tag.toLowerCase())) score += 2;
    }
    const words = item.title.toLowerCase().split(/\s+/);
    for (const w of words) if (w && q.includes(w)) score += 0.5;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  if (!best && cat !== 'all') {
    return findBestAnswer(text, 'all');
  }
  return best;
};

const Chat = () => {
  const [category, setCategory] = useState('all');
  const [messages, setMessages] = useState(() => ([
    {
      id: 'hello',
      author: 'bot',
      kind: 'welcome',
      title: 'Flux Assistant',
      text: 'Hi! I can help with account, store, library, market and more. Choose a topic or ask a question.',
      ts: ts(),
    }
  ]));
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [ratingMap, setRatingMap] = useState({});
  const [showTicket, setShowTicket] = useState(false);
  const [ticket, setTicket] = useState({ email: '', subject: '', description: '' });
  const [query, setQuery] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const filteredQA = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = QA_DB;
    if (category !== 'all') items = items.filter(x => x.cat === category);
    if (q) items = items.filter(x => x.title.toLowerCase().includes(q) || x.tags.some(t => t.toLowerCase().includes(q)));
    return items.slice(0, 8);
  }, [query, category]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  const sendUser = (text) => {
    if (!text.trim()) return;
    const m = { id: `m-${ts()}`, author: 'me', kind: 'text', text, ts: ts() };
    setMessages(prev => [...prev, m]);
  };

  const sendBotAnswer = (item) => {
    const m = {
      id: `b-${ts()}`,
      author: 'bot',
      kind: 'answer',
      title: item.title,
      text: item.answer,
      links: item.links || [],
      cat: item.cat,
      ts: ts(),
    };
    setMessages(prev => [...prev, m]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendUser(text);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = '48px';
    setTyping(true);
    setTimeout(() => {
      const found = findBestAnswer(text, category);
      if (found) sendBotAnswer(found);
      else {
        const m = {
          id: `nf-${ts()}`,
          author: 'bot',
          kind: 'suggest',
          title: 'No exact match',
          text: 'I couldn’t find a precise answer. Try one of these topics or create a ticket.',
          suggestions: (category === 'all' ? QA_DB.slice(0, 5) : QA_DB.filter(x => x.cat === category).slice(0, 5)).map(x => ({ id: x.id, title: x.title })),
          ts: ts(),
        };
        setMessages(prev => [...prev, m]);
      }
      setTyping(false);
    }, 800);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onTextareaInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = '48px';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const handlePickSuggestion = (title) => {
    sendUser(title);
    setTyping(true);
    setTimeout(() => {
      const found = findBestAnswer(title, category);
      if (found) sendBotAnswer(found);
      setTyping(false);
    }, 500);
  };

  const handlePickQA = (id) => {
    const item = QA_DB.find(x => x.id === id);
    if (!item) return;
    sendUser(item.title);
    setTyping(true);
    setTimeout(() => {
      sendBotAnswer(item);
      setTyping(false);
    }, 500);
  };

  const rate = (id, val) => {
    setRatingMap(prev => ({ ...prev, [id]: val }));
  };

  const openTicket = () => setShowTicket(true);
  const submitTicket = () => {
    setShowTicket(false);
    setTicket({ email: '', subject: '', description: '' });
    const ticketId = Math.floor(100000 + Math.random() * 900000);
    const m = {
      id: `t-${ts()}`,
      author: 'bot',
      kind: 'ticket',
      title: 'Ticket created',
      text: [`Your ticket #${ticketId} has been created. We’ll contact you via email.`],
      ts: ts(),
    };
    setMessages(prev => [...prev, m]);
  };

  const quickChips = useMemo(() => {
    const base = category === 'all' ? QUICK_TIPS : QA_DB.filter(x => x.cat === category).slice(0, 6).map(x => x.title);
    return base.slice(0, 6);
  }, [category]);

  return (
    <div className="flux-chat-page">
      <div className="page-inset">
        <div className="chat-grid">
          <aside className="panel chat-side">
            <div className="side-head">
              <div className="side-title">Assistant</div>
              <span className="side-underline" />
            </div>

            <div className="side-search">
              <input
                type="text"
                placeholder="Search topics"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="button" aria-label="Search">
                <img src="https://c.animaapp.com/tF1DKM3X/img/fluent-search-sparkle-48-regular.svg" alt="" />
              </button>
            </div>

            <div className="side-cats">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className={`cat-pill ${category === c.id ? 'active' : ''}`}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="side-section">
              <div className="side-subtitle">Top questions</div>
              <div className="qa-list">
                {filteredQA.map(x => (
                  <button key={x.id} className="qa-row" onClick={() => handlePickQA(x.id)} title={x.title}>
                    <span className="qa-title">{x.title}</span>
                    <span className={`qa-cat ${x.cat}`}>{CATEGORIES.find(c => c.id === x.cat)?.label || x.cat}</span>
                  </button>
                ))}
                {!filteredQA.length && <div className="side-empty">No results</div>}
              </div>
            </div>

            <div className="side-actions">
              <button className="ticket-btn" onClick={openTicket}>Create ticket</button>
            </div>
          </aside>

          <section className="panel chat-main">
            <header className="chat-header">
              <div className="left">
                <div className="assistant-badge">
                  <span className="dot" />
                </div>
                <div className="who">
                  <div className="name">Flux Assistant</div>
                  <div className="status">online</div>
                </div>
              </div>
              <div className="right">
                <div className="mini-indicator">Secure • Instant answers • No wait</div>
              </div>
            </header>

            <div className="chat-thread" ref={listRef}>
              {messages.map(m => {
                if (m.author === 'me') {
                  return (
                    <div key={m.id} className="msg me">
                      <div className="bubble">
                        <div className="text">{m.text}</div>
                        <div className="meta"><span className="time">{fmtTime(m.ts)}</span></div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === 'welcome') {
                  return (
                    <div key={m.id} className="msg bot bot-welcome">
                      <div className="bubble">
                        <div className="title">{m.title}</div>
                        <div className="text">{m.text}</div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === 'suggest') {
                  return (
                    <div key={m.id} className="msg bot">
                      <div className="bubble">
                        <div className="title">{m.title}</div>
                        <div className="text">{m.text}</div>
                        <div className="sugg-grid">
                          {m.suggestions.map(s => (
                            <button key={s.id} className="sugg-chip" onClick={() => handlePickQA(s.id)}>{s.title}</button>
                          ))}
                          <button className="sugg-chip alt" onClick={openTicket}>Create ticket</button>
                        </div>
                        <div className="meta"><span className="time">{fmtTime(m.ts)}</span></div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === 'ticket') {
                  return (
                    <div key={m.id} className="msg bot">
                      <div className="bubble">
                        <div className="title">{m.title}</div>
                        {Array.isArray(m.text) ? m.text.map((p, i) => <div className="text" key={i}>{p}</div>) : <div className="text">{m.text}</div>}
                        <div className="meta"><span className="time">{fmtTime(m.ts)}</span></div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === 'answer') {
                  const r = ratingMap[m.id] || null;
                  return (
                    <div key={m.id} className="msg bot">
                      <div className="bubble">
                        <div className="title">{m.title}</div>
                        <ul className="steps">
                          {(m.text || []).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                        {!!(m.links && m.links.length) && (
                          <div className="links">
                            {m.links.map((lnk, i) => (
                              <a key={i} className="link" href={lnk.href} onClick={(e) => {
                                if (lnk.href?.startsWith('/')) return;
                                e.preventDefault();
                                window.open(lnk.href, '_blank', 'noopener,noreferrer');
                              }}>{lnk.text}</a>
                            ))}
                          </div>
                        )}
                        <div className="actions-row">
                          <span>Was this helpful?</span>
                          <button className={`rate ${r === 'up' ? 'active' : ''}`} onClick={() => rate(m.id, 'up')}>👍</button>
                          <button className={`rate ${r === 'down' ? 'active' : ''}`} onClick={() => rate(m.id, 'down')}>👎</button>
                        </div>
                        <div className="meta"><span className="time">{fmtTime(m.ts)}</span></div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {typing && (
                <div className="msg bot">
                  <div className="bubble typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
            </div>

            <footer className="composer">
              <div className="chips">
                {quickChips.map((c, i) => (
                  <button key={i} className="chip" onClick={() => handlePickSuggestion(c)}>{c}</button>
                ))}
              </div>
              <div className="composer-row">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={onTextareaInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about account, store, library, market..."
                  rows={2}
                />
                <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12l18-9-9 18-2-7-7-2z" stroke="#121218" strokeWidth="1.2" fill="#E0DDEB"/></svg>
                </button>
              </div>
            </footer>
          </section>
        </div>
      </div>

      {showTicket && (
        <div className="ticket-overlay" onClick={() => setShowTicket(false)}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowTicket(false)}>×</button>
            <h3>Create support ticket</h3>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={ticket.email}
                onChange={(e) => setTicket(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@email.com"
              />
            </div>
            <div className="field">
              <label>Subject</label>
              <input
                type="text"
                value={ticket.subject}
                onChange={(e) => setTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Short summary"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                rows={4}
                value={ticket.description}
                onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your issue..."
              />
            </div>
            <button
              className="submit"
              onClick={submitTicket}
              disabled={!ticket.email.trim() || !ticket.subject.trim() || !ticket.description.trim()}
            >
              Submit ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;