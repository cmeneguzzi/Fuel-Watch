'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { BASE_PRICES, BASE_NEWS, STATIC_DATA } from '@/lib/data';
import { NewsTicker, Countdown } from '@/components/Layout/Ticker';

// Lazy-import chart-heavy components (client only)
const PeriodChart      = dynamic(() => import('@/components/Dashboard/Charts').then(m => ({ default: m.PeriodChart })), { ssr: false });
const CompChart        = dynamic(() => import('@/components/Dashboard/Charts').then(m => ({ default: m.CompChart })),   { ssr: false });
const Modal            = dynamic(() => import('@/components/Dashboard/Modal'),  { ssr: false });
const MapView          = dynamic(() => import('@/components/Dashboard/MapView'), { ssr: false });
const PwaInstallBanner = dynamic(() => import('@/components/Layout/PwaInstall').then(m => ({ default: m.PwaInstallBanner })), { ssr: false });

const UPDATE_INTERVAL_MS = 4 * 60 * 60 * 1000;  // 4 h
const NEWS_INTERVAL_MS   = 2 * 60 * 60 * 1000;  // 2 h

export default function Home() {
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [prices,       setPrices]       = useState(BASE_PRICES);
  const [chartData,    setChartData]    = useState(STATIC_DATA);
  const [chartLabels,  setChartLabels]  = useState(null);   // null = usa labels estáticas
  const [periodo,      setPeriodo]      = useState(() => {
    const today = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
    return `01/fev/2026 a ${today}`;
  });
  const [news,         setNews]         = useState(BASE_NEWS);
  const [modalKey,     setModalKey]     = useState(null);
  const [updating,     setUpdating]     = useState(false);
  const [lastUpdate,   setLastUpdate]   = useState('06/04/2026 · 08:00');
  const [nextUpdateAt, setNextUpdateAt] = useState(() => Date.now() + UPDATE_INTERVAL_MS);

  // ── Fetch prices ──────────────────────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices', { cache: 'no-store' });
      if (!res.ok) return;
      const d = await res.json();
      setPrices({
        br:    d.br,
        ar:    d.ar,
        cl:    d.cl,
        brent: d.brent,
        brentNote: d.brentNote,
      });
      setChartData({
        d10_br:     d.d10_br,
        d10_ar:     d.d10_ar,
        d10_cl:     d.d10_cl,
        comp_brent: d.comp_brent,
        comp_br:    d.comp_br,
        comp_ar:    d.comp_ar,
        comp_cl:    d.comp_cl,
      });
      // Labels dinâmicas que vem da API
      if (d.labels && d.labels.length) setChartLabels(d.labels);
      if (d.periodo) setPeriodo(d.periodo);
      setLastUpdate(d.lastUpdate || new Date().toLocaleString('pt-BR'));
    } catch (err) {
      console.warn('fetchPrices falhou:', err.message);
    }
  }, []);

  // ── Fetch news ────────────────────────────────────────────────────────────
  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (!res.ok) return;
      const d = await res.json();
      setNews(d);
    } catch (err) {
      console.warn('fetchNews falhou:', err.message);
    }
  }, []);

  // ── Full update ───────────────────────────────────────────────────────────
  const triggerFullUpdate = useCallback(async () => {
    setUpdating(true);
    try {
      await Promise.all([fetchPrices(), fetchNews()]);
      setNextUpdateAt(Date.now() + UPDATE_INTERVAL_MS);
    } finally {
      setUpdating(false);
    }
  }, [fetchPrices, fetchNews]);

  // ── Auto-refresh timers ───────────────────────────────────────────────────
  useEffect(() => {
    // initial load
    const t0 = setTimeout(() => triggerFullUpdate(), 600);
    // periodic price refresh
    const t1 = setInterval(() => {
      fetchPrices();
      setNextUpdateAt(Date.now() + UPDATE_INTERVAL_MS);
    }, UPDATE_INTERVAL_MS);
    // periodic news refresh
    const t2 = setInterval(() => fetchNews(), NEWS_INTERVAL_MS);

    const handleKey = (e) => { if (e.key === 'Escape') setModalKey(null); };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t0);
      clearInterval(t1);
      clearInterval(t2);
      window.removeEventListener('keydown', handleKey);
    };
  }, [triggerFullUpdate, fetchPrices, fetchNews]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const brentVal = parseFloat(String(prices.brent?.cur || '100').replace(/[^0-9.]/g, '')) || 100;
  const brentPct = Math.min(brentVal / 150, 1);
  const arcOffset = (301.6 * (1 - brentPct * 0.7)).toFixed(1);

  return (
    <>
      {/* ── HEADER ── */}
      <header>
        <div className="hdr-left">
          <div className="logo">⛽</div>
          <div className="hdr-title">
            <h1>FUEL WATCH — SOUTH AMERICA</h1>
            <p>Combustíveis · Brasil · Argentina · Chile · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} · Período: {periodo}</p>
          </div>
        </div>
        <div className="hdr-right">
          <div className="badge badge-hint">👆 Clique nos cards para detalhes</div>
          <button
            id="btnUpdate"
            className="badge badge-update"
            onClick={triggerFullUpdate}
            disabled={updating}
            style={{ cursor: updating ? 'not-allowed' : 'pointer' }}
          >
            {updating ? '⏳ Atualizando...' : '🔄 Atualizar Agora'}
          </button>
          <div className="badge badge-live">AO VIVO</div>
        </div>
      </header>

      {/* ── PWA INSTALL BANNER ── */}
      <PwaInstallBanner />

      {/* ── TAB NAV ── */}
      <div className="tab-nav">
        <button className={`tab-btn${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={`tab-btn${activeTab === 'mapa' ? ' active' : ''}`}      onClick={() => setActiveTab('mapa')}>🗺 Mapa Regional de Preços</button>
      </div>

      {/* ── NEWS TICKER ── */}
      <NewsTicker ticker={news.ticker || ''} onRefresh={fetchNews} />

      {/* ══════ TAB: DASHBOARD ══════ */}
      {activeTab === 'dashboard' && (
        <div id="tab-dashboard" className="tab-page active">
          <main>

            {/* KPI CARDS */}
            <div className="kpi-grid">
              {[
                { key:'br',    flag:'🇧🇷', label:'Brasil · Diesel S10',      c:'var(--br)' },
                { key:'ar',    flag:'🇦🇷', label:'Argentina · Gasoil',        c:'var(--ar)' },
                { key:'cl',    flag:'🇨🇱', label:'Chile · Diésel',            c:'var(--cl)' },
                { key:'brent', flag:'🛢',  label:'Petróleo Brent',             c:'var(--oil)' },
              ].map(({ key, flag, label, c }) => {
                const p = prices[key] || {};
                const isUp = p.up !== false;
                return (
                  <div key={key} className="kcard" style={{ '--c': c }} onClick={() => setModalKey(key)} id={`kcard-${key}`}>
                    <span className="kyoy">↗ Detalhes</span>
                    <div className="kcountry">{flag} {label}</div>
                    <div className="kval" id={`kv-${key}`}>{p.cur || '—'}</div>
                    <div className="ksub"  id={`ks-${key}`}>{p.sub || ''}</div>
                    <div className={`kchange ${isUp ? 'chup' : 'chdn'}`} id={`kc-${key}`}>{isUp ? '▲' : '▼'} {p.change || ''}</div>
                    <div className="kyoy-val" id={`kyoy-${key}`}>{p.yoy || ''}</div>
                  </div>
                );
              })}
            </div>

            {/* CHART BR */}
            <div className="panel br s8 clickable" onClick={() => setModalKey('br')}>
              <div className="pl">Evolução período — {periodo} — clique para detalhes</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
                <div className="pt" style={{ marginBottom: 0 }}>🇧🇷 Diesel S10 Brasil (R$/L)</div>
                <span className="cpill">📊 Fev–Abr 2026</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <PeriodChart id="cBR" data={chartData.d10_br} color="#f5a623" unit="R$/L" sym="R$" height={195} labels={chartLabels} />
              </div>
            </div>

            {/* BRENT METER */}
            <div className="panel oil s4 clickable" style={{ display:'flex', flexDirection:'column', justifyContent:'center' }} onClick={() => setModalKey('brent')}>
              <div className="pl">Referência Global</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 6 }}>
                <div className="pt" style={{ marginBottom: 0 }}>🛢 Petróleo Brent</div>
                <span className="cpill">📊 YoY</span>
              </div>
              <div className="om">
                <div className="mr">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#1e2130" strokeWidth="10" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="url(#og)" strokeWidth="10"
                      strokeDasharray="301.6" strokeDashoffset={arcOffset}
                      strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }} />
                    <defs>
                      <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f5a623" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="mc">
                    <div className="mv">{Math.round(brentVal)}</div>
                    <div className="mu">USD/bbl</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', textAlign:'center', marginTop: 7 }}
                  dangerouslySetInnerHTML={{ __html: (prices.brentNote || '').replace(/\n/g, '<br>') }}
                />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginTop: 9 }}>
                {[['01/fev/26', prices.brent?.prev || '$72', 'var(--muted)'], ['Δ period', prices.brent?.delta || '+37%', '#ef4444']].map(([label, val, color]) => (
                  <div key={label} style={{ background:'#1a1d28', borderRadius: 8, padding: 8, textAlign:'center' }}>
                    <div style={{ fontSize: 9, color:'var(--muted)' }}>{label}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize: 14, fontWeight: 700, color }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHART AR */}
            <div className="panel ar s6 clickable" onClick={() => setModalKey('ar')}>
              <div className="pl">Evolução período</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
                <div className="pt" style={{ marginBottom: 0 }}>🇦🇷 Gasoil Argentina (ARS/L)</div>
                <span className="cpill">📊 YoY</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <PeriodChart id="cAR" data={chartData.d10_ar} color="#4fc3f7" unit="ARS/L" sym="ARS$" height={165} labels={chartLabels} />
              </div>
            </div>

            {/* CHART CL */}
            <div className="panel cl s6 clickable" onClick={() => setModalKey('cl')}>
              <div className="pl">Evolução período</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
                <div className="pt" style={{ marginBottom: 0 }}>🇨🇱 Diésel Chile (CLP/L)</div>
                <span className="cpill">📊 YoY</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <PeriodChart id="cCL" data={chartData.d10_cl} color="#e84393" unit="CLP/L" sym="CLP$" height={165} labels={chartLabels} />
              </div>
            </div>

            {/* DEPENDÊNCIA */}
            <div className="panel neu s4a">
              <div className="pl">Análise Estrutural</div>
              <div className="pt">⛽ Dependência Importada</div>
              {[
                { flag:'🇧🇷 BR', width:'26%', grad:'linear-gradient(90deg,var(--br),#f97316)', pct:'26%', pctColor:'var(--br)', note:'Exportador de cru, importa diesel refinado' },
                { flag:'🇦🇷 AR', width:'35%', grad:'linear-gradient(90deg,var(--ar),#0284c7)', pct:'35%', pctColor:'var(--ar)', note:'Vaca Muerta reduz dependência gradualmente' },
                { flag:'🇨🇱 CL', width:'99%', grad:'linear-gradient(90deg,var(--cl),#a855f7)', pct:'99%', pctColor:'var(--cl)', note:'Máxima vulnerabilidade geopolítica' },
              ].map(({ flag, width, grad, pct, pctColor, note }) => (
                <div key={flag}>
                  <div className="dep-row">
                    <div className="dep-l">{flag}</div>
                    <div className="dep-bg"><div className="dep-f" style={{ background: grad, width, color: pct === '99%' ? '#fff' : '#000', fontSize: 9 }}>{pct === '99%' ? 'total' : ''}</div></div>
                    <div className="dep-pct" style={{ color: pctColor }}>{pct}</div>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', margin: '-7px 0 9px 80px' }}>{note}</div>
                </div>
              ))}
              <div style={{ marginTop: 9, padding: 9, background: '#1a1d28', borderRadius: 8, fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
                🇨🇱 Chile absorveu choque integral (+$580/L). 🇧🇷 YPF e PF investigam margens. 🇦🇷 YPF congela preços 45 dias.
              </div>
            </div>

            {/* CAUSAS */}
            <div className="panel oil s4a">
              <div className="pl">Diagnóstico · {periodo}</div>
              <div className="pt">🔍 Causas do Aumento</div>
              {[
                { n: 1, title: 'Guerra EUA-Israel-Irã (28/fev/26)', body: 'Ormuz parcialmente bloqueado: +60% no Brent em março — maior ganho mensal desde 1988. Brent pico $119,50.' },
                { n: 2, title: 'Reajuste Petrobras (mar/26)', body: 'Diesel S10: R$6,09→R$7,57 (+24,3% em 30 dias). Máximo desde ago/2022. SP chega a R$9,99/L.' },
                { n: 3, title: 'ICMS + tributos BR (jan/26)', body: 'R$1,12→R$1,17/L (+4,4%). Abicom aponta defasagem ainda em 64% — risco de novo reajuste.' },
                { n: 4, title: 'Chile: maior alta em 36 anos (26/mar)', body: 'Diesel +$580,3/L. MEPCO ajustado: CLP$975→$1.512. FEPP esgotou US$1.600M em 1 trimestre.' },
                { n: 5, title: 'Argentina: YPF congela 45 dias (abr/26)', body: 'Gasoil cruzou ARS$2.000 CABA. YPF absorve variação do Brent até maio. Outros seguem subindo.' },
              ].map(({ n, title, body }) => (
                <div key={n} className="ci">
                  <div className="cn">{n}</div>
                  <div className="ct"><strong>{title}</strong><br />{body}</div>
                </div>
              ))}
            </div>

            {/* PROJEÇÃO */}
            <div className="panel neu s4a">
              <div className="pl">Inteligência de Mercado · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
              <div className="pt">📊 Projeção Próximos Meses</div>
              <table className="ptbl">
                <thead><tr><th>Mês</th><th>Brent</th><th>BR Diesel</th><th>Cenário</th></tr></thead>
                <tbody>
                  {(() => {
                    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                    const tags   = ['VOLÁTIL','ALÍVIO','NORM.','NORM.'];
                    const styles = [{cls:'tb',c:'#ef4444'},{cls:'tm',c:'#fbbf24'},{cls:'tg',c:'#4ade80'},{cls:'tg',c:'#4ade80'}];
                    const brentRanges = ['$90–110','$75–95','$65–80','$60–75'];
                    const brRanges    = ['R$7,20–7,80','R$6,60–7,20','R$6,10–6,70','R$5,90–6,40'];
                    const now = new Date();
                    return Array.from({ length: 4 }, (_, i) => {
                      const d   = new Date(now.getFullYear(), now.getMonth() + i, 1);
                      const mes = `${months[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
                      const { cls, c } = styles[i];
                      return (
                        <tr key={mes}>
                          <td>{mes}</td>
                          <td style={{ color: c }}>{brentRanges[i]}</td>
                          <td style={{ color: c }}>{brRanges[i]}</td>
                          <td><span className={`stag ${cls}`}>{tags[i]}</span></td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
              <div style={{ marginTop: 9, fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                ⚡ <span style={{ color:'#f87171' }}>Bull:</span> Acordo EUA-Irã falha → Brent $120+<br />
                📉 <span style={{ color:'#4ade80' }}>Bear:</span> Acordo em 2–3 sem. → Brent $65–75<br />
                🔄 <span style={{ color:'#fbbf24' }}>YPF:</span> congelamento 45d → pressão em mai/26
              </div>
            </div>

            {/* COMPARATIVO */}
            <div className="panel neu s12 clickable" style={{ '--ac':'var(--muted)' }} onClick={() => setModalKey('comp')}>
              <div className="pl">Comparativo Regional — clique para análise — {periodo}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
                <div className="pt" style={{ marginBottom: 0 }}>🌎 Variação % — Diesel/Gasoil nos 3 Países vs Brent ({periodo})</div>
                <span className="cpill">📊 Comparar</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <CompChart data={chartData} labels={chartLabels} />
              </div>
            </div>

            {/* NEWS PANEL */}
            <div className="panel neu news-panel">
              <div className="pl">Inteligência de Mercado — Atualizado {lastUpdate}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
                <div className="pt" style={{ marginBottom: 0 }}>📰 Notícias &amp; Alertas de Combustíveis</div>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color:'var(--muted)' }}>{news.timestamp || ''}</span>
                  <button onClick={fetchNews} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', color:'var(--muted)', padding:'4px 11px', borderRadius: 8, cursor:'pointer', fontSize: 10, fontFamily:"'DM Mono',monospace" }}>
                    ↻ Buscar
                  </button>
                </div>
              </div>
              <div className="news-grid">
                {(news.news || []).map((n, i) => (
                  <a
                    key={i}
                    href={n.url || 'https://www.eia.gov/petroleum/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card"
                    style={{ '--nc': n.color, textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                    title={`Abrir: ${n.src}`}
                  >
                    <div className="news-time">
                      <span className="news-dot" />{n.time}
                      <span style={{ marginLeft:'auto', fontSize: 9, color:'var(--muted)', opacity: 0.7 }}>↗ ver mais</span>
                    </div>
                    <span className="news-tag">{n.tag}</span>
                    <div className="news-headline">{n.h}</div>
                    <div style={{ fontSize: 11, color:'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{n.t}</div>
                    <div className="news-src">{n.src}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* UPDATE BAR */}
            <div className="update-bar">
              <div className="sources">
                <span>Fontes:</span>
                {['ANP/Brasil', 'ENAP/Chile', 'Infobae/Argentina', 'TradingEconomics', 'EIA/API'].map(s => (
                  <span key={s} className="src-tag">{s}</span>
                ))}
                <span className="src-tag">Período: {periodo}</span>
              </div>
              <div className="next-update">
                <span>Próxima atualização em:</span>
                <Countdown nextUpdateAt={nextUpdateAt} />
                <span style={{ color:'var(--muted)' }}>Atualizado {lastUpdate}</span>
              </div>
            </div>

          </main>
        </div>
      )}

      {/* ══════ TAB: MAPA ══════ */}
      {activeTab === 'mapa' && (
        <div id="tab-mapa" className="tab-page active">
          <MapView />
        </div>
      )}

      {/* MODAL */}
      {modalKey && <Modal modalKey={modalKey} onClose={() => setModalKey(null)} />}

      {/* FOOTER */}
      <footer>
        <span>Fuel Watch v4.0 · Dados: ANP · ENAP · Infobae · TradingEconomics · Reuters · EIA — Período {periodo}</span>
        <span>Atualizado: {lastUpdate}</span>
      </footer>
    </>
  );
}
