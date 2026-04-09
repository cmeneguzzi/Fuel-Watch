'use client';
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { L_PERIOD, MO_PERIOD, STATIC_DATA } from '@/lib/data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.color        = '#6b7280';
ChartJS.defaults.borderColor  = '#1e2130';
ChartJS.defaults.font.family  = "'DM Mono', monospace";
ChartJS.defaults.font.size    = 11;

function makeGrad(ctx, h, hex, a1, a2) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  const r = parseInt(hex.slice(1,3),16), gr= parseInt(hex.slice(3,5),16), b= parseInt(hex.slice(5,7),16);
  g.addColorStop(0, `rgba(${r},${gr},${b},${a1})`);
  g.addColorStop(1, `rgba(${r},${gr},${b},${a2})`);
  return g;
}

// ─── PeriodChart — aceita labels dinâmicas da API ──────────────────────────
export function PeriodChart({ id, data, color, unit, sym, height = 195, labels }) {
  const ref = useRef(null);
  const gradRef = useRef(null);
  const chartLabels = (labels && labels.length) ? labels : L_PERIOD;

  const datasets = [{
    label: unit,
    data,
    borderColor: color,
    backgroundColor: (ctx) => {
      const chart = ctx.chart;
      const { ctx: c, chartArea } = chart;
      if (!chartArea) return 'transparent';
      if (!gradRef.current) gradRef.current = makeGrad(c, height, color, 0.32, 0);
      return gradRef.current;
    },
    borderWidth: 2.5,
    pointRadius: 2,
    pointHoverRadius: 5,
    tension: 0.35,
    fill: true,
  }];

  return (
    <div style={{ position: 'relative', height }}>
      <Line
        ref={ref}
        key={chartLabels.length}
        data={{ labels: chartLabels, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111318',
              borderColor: color,
              borderWidth: 1,
              callbacks: { label: (c) => ` ${sym}${c.raw.toLocaleString('pt-BR')}` },
            },
          },
          scales: {
            x: { grid: { color: '#1e2130' }, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
            y: { grid: { color: '#1e2130' } },
          },
        }}
      />
    </div>
  );
}

// ─── CompChart — aceita labels dinâmicas da API ────────────────────────────
export function CompChart({ data, labels }) {
  const { comp_brent, comp_br, comp_ar, comp_cl } = data || STATIC_DATA;
  const chartLabels = (labels && labels.length) ? labels : L_PERIOD;

  return (
    <div style={{ position: 'relative', height: 235 }}>
      <Line
        key={chartLabels.length}
        data={{
          labels: chartLabels,
          datasets: [
            { label: '🛢 Brent (%)',      data: comp_brent, borderColor: '#ff6b35', backgroundColor: 'rgba(255,107,53,.08)', borderWidth: 3, pointRadius: 3, tension: 0.3, fill: true, yAxisID: 'y1' },
            { label: '🇧🇷 Diesel BR (%)', data: comp_br,    borderColor: '#f5a623', backgroundColor: 'transparent', borderWidth: 2.5, pointRadius: 3, tension: 0.3 },
            { label: '🇦🇷 Gasoil AR (%)', data: comp_ar,    borderColor: '#4fc3f7', backgroundColor: 'transparent', borderWidth: 2.5, pointRadius: 3, tension: 0.3 },
            { label: '🇨🇱 Diésel CL (%)', data: comp_cl,    borderColor: '#e84393', backgroundColor: 'transparent', borderWidth: 2.5, pointRadius: 3, tension: 0.3 },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 16, color: '#9ca3af' } },
            tooltip: {
              backgroundColor: '#111318', borderColor: '#1e2130', borderWidth: 1,
              callbacks: { label: (c) => ` ${c.dataset.label}: ${c.raw > 0 ? '+' : ''}${c.raw.toFixed(1)}%` },
            },
          },
          scales: {
            x:  { grid: { color: '#1e2130' }, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
            y:  { grid: { color: '#1e2130' }, ticks: { callback: (v) => v + '%' }, title: { display: true, text: 'Variação acumulada (%)', color: '#6b7280' } },
            y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: (v) => v + '%', color: '#ff6b35' }, title: { display: true, text: 'Brent (%)', color: '#ff6b35' } },
          },
        }}
      />
    </div>
  );
}

// ─── ModalChart ────────────────────────────────────────────────────────────
export function ModalChart({ data: d, modal }) {
  const gradRef = useRef(null);

  if (!d) return null;

  if (modal === 'comp') {
    return (
      <div style={{ height: 230 }}>
        <Bar
          data={{
            labels: MO_PERIOD,
            datasets: [
              { label: '🇧🇷 BR %', data: [0,.3,.5,.9,1.2,1.5,1.9,2.4,2.8,3.0,3.4,5.9,0,24.3,24.3], backgroundColor: 'rgba(245,166,35,.7)', borderColor: '#f5a623', borderWidth: 1, borderRadius: 3 },
              { label: '🇦🇷 AR %', data: [0,7.4,13.7,19,24.2,29.5,35.8,41,45.3,52.6,61.0,70.5,0,26.5,26.5], backgroundColor: 'rgba(79,195,247,.7)', borderColor: '#4fc3f7', borderWidth: 1, borderRadius: 3 },
              { label: '🇨🇱 CL %', data: [0,.5,.7,.9,1.1,1.3,1.6,2.0,2.4,3.0,4.2,5.7,0,55.1,55.1], backgroundColor: 'rgba(232,67,147,.7)', borderColor: '#e84393', borderWidth: 1, borderRadius: 3 },
            ],
          }}
          options={{
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { color: '#9ca3af', padding: 14, usePointStyle: true } },
              tooltip: { backgroundColor: '#111318', borderColor: '#1e2130', borderWidth: 1, callbacks: { label: (c) => ` ${c.dataset.label}: +${c.raw.toFixed(1)}%` } },
            },
            scales: { x: { grid: { color: '#1e2130' } }, y: { grid: { color: '#1e2130' }, ticks: { callback: (v) => v + '%' } } },
          }}
        />
      </div>
    );
  }

  if (!d.y25 || !d.y26) return null;

  const datasets = [
    { label: 'Período anterior', data: d.y25, borderColor: (d.color || '#fff') + '66', backgroundColor: 'transparent', borderWidth: 2, borderDash: [6, 4], pointRadius: 3, tension: 0.35 },
    {
      label: 'Período atual', data: d.y26,
      borderColor: d.color,
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'transparent';
        if (!gradRef.current) gradRef.current = makeGrad(c, 230, d.color || '#fff', 0.28, 0);
        return gradRef.current;
      },
      borderWidth: 3, pointRadius: 3, tension: 0.35, fill: true,
    },
  ];

  return (
    <div style={{ height: 230 }}>
      <Line
        data={{ labels: MO_PERIOD, datasets }}
        options={{
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 14, color: '#9ca3af' } },
            tooltip: {
              backgroundColor: '#111318', borderColor: d.color, borderWidth: 1,
              callbacks: {
                label: (c) => ` ${c.dataset.label}: ${d.sym || ''}${c.raw.toLocaleString('pt-BR')} ${d.unit || ''}`,
                afterBody: (items) => {
                  if (items.length === 2) {
                    const diff = items[1].raw - items[0].raw;
                    const pct = ((diff / items[0].raw) * 100).toFixed(1);
                    return ['', `  Δ: ${diff >= 0 ? '+' : ''}${(d.sym || '')}${Math.abs(diff).toFixed(2)} (${diff >= 0 ? '+' : ''}${pct}%)`];
                  }
                  return [];
                },
              },
            },
          },
          scales: {
            x: { grid: { color: '#1e2130' } },
            y: { grid: { color: '#1e2130' }, ticks: { callback: (v) => (d.sym || '') + v.toLocaleString('pt-BR') } },
          },
        }}
      />
    </div>
  );
}
