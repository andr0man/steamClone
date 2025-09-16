import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest', color: '#7C72DB' },
  { value: 'date_asc', label: 'Oldest', color: '#6A6391' },
  { value: 'price_desc', label: 'Price: High to Low', color: '#3DFFB3' },
  { value: 'price_asc', label: 'Price: Low to High', color: '#A178EB' },
  { value: 'name_asc', label: 'Name: A - Z', color: '#74BFF7' },
  { value: 'name_desc', label: 'Name: Z - A', color: '#FF9584' },
  { value: 'rarity_desc', label: 'Rarity', color: '#FFB84D' },
];

const SortDropdown = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = useMemo(() => SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0], [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className={`sort-dd ${className}`} ref={ref}>
      <button
        type="button"
        className={`sort-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Sort items"
      >
        <span className="dot" style={{ backgroundColor: current.color }} />
        <span className="label">{current.label}</span>
        <ChevronDown size={16} className="chev" />
      </button>

      {open && (
        <ul className="sort-menu" role="listbox" aria-label="Sort options">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                className={`opt ${value === opt.value ? 'active' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                title={opt.label}
              >
                <span className="dot" style={{ backgroundColor: opt.color }} />
                <span className="label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;