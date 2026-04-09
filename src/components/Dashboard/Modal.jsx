'use client';
import { useState } from 'react';
import { MODAL_DATA, MO_PERIOD } from '@/lib/data';
import { ModalChart } from './Charts';

export default function Modal({ modalKey, onClose }) {
  const [activeTab, setActiveTab] = useState('chart');
  const d = MODAL_DATA[modalKey];
  if (!d || !modalKey) return null;

  const tabs = [
    { id: 'chart',    label: '📈 Evolução Período' },
    { id: 'timeline', label: '🗓 Linha do Tempo' },
    { id: 'context',  label: '🌐 Estrutura & Projeção' },
  ];

  return (
    <div className="moverlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="mhdr">
          <div className="mhdr-l">
            <div className="mflag">{d.flag}</div>
            <div>
              <div className="mhtitle">{d.title}</div>
              <div className="mhsub">{d.sub}</div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>

        <div className="mbody">
          {/* KPIs */}
          <div className="mkpi-row">
            {d.kpis.map((k, i) => (
              <div key={i} className="mkpi">
                <div className="mkl">{k.l}</div>
                <div className="mkv" style={{ color: k.c }}>{k.v}</div>
                <div className="mks">{k.s}</div>
                {k.up !== undefined && (
                  <div className={`dbadge ${k.up ? 'dup' : 'ddn'}`}>{k.up ? '▲' : '▼'} {k.v}</div>
                )}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mtabs">
            {tabs.map(t => (
              <button key={t.id} className={`mtab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Chart panel */}
          {activeTab === 'chart' && (
            <div>
              <div className="mst">📊 Evolução — 01/fev/2026 → {new Date().toLocaleDateString('pt-BR')} ({d.unit || ''})</div>
              <ModalChart data={d} modal={modalKey} />
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 11, lineHeight: 1.6, padding: 11, background: '#0f1117', borderRadius: 8 }}>
                {d.note}
              </div>
            </div>
          )}

          {/* Timeline panel */}
          {activeTab === 'timeline' && (
            <div>
              <div className="mst">🗓 Eventos que Impactaram os Preços</div>
              <div className="tline">
                {(d.timeline || []).map((t, i) => (
                  <div key={i} className="tli" style={{ '--ac': t.c }}>
                    <div className="tldate">{t.d}</div>
                    <div className="tltext" dangerouslySetInnerHTML={{ __html: t.t }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Context panel */}
          {activeTab === 'context' && (
            <ContextPanel modalKey={modalKey} color={d.color} />
          )}
        </div>
      </div>
    </div>
  );
}

function ContextPanel({ modalKey, color }) {
  if (modalKey === 'br') return (
    <div>
      <div className="mst">🌐 Estrutura — Brasil (abr/26)</div>
      <div style={{ background: '#0f1117', borderRadius: 10, padding: 14, border: '1px solid var(--border)', fontSize: 11, lineHeight: 2 }}>
        {[['Refinaria (Petrobras)', '~R$4,80', '#f5a623'], ['ICMS', 'R$1,17', '#fbbf24'], ['CIDE+PIS/COFINS', 'R$0,38', '#fbbf24'], ['Dist.+Revenda', '~R$1,22', 'inherit']].map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{k}</span><span style={{ color: c }}>{v}</span></div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 5, fontWeight: 600 }}>
          <span>Total</span><span style={{ color: '#f5a623' }}>~R$7,57</span>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: 'var(--muted)', lineHeight: 1.6, padding: 10, background: '#0f1117', borderRadius: 8 }}>
        ⚠️ Defasagem estimada em 64% (Abicom). PF autuou 16 distribuidoras. Petrobras sem sinalizar novo reajuste imediato.
      </div>
    </div>
  );

  if (modalKey === 'ar') return (
    <div>
      <div className="mst">🌐 Postos Monitorados — Argentina</div>
      {[
        { name: 'Posto Garramuño', loc: 'Paso de Los Libres (Corrientes)', price: 'ARS$ 2.100', note: 'Gasoil Premium · Fronteira BR-AR · Base de referência operacional' },
        { name: 'Posto Eloy Guerrero', loc: 'Mendoza · Cuyo', price: 'ARS$ 1.950', note: 'Gasoil padrão YPF · Mendoza: menor tributação provincial' },
      ].map((p, i) => (
        <div key={i} style={{ background: '#0f1117', borderRadius: 10, padding: 14, border: '1px solid var(--border)', fontSize: 11, lineHeight: 1.9, marginBottom: 10 }}>
          <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 6 }}>⭐ {p.name}</div>
          <div style={{ color: 'var(--muted)' }}>{p.loc}</div>
          <div style={{ color: '#4fc3f7', fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{p.price} / litro</div>
          <div style={{ color: 'var(--muted)', fontSize: 10 }}>{p.note}</div>
        </div>
      ))}
    </div>
  );

  if (modalKey === 'cl') return (
    <div>
      <div className="mst">🌐 Redes Monitoradas — Chile</div>
      {[
        { name: 'Rede COPEC (maior rede do Chile)', loc: 'Todo o Chile · RM e regiões', price: 'CLP$ 1.512', note: 'App COPEC: desconto Coopeuch -$200/L qua · Tenpo -$50–300/L' },
        { name: 'Shell Chile', loc: 'Principais cidades e rodovias', price: 'CLP$ 1.512', note: 'App Shell Lider Bci: -$100/L terças · Tenpo: -$50–300/L' },
      ].map((p, i) => (
        <div key={i} style={{ background: '#0f1117', borderRadius: 10, padding: 14, border: '1px solid var(--border)', fontSize: 11, lineHeight: 1.9, marginBottom: 10 }}>
          <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 6 }}>⛽ {p.name}</div>
          <div style={{ color: 'var(--muted)' }}>{p.loc}</div>
          <div style={{ color: '#e84393', fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{p.price} / litro</div>
          <div style={{ color: 'var(--muted)', fontSize: 10 }}>{p.note}</div>
        </div>
      ))}
      <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6, padding: 10, background: '#0f1117', borderRadius: 8 }}>
        🇨🇱 Chile: 99% dependência de importação. Aysén: ~$1.590. Fonte oficial: Bencinaenlinea.cl
      </div>
    </div>
  );

  if (modalKey === 'brent') return (
    <div>
      <div className="mst">🌐 Impacto Regional do Brent · Período</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { country: '🇧🇷 Brasil', c: 'var(--br)', lines: ['Diesel S10: +24,3%', 'Fev: R$6,09 → Abr: R$7,57', 'Defasagem: 64%'] },
          { country: '🇦🇷 Argentina', c: 'var(--ar)', lines: ['Gasoil CABA: +26,5%', 'Fev: ARS$1.620 → ARS$2.050', 'YPF: 45d congelado'] },
          { country: '🇨🇱 Chile', c: 'var(--cl)', lines: ['Diésel RM: +55,1%', 'Fev: CLP$975 → $1.512', 'Maior alta em 36 anos'] },
        ].map(({ country, c, lines }, i) => (
          <div key={i} style={{ background: '#0f1117', borderRadius: 9, padding: 12, borderTop: `2px solid ${c}`, border: '1px solid var(--border)' }}>
            <div style={{ color: c, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{country}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.8 }}>{lines.map((l, j) => <span key={j}>{l}<br /></span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mst">🌐 Resumo Comparativo · {new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'2-digit'})}</div>
      <div style={{ background: '#0f1117', borderRadius: 10, padding: 14, border: '1px solid var(--border)', fontSize: 11, lineHeight: 1.9, color: 'var(--muted)' }}>
        🇧🇷 Projeção: R$7,20–7,80 em abr · possível alívio em mai com Brent $80–95<br />
        🇦🇷 YPF congelado até ~20/mai. Após: ARS$2.200+ se Brent não recuar<br />
        🇨🇱 CLP$1.512 estável em abr · descontos apps -$300/L · Brent abaixo de $90 pode acionar redução MEPCO<br /><br />
        Todos dependentes da evolução do acordo EUA-Irã e sinalizações de Trump.
      </div>
    </div>
  );
}
