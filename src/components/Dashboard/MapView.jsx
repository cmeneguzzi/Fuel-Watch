'use client';
import { useState } from 'react';
import { MAP_DATA } from '@/lib/data';

const COUNTRY_COLORS = { BR: '#f5a623', AR: '#4fc3f7', CL: '#e84393' };

function priceToColor(price, min, max) {
  const t = Math.min(Math.max((price - min) / (max - min), 0), 1);
  const r = Math.round(t < 0.5 ? (t * 2 * (255 - 34) + 34) : 255);
  const g = Math.round(t < 0.5 ? (197 - t * 2 * (197 - 158)) : Math.round(158 - (t - 0.5) * 2 * 158));
  const b = Math.round(t < 0.5 ? 94 - t * 2 * 94 : 0);
  return `rgb(${r},${g},${b})`;
}

function formatPrice(price, country) {
  if (country === 'BR') return `R$ ${price.toFixed(2).replace('.', ',')}`;
  if (country === 'AR') return `ARS$ ${price.toLocaleString('es-AR')}`;
  if (country === 'CL') return `CLP$ ${price.toLocaleString('es-CL')}`;
  return price;
}

function BrSvg({ data, onRegionClick, onRegionHover, selectedRegion }) {
  const prices = data.regions.map(r => r.price);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const color = (id) => priceToColor(data.regions.find(r => r.id === id)?.price || minP, minP, maxP);
  const pathClass = (id) => `region-path${selectedRegion === id ? ' selected' : ''}`;

  return (
    <svg viewBox="0 0 400 310" className="svg-map">
      <g>
        <path className={pathClass('norte')}         data-region="norte"        fill={color('norte')}        d="M80,20 L200,20 L220,60 L210,100 L180,120 L150,115 L120,125 L90,110 L70,80 Z" onClick={() => onRegionClick('norte')} onMouseEnter={() => onRegionHover('norte')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('nordeste')}      data-region="nordeste"     fill={color('nordeste')}     d="M200,20 L310,30 L330,70 L310,110 L280,130 L250,125 L220,110 L210,100 L220,60 Z" onClick={() => onRegionClick('nordeste')} onMouseEnter={() => onRegionHover('nordeste')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('centro-oeste')}  data-region="centro-oeste" fill={color('centro-oeste')} d="M90,110 L120,125 L150,115 L180,120 L210,100 L220,110 L230,150 L220,190 L200,210 L170,220 L140,210 L110,195 L90,170 L80,140 Z" onClick={() => onRegionClick('centro-oeste')} onMouseEnter={() => onRegionHover('centro-oeste')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('sudeste')}       data-region="sudeste"      fill={color('sudeste')}      d="M220,110 L250,125 L280,130 L300,150 L290,180 L270,200 L250,210 L230,200 L220,190 L230,150 Z" onClick={() => onRegionClick('sudeste')} onMouseEnter={() => onRegionHover('sudeste')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('sul')}           data-region="sul"          fill={color('sul')}          d="M170,220 L200,210 L220,190 L230,200 L250,210 L260,240 L240,270 L210,280 L180,270 L160,250 L155,230 Z" onClick={() => onRegionClick('sul')} onMouseEnter={() => onRegionHover('sul')} onMouseLeave={() => onRegionHover(null)} />
      </g>
      <text x="140" y="75"  fill="#fff" fontSize="11" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Norte</text>
      <text x="260" y="80"  fill="#fff" fontSize="10" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Nordeste</text>
      <text x="160" y="165" fill="#fff" fontSize="10" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Centro-Oeste</text>
      <text x="255" y="165" fill="#fff" fontSize="10" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Sudeste</text>
      <text x="207" y="250" fill="#fff" fontSize="11" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Sul</text>
    </svg>
  );
}

function ArSvg({ data, onRegionClick, onRegionHover, selectedRegion }) {
  const prices = data.regions.map(r => r.price);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const color = (id) => priceToColor(data.regions.find(r => r.id === id)?.price || minP, minP, maxP);
  const pathClass = (id) => `region-path${selectedRegion === id ? ' selected' : ''}`;

  return (
    <svg viewBox="0 0 300 420" className="svg-map">
      <g>
        <path className={pathClass('noa')}          fill={color('noa')}          d="M60,20 L150,20 L160,40 L155,80 L140,100 L110,110 L80,100 L65,75 L55,45 Z" onClick={() => onRegionClick('noa')} onMouseEnter={() => onRegionHover('noa')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('litoral')}      fill={color('litoral')}      d="M150,20 L240,25 L250,65 L235,105 L210,115 L185,110 L160,95 L155,80 L160,40 Z" onClick={() => onRegionClick('litoral')} onMouseEnter={() => onRegionHover('litoral')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('pampeana')}     fill={color('pampeana')}     d="M80,100 L110,110 L140,100 L155,80 L160,95 L185,110 L190,150 L185,180 L165,195 L140,200 L115,190 L95,175 L75,155 Z" onClick={() => onRegionClick('pampeana')} onMouseEnter={() => onRegionHover('pampeana')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('cuyo')}         fill={color('cuyo')}         d="M55,45 L65,75 L80,100 L75,155 L55,170 L40,155 L35,120 L40,80 Z" onClick={() => onRegionClick('cuyo')} onMouseEnter={() => onRegionHover('cuyo')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('buenos-aires')} fill={color('buenos-aires')} d="M115,190 L140,200 L165,195 L185,180 L200,195 L200,230 L185,245 L160,250 L135,240 L115,225 L105,205 Z" onClick={() => onRegionClick('buenos-aires')} onMouseEnter={() => onRegionHover('buenos-aires')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('patagonia')}    fill={color('patagonia')}    d="M40,155 L55,170 L75,155 L95,175 L105,205 L115,225 L100,255 L90,290 L75,330 L55,360 L40,380 L25,360 L20,320 L25,280 L30,230 L30,190 Z" onClick={() => onRegionClick('patagonia')} onMouseEnter={() => onRegionHover('patagonia')} onMouseLeave={() => onRegionHover(null)} />
      </g>
      <text x="105" y="68"  fill="#fff" fontSize="10" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">NOA</text>
      <text x="197" y="70"  fill="#fff" fontSize="9"  fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">NEA/Litoral</text>
      <text x="135" y="155" fill="#fff" fontSize="9"  fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Pampeana</text>
      <text x="47"  y="112" fill="#fff" fontSize="9"  fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Cuyo</text>
      <text x="155" y="222" fill="#fff" fontSize="9"  fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Buenos Aires</text>
      <text x="62"  y="280" fill="#fff" fontSize="9"  fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Patagônia</text>
    </svg>
  );
}

function ClSvg({ data, onRegionClick, onRegionHover, selectedRegion }) {
  const prices = data.regions.map(r => r.price);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const color = (id) => priceToColor(data.regions.find(r => r.id === id)?.price || minP, minP, maxP);
  const pathClass = (id) => `region-path${selectedRegion === id ? ' selected' : ''}`;

  return (
    <svg viewBox="0 0 160 520" className="svg-map">
      <g>
        <path className={pathClass('norte')}     fill={color('norte')}     d="M40,10 L110,10 L115,20 L112,80 L108,130 L100,160 L85,170 L70,165 L55,155 L45,130 L38,80 L35,30 Z" onClick={() => onRegionClick('norte')} onMouseEnter={() => onRegionHover('norte')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('rm')}        fill={color('rm')}        d="M55,155 L70,165 L85,170 L100,160 L105,180 L100,195 L85,200 L68,197 L55,188 L50,172 Z" onClick={() => onRegionClick('rm')} onMouseEnter={() => onRegionHover('rm')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('ohiggins')}  fill={color('ohiggins')}  d="M50,172 L55,188 L68,197 L85,200 L100,195 L105,220 L100,245 L85,252 L68,248 L52,238 L45,220 L45,200 Z" onClick={() => onRegionClick('ohiggins')} onMouseEnter={() => onRegionHover('ohiggins')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('bio-bio')}   fill={color('bio-bio')}   d="M45,220 L52,238 L68,248 L85,252 L100,245 L105,270 L98,290 L80,298 L62,292 L48,278 L42,258 Z" onClick={() => onRegionClick('bio-bio')} onMouseEnter={() => onRegionHover('bio-bio')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('araucania')} fill={color('araucania')} d="M42,258 L48,278 L62,292 L80,298 L98,290 L102,325 L92,355 L75,362 L55,352 L40,338 L35,310 L36,278 Z" onClick={() => onRegionClick('araucania')} onMouseEnter={() => onRegionHover('araucania')} onMouseLeave={() => onRegionHover(null)} />
        <path className={pathClass('austral')}   fill={color('austral')}   d="M35,310 L40,338 L55,352 L75,362 L92,355 L95,390 L82,430 L65,460 L45,480 L30,475 L20,450 L18,410 L20,370 L25,340 Z" onClick={() => onRegionClick('austral')} onMouseEnter={() => onRegionHover('austral')} onMouseLeave={() => onRegionHover(null)} />
      </g>
      <text x="75" y="90"  fill="#fff" fontSize="9" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Norte</text>
      <text x="77" y="182" fill="#fff" fontSize="8" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">R. Met.</text>
      <text x="75" y="217" fill="#fff" fontSize="7" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">O'Hig./Maule</text>
      <text x="72" y="265" fill="#fff" fontSize="7" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Biobío/Ñuble</text>
      <text x="68" y="312" fill="#fff" fontSize="7" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Araucanía+</text>
      <text x="60" y="415" fill="#fff" fontSize="8" fontFamily="'DM Mono',monospace" textAnchor="middle" pointerEvents="none" opacity="0.9">Austral</text>
    </svg>
  );
}

export default function MapView() {
  const [currentCountry, setCurrentCountry] = useState('BR');
  const [selectedRegion, setSelectedRegion]  = useState(null);
  const [hoveredRegion,  setHoveredRegion]   = useState(null);

  const data = MAP_DATA[currentCountry];
  const prices = data.regions.map(r => r.price);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const sorted = [...data.regions].sort((a, b) => a.price - b.price);
  const countryColor = COUNTRY_COLORS[currentCountry];
  const hovered = hoveredRegion ? data.regions.find(r => r.id === hoveredRegion) : null;
  const active  = selectedRegion ? data.regions.find(r => r.id === selectedRegion) : null;
  const displayed = hovered || active;

  const svgProps = { data, onRegionClick: setSelectedRegion, onRegionHover: setHoveredRegion, selectedRegion };

  return (
    <div className="map-page">
      <div className="map-controls">
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, marginRight: 8 }}>🗺 Mapa Regional de Preços</div>
        {['BR', 'AR', 'CL'].map((c) => (
          <button
            key={c}
            className={`country-tab${currentCountry === c ? ' active-' + c.toLowerCase() : ''}`}
            onClick={() => { setCurrentCountry(c); setSelectedRegion(null); }}
          >
            {{ BR: '🇧🇷 Brasil · Diesel S10', AR: '🇦🇷 Argentina · Gasoil', CL: '🇨🇱 Chile · Diésel' }[c]}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)' }}>📅 Período: 01/fev/2026–{new Date().toLocaleDateString('pt-BR')} · Clique em uma região</div>
      </div>

      <div className="map-layout">
        <div className="map-container" style={{ position: 'relative' }}>
          <div className="map-title">{data.title}</div>
          <div className="map-subtitle">{data.subtitle}</div>
          {currentCountry === 'BR' && <BrSvg {...svgProps} />}
          {currentCountry === 'AR' && <ArSvg {...svgProps} />}
          {currentCountry === 'CL' && <ClSvg {...svgProps} />}

          {displayed && (
            <div className="map-tooltip show" style={{ position: 'absolute', bottom: 16, left: 16, right: 16, top: 'auto', display: 'block' }}>
              <div className="tt-region">{displayed.name}</div>
              <div className="tt-price" style={{ color: countryColor }}>{formatPrice(displayed.price, currentCountry)}</div>
              <div className="tt-detail">{displayed.detail}</div>
              <div className="tt-detail" style={{ marginTop: 3, color: '#4ade80' }}>{displayed.change} no período</div>
            </div>
          )}
        </div>

        <div className="map-sidebar">
          <div className="map-legend-card">
            <div className="legend-title">⬛ Escala de Preços</div>
            <div className="legend-bar" />
            <div className="legend-labels"><span>Mais barato</span><span>Médio</span><span>Mais caro</span></div>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)' }}>Faixa: {data.legendMin} → {data.legendMax}</div>
          </div>

          <div className="period-info">
            <div className="legend-title">📅 Período de Apuração</div>
            {[['Início', data.pStart], ['Variação', data.pChange], ['Preço inicial', data.pFrom], ['Preço atual', data.pTo]].map(([label, val]) => (
              <div key={label} className="period-row">
                <span className="period-label">{label}</span>
                <span className="period-val" style={label === 'Variação' ? { color: '#ef4444' } : {}}>{val}</span>
              </div>
            ))}
          </div>

          {data.postos && (
            <div className="posto-card">
              <div className="posto-title">⭐ Postos Monitorados</div>
              {data.postos.map((p, i) => (
                <div key={i} className="posto-item">
                  <div className="posto-name">{p.flag} {p.name}</div>
                  <div className="posto-loc">📍 {p.loc}</div>
                  <div className="posto-price" style={{ color: countryColor }}>{p.price}</div>
                  <div className="posto-note">{p.note}</div>
                </div>
              ))}
            </div>
          )}

          <div className="map-legend-card">
            <div className="legend-title">📍 Regiões / Províncias</div>
            <div className="region-list">
              {sorted.map((r) => (
                <div
                  key={r.id}
                  className={`region-item${selectedRegion === r.id ? ' selected' : ''}`}
                  onClick={() => setSelectedRegion(r.id)}
                >
                  <div className="ri-dot" style={{ background: priceToColor(r.price, minP, maxP) }} />
                  <div>
                    <div className="ri-name">{r.name}</div>
                    <div className="ri-change">{r.sub.split(',')[0]}</div>
                  </div>
                  <div>
                    <div className="ri-price" style={{ color: countryColor }}>{formatPrice(r.price, currentCountry)}</div>
                    <div className="ri-change">{r.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
