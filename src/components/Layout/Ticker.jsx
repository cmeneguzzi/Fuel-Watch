'use client';
import { useEffect, useRef, useState } from 'react';

export function NewsTicker({ ticker, onRefresh }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="news-banner">
      <div className="news-label">📡 ÚLTIMAS</div>
      <div className="news-track" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <span className={`news-scroll${paused ? ' paused' : ''}`}>{ticker}</span>
      </div>
      <button className="news-refresh" onClick={onRefresh} title="Atualizar notícias">↻</button>
    </div>
  );
}

export function Countdown({ nextUpdateAt }) {
  const [display, setDisplay] = useState('--:--:--');
  useEffect(() => {
    const id = setInterval(() => {
      const rem = nextUpdateAt - Date.now();
      if (rem <= 0) { setDisplay('00:00'); return; }
      const h = Math.floor(rem / 3600000);
      const m = Math.floor((rem % 3600000) / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setDisplay(
        h > 0
          ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
          : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      );
    }, 1000);
    return () => clearInterval(id);
  }, [nextUpdateAt]);
  return <span className="countdown">{display}</span>;
}
