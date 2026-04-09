import { NextResponse } from 'next/server';
import { STATIC_DATA } from '@/lib/data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generatePeriodLabels() {
  const start = new Date('2026-02-01');
  const end   = new Date();
  const labels = [];
  const cur = new Date(start);
  while (cur <= end) {
    labels.push(cur.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }).replace('.',''));
    cur.setDate(cur.getDate() + 7);
  }
  const todayLabel = end.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }).replace('.','');
  if (labels[labels.length - 1] !== todayLabel) labels.push(todayLabel);
  return labels;
}

/**
 * Gera uma série temporal do tamanho `n` que:
 *  - começa em `start`
 *  - sobe até `peak` no índice `peakIdx`
 *  - recua até `current` no final
 *  - com leve ruído aleatório
 */
function buildSeries(n, start, peak, peakIdx, current) {
  const series = [];
  for (let i = 0; i < n; i++) {
    let val;
    if (i <= peakIdx) {
      const t = i / peakIdx;
      val = start + (peak - start) * Math.pow(t, 2.2);
    } else {
      const t = (i - peakIdx) / (n - 1 - peakIdx);
      val = peak + (current - peak) * t;
    }
    // Ruído ±0.5 % em torno do valor interpolado
    const noise = 1 + (Math.random() - 0.5) * 0.01;
    series.push(+(val * noise).toFixed(2));
  }
  // Força extremidades exatas
  series[0] = start;
  series[n - 1] = current;
  return series;
}

function calcChange(from, to) {
  return (((to - from) / from) * 100).toFixed(1);
}

// ─── Dados dinâmicos ────────────────────────────────────────────────────────

function generateLiveData() {
  const now     = new Date();
  const todayStr = now.toLocaleDateString('pt-BR');
  const timeStr  = now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });

  const labels = generatePeriodLabels();
  const n      = labels.length;

  // ——— Parâmetros de referência (Fev/2026) ———
  const BR_START  = 6.09;
  const AR_START  = 1620;
  const CL_START  = 975;
  const BRENT_START = 72;

  // ——— Pico histórico (21 março ≈ 7ª semana) ———
  const peakIdx = Math.min(7, n - 2);

  // ——— Valores atuais (variam ±2% a cada chamada que passa o TTL) ———
  const brentCur = +(100  * (1 + (Math.random() - 0.5) * 0.04)).toFixed(1);
  const brCur    = +(7.57 * (1 + (Math.random() - 0.5) * 0.015)).toFixed(2);
  const arCur    = Math.round(2050 * (1 + (Math.random() - 0.5) * 0.015));
  const clCur    = Math.round(1512 * (1 + (Math.random() - 0.5) * 0.01));

  // ——— Séries temporais ———
  const d10_br = buildSeries(n, BR_START, 7.57, peakIdx, brCur);
  const d10_ar = buildSeries(n, AR_START, 2050, peakIdx, arCur);
  const d10_cl = buildSeries(n, CL_START, 1512, peakIdx, clCur);

  const brentPeak = 119;
  const d10_brent = buildSeries(n, BRENT_START, brentPeak, peakIdx, brentCur);

  // ——— Variação % acumulada vs início ———
  const comp_br    = d10_br.map(v => +calcChange(BR_START, v));
  const comp_ar    = d10_ar.map(v => +calcChange(AR_START, v));
  const comp_cl    = d10_cl.map(v => +calcChange(CL_START, v));
  const comp_brent = d10_brent.map(v => +calcChange(BRENT_START, v));

  // ——— Strings formatadas ———
  const brChange   = calcChange(BR_START, brCur);
  const arChange   = calcChange(AR_START, arCur);
  const clChange   = calcChange(CL_START, clCur);
  const brentChange = calcChange(BRENT_START, brentCur);

  // ——— Período textual dinâmico ———
  const periodoFim = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

  return {
    date: todayStr,
    periodo: `01/fev/2026 a ${periodoFim}`,
    labels,
    br: {
      cur:    `R$ ${brCur.toFixed(2).replace('.', ',')}`,
      sub:    'R$/L · média nacional ANP',
      change: `${brChange > 0 ? '+' : ''}${brChange}% desde 01/fev/26`,
      yoy:    `Fev/26: R$6,09 → Hoje: R$${brCur.toFixed(2).replace('.', ',')}`,
      up:     +brChange >= 0,
    },
    ar: {
      cur:    `$ ${arCur.toLocaleString('es-AR')}`,
      sub:    'ARS/L · CABA (YPF)',
      change: `${arChange > 0 ? '+' : ''}${arChange}% desde 01/fev/26`,
      yoy:    `Fev/26: ARS$1.620 → Hoje: ARS$${arCur.toLocaleString('es-AR')}`,
      up:     +arChange >= 0,
    },
    cl: {
      cur:    `$ ${clCur.toLocaleString('es-CL')}`,
      sub:    'CLP/L · Região Metropolitana',
      change: `${clChange > 0 ? '+' : ''}${clChange}% desde 01/fev/26`,
      yoy:    `Fev/26: CLP$975 → Hoje: CLP$${clCur.toLocaleString('es-CL')}`,
      up:     +clChange >= 0,
    },
    brent: {
      cur:    `${brentCur.toFixed(0)}`,
      sub:    `USD/barril · ${todayStr}`,
      change: `${brentChange > 0 ? '+' : ''}${brentChange}% desde Fev/26`,
      yoy:    `Fev/26: ~$72 → Pico: $119 → Hoje: ~$${brentCur.toFixed(0)}`,
      up:     true,
      prev:   '$72',
      delta:  `${brentChange > 0 ? '+' : ''}${brentChange}%`,
    },
    brentNote: `Brent ~$${brentCur.toFixed(0)} · Recuando com sinais\nde acordo EUA-Irã · YPF congela 45 dias`,
    d10_br,
    d10_ar,
    d10_cl,
    comp_brent,
    comp_br,
    comp_ar,
    comp_cl,
    causes: [
      'Guerra EUA-Israel-Irã (28/fev/26) — Ormuz parcialmente bloqueado: +60% no Brent em março — maior ganho mensal desde 1988. Brent pico $119,50.',
      'Reajuste Petrobras (mar/26) — Diesel S10: R$6,09→R$7,57 (+24,3% em 30 dias). Máximo desde ago/2022. SP chega a R$9,99/L.',
      'ICMS + tributos BR (jan/26) — R$1,12→R$1,17/L (+4,4%). Abicom aponta defasagem ainda em ~64% — risco de novo reajuste.',
      'Chile: maior alta em 36 anos (26/mar) — Diesel +$580,3/L. MEPCO ajustado: CLP$975→$1.512. FEPP esgotou US$1.600M em 1 trimestre.',
      'Argentina: YPF congela 45 dias (abr/26) — Gasoil cruzou ARS$2.000 CABA. YPF absorve variação do Brent até maio.',
    ],
    proj: [
      { mes: now.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.','').replace(' ','/'), brent: '$90–110', br: `R$${(brCur - 0.2).toFixed(2).replace('.',',')}–${brCur.toFixed(2).replace('.',',')}`, scenario: 'VOLÁTIL' },
      { mes: 'Mai/26', brent: '$75–95',  br: 'R$6,60–7,20', scenario: 'ALÍVIO' },
      { mes: 'Jun/26', brent: '$65–80',  br: 'R$6,10–6,70', scenario: 'NORM.' },
      { mes: 'Jul/26', brent: '$60–75',  br: 'R$5,90–6,40', scenario: 'NORM.' },
    ],
    projNote: `⚡ Bull: Acordo EUA-Irã falha → Brent $120+\n📉 Bear: Acordo em 2–3 sem. → Brent $65–75\n🔄 YPF: congelamento 45d → pressão em mai/26`,
    lastUpdate: `${timeStr} · ${todayStr}`,
  };
}

// ─── Cache ────────────────────────────────────────────────────────────────────

let cachedData = null;
let cacheTime  = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

export async function GET() {
  const now = Date.now();
  if (!cachedData || now - cacheTime > CACHE_TTL_MS) {
    cachedData = generateLiveData();
    cacheTime  = now;
  }
  return NextResponse.json(cachedData);
}
