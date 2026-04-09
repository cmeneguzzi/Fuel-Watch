export function generatePeriodLabels() {
  const start = new Date('2026-02-01');
  const end   = new Date();
  const labels = [];
  const cur = new Date(start);
  while (cur <= end) {
    labels.push(cur.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''));
    cur.setDate(cur.getDate() + 7);
  }
  const todayLabel = end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  if (labels[labels.length - 1] !== todayLabel) labels.push(todayLabel);
  return labels;
}

export function generateMonthLabels() {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const now = new Date();
  const labels = [];
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${months[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`);
  }
  return labels;
}

export const L_PERIOD  = generatePeriodLabels();
export const MO_PERIOD = generateMonthLabels();

// ——— DATAS DINÂMICAS PARA ESTRUTURAS DE DADOS ———
const _n = new Date();
const _hStr = _n.toLocaleDateString('pt-BR'); // ex: 09/04/2026
const _hDM  = _n.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'}).replace('.',''); // ex: 09/abr
const _hMA  = _n.toLocaleDateString('pt-BR', {month:'short', year:'2-digit'}).replace('.',''); // ex: abr/26
const _pFull = `01/fev/2026 a ${_hStr}`;
const _pShort = `01/fev/2026–${_hStr}`;

export const STATIC_DATA = {
  d10_br:     [6.09, 6.10, 6.11, 6.09, 6.15, 6.30, 6.70, 7.35, 7.57, 7.57],
  d10_ar:     [1620, 1630, 1635, 1640, 1660, 1700, 1780, 1950, 2000, 2050],
  d10_cl:     [975, 978, 980, 982, 985, 995, 1030, 1080, 1512, 1512],
  comp_brent: [0, 3, 6, 8, 15, 30, 50, 62, 39, 39],
  comp_br:    [0, 0.2, 0.3, 0, 1.0, 3.5, 10.0, 20.7, 24.3, 24.3],
  comp_ar:    [0, 0.6, 0.9, 1.2, 2.5, 4.9, 9.9, 20.4, 23.5, 26.5],
  comp_cl:    [0, 0.3, 0.5, 0.7, 1.0, 2.1, 5.6, 10.8, 55.1, 55.1],
};

export const BASE_PRICES = {
  br:    { cur: 'R$ 7,57', sub: 'R$/L · média nacional ANP', change: '+24,3% desde 01/fev', up: true, yoy: `Fev/26: R$6,09/L → Hoje: R$7,57` },
  ar:    { cur: '$ 2.050', sub: 'ARS/L · CABA (YPF)',        change: '+26,5% desde 01/fev', up: true, yoy: `Fev/26: ARS$1.620 → Hoje: ARS$2.050+` },
  cl:    { cur: '$ 1.512', sub: 'CLP/L · Região Metropolitana', change: '+55,1% desde 01/fev', up: true, yoy: `Fev/26: CLP$975/L → Hoje: CLP$1.512` },
  brent: { cur: '100', sub: `USD/barril · ${_n.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'})}`, change: '+39% vs Fev/26', up: true, yoy: 'Fev/26: ~$72 → Pico: $119 → Hoje: ~$100', prev: '$72', delta: '+39%' },
  brentNote: 'Pico $119 em mar/26 · Recuando com sinais\nde acordo EUA-Irã · YPF congela 45 dias',
};

export const BASE_NEWS = {
  timestamp: `08:00 · ${_hStr}`,
  ticker: `🇧🇷 Diesel S10: R$7,57/L (média ANP) — Petrobras sem sinalização de reajuste · 🛢 Brent recua para ~$98–102 com sinais de acordo · 🇦🇷 YPF anuncia congelamento por 45 dias · 🇨🇱 Diesel Chile em CLP$1.512`,
  news: [
    { h: 'YPF anuncia congelamento de preços de combustíveis por 45 dias', t: 'Após gasoil superar ARS$2.000/L, YPF anuncia que absorverá variações do Brent por 45 dias. Gasoil premium em ARS$2.050 na CABA. Outras distribuidoras ainda não confirmaram adesão.', time: `${_hDM}, 08:00`, color: '#4fc3f7', tag: '🇦🇷 ARGENTINA', src: '📰 Infobae', url: 'https://www.infobae.com/economia/2026/04/06/ypf-anuncia-congelamiento-de-precios-de-combustibles/' },
    { h: 'Brent recua para ~$98–102 — sinais de possível acordo EUA-Irã pressionam baixa', t: 'Após pico de $119,50 em março, Brent acumula queda de ~15% com avanços diplomáticos. Trump reafirmou possibilidade de retirada de forças em breve.', time: `${_hDM}, 07:00`, color: '#ff6b35', tag: '🛢 PETRÓLEO', src: '📰 Reuters', url: 'https://www.reuters.com/business/energy/' },
    { h: 'ANP: Diesel S10 termina mês a R$7,57/L — máximo desde ago/2022', t: 'Alta de 24,3% nas últimas semanas. SP registra máxima de R$9,99. PF autua 16 distribuidoras por margens abusivas. Defasagem estimada em 64% (Abicom).', time: `12:00`, color: '#f5a623', tag: '🇧🇷 BRASIL', src: '📰 ANP', url: 'https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos' },
    { h: 'Chile registra maior alta em 36 anos: diésel +$580/L; preço estabiliza em CLP$1.512', t: 'Governo ajustou MEPCO. FEPP esgotou US$1.600M. COPEC e Shell mantêm CLP$1.512 com descontos via app de até $300/L.', time: `00:00`, color: '#e84393', tag: '🇨🇱 CHILE', src: '📰 ENAP', url: 'https://www.enap.cl/pag/15/1369/precios_de_referencia' },
    { h: 'Ônibus e transportadoras pressionam por desoneração do ICMS', t: 'CNT e NTC apresentam pleito ao Confaz e MF. Alta de 24% no diesel elevou custo variável de frotas em 18% em média. Governo federal avalia alternativas.', time: `10:00`, color: '#f5a623', tag: '🇧🇷 BRASIL', src: '📰 CNT', url: 'https://www.cnt.org.br/noticias' },
    { h: 'início do período — conflito Ormuz deflagra choque sincronizado', t: 'Início da apuração: Brent $72 → pico $119 em dias. BR: R$6,09 → AR: ARS$1.620 → CL: CLP$975. Conflito desencadeou maior volatilidade desde 1988.', time: `00:00`, color: '#ff6b35', tag: '⚡ MARCO ZERO', src: '📰 Reuters', url: 'https://www.eia.gov/petroleum/' },
  ],
};

export const MAP_DATA = {
  BR: {
    title: '🇧🇷 Brasil — Diesel S10 por Região',
    subtitle: `Preços médios ANP · R$/L · Período: ${_pFull}`,
    unit: 'R$/L', pStart: '01/fev/2026', pChange: '+24,3%', pFrom: 'R$ 6,09', pTo: 'R$ 7,57',
    legendMin: 'R$ 6,50', legendMax: 'R$ 8,50', postos: null,
    regions: [
      { id:'norte', name:'Norte', price: 7.62, sub:'AM, PA, RO, AC, RR, AP, TO', detail:'Acre: R$7,61 · Amazonas: R$7,85 (logística fluvial)', change:'+25%' },
      { id:'nordeste', name:'Nordeste', price: 7.55, sub:'BA, PE, CE, MA, PI, RN, PB, SE, AL', detail:'Bahia: R$7,39 · Pernambuco: R$7,61', change:'+24%' },
      { id:'centro-oeste', name:'Centro-Oeste', price: 7.68, sub:'GO, MT, MS, DF', detail:'Distrito Federal: R$7,69 · Mato Grosso: R$7,71', change:'+26%' },
      { id:'sudeste', name:'Sudeste', price: 7.71, sub:'SP, RJ, MG, ES', detail:'SP: até R$9,99 (máx. nacional) · RJ mín: R$5,69 · MG: R$7,28', change:'+25%' },
      { id:'sul', name:'Sul', price: 7.52, sub:'RS, SC, PR', detail:'Paraná: R$7,73 · RS: ~R$7,50 · SC: ~R$7,40', change:'+22%' },
    ],
  },
  AR: {
    title: '🇦🇷 Argentina — Gasoil (Diesel) por Região',
    subtitle: `Preços YPF/Shell/Axion · ARS/L · Período: ${_pFull}`,
    unit: 'ARS/L', pStart: '01/fev/2026', pChange: '+26,5%', pFrom: 'ARS$ 1.620', pTo: 'ARS$ 2.050+',
    legendMin: 'ARS$ 1.700', legendMax: 'ARS$ 2.200',
    postos: [
      { name:'Posto Garramuño', loc:'Paso de Los Libres · Corrientes', price:'ARS$ 2.100', note:'Gasoil Premium (referência operacional)', flag:'🇦🇷' },
      { name:'Posto Eloy Guerrero', loc:'Mendoza · Cuyo', price:'ARS$ 1.950', note:'Gasoil padrão YPF · Mendoza entre os mais baratos', flag:'🇦🇷' },
    ],
    regions: [
      { id:'buenos-aires', name:'Buenos Aires + CABA', price: 2050, sub:'CABA, Gran Buenos Aires, Província BA', detail:'CABA YPF: ARS$2.050 · GBA: similar · Prov BA: ARS$1.848–2.050', change:'+26%' },
      { id:'cuyo', name:'Cuyo', price: 1950, sub:'Mendoza, San Juan, San Luis, La Rioja', detail:'Mendoza: ARS$1.950 (gasoil comum $1.628) · Entre os mais baratos', change:'+20%' },
      { id:'litoral', name:'Litoral / NEA', price: 2100, sub:'Corrientes, Misiones, Entre Ríos, Santa Fe, Chaco, Formosa', detail:'Corrientes (Paso de Los Libres): ARS$2.100 · Gasoil premium $1.976 (jan)', change:'+30%' },
      { id:'noa', name:'NOA', price: 2080, sub:'Salta, Jujuy, Tucumán, Santiago del Estero', detail:'Salta: ARS$2.080 · entre os mais caros', change:'+28%' },
      { id:'patagonia', name:'Patagônia', price: 2150, sub:'Neuquén, Río Negro, Chubut, Santa Cruz, TdF', detail:'Neuquén: ARS$2.150 · Chubut: similar', change:'+25%' },
      { id:'pampeana', name:'Pampeana / Centro', price: 2020, sub:'Córdoba, La Pampa, San Luis', detail:'Córdoba: ARS$2.020 · La Pampa: ARS$1.980', change:'+24%' },
    ],
  },
  CL: {
    title: '🇨🇱 Chile — Diésel por Região',
    subtitle: `Preços COPEC/Shell · CLP/L · Período: ${_pFull}`,
    unit: 'CLP/L', pStart: '01/fev/2026', pChange: '+55,1%', pFrom: 'CLP$ 975', pTo: 'CLP$ 1.512',
    legendMin: 'CLP$ 1.490', legendMax: 'CLP$ 1.600',
    postos: [
      { name:'Rede COPEC', loc:'Todo o Chile — maior rede do país', price:'CLP$ 1.512', note:'RM: $1.512 · Descontos app: até -$300/L', flag:'🇨🇱' },
      { name:'Shell Chile', loc:'Principais cidades e rodovias', price:'CLP$ 1.512', note:'App Shell Lider Bci: -$100/L', flag:'🇨🇱' },
    ],
    regions: [
      { id:'rm', name:'Região Metropolitana', price: 1512, sub:'Santiago e Grande Santiago', detail:'COPEC/Shell: CLP$1.512', change:'+55%' },
      { id:'norte', name:'Norte Grande / Médio', price: 1540, sub:'Regiões I (Tarapacá) a IV (Coquimbo)', detail:'Arica: CLP$1.540 · Antofagasta: CLP$1.535', change:'+56%' },
      { id:'ohiggins', name:"O'Higgins / Maule", price: 1518, sub:'Regiões VI e VII', detail:"Rancagua: CLP$1.518", change:'+55%' },
      { id:'bio-bio', name:'Biobío / Ñuble', price: 1520, sub:'Regiões VIII e XVI', detail:'Concepción: CLP$1.522', change:'+55%' },
      { id:'araucania', name:'La Araucanía / Los Ríos / Los Lagos', price: 1530, sub:'Regiões IX, XIV, X', detail:'Temuco: CLP$1.528 · Valdivia: CLP$1.535', change:'+56%' },
      { id:'austral', name:'Aysén / Magallanes', price: 1575, sub:'Regiões XI e XII — mais isoladas', detail:'Coyhaique: CLP$1.590 · Punta Arenas: CLP$1.565', change:'+58%' },
    ],
  },
};

export const MODAL_DATA = {
  br: {
    flag:'🇧🇷', title:'Brasil — Diesel S10', sub:`Período: ${_pFull}`, color:'#f5a623', sym:'R$', unit:'R$/L',
    y25:[5.74,5.76,5.79,5.82,5.85,5.88,5.90,5.93,5.96,5.98,6.01,6.09,6.09,7.57,7.57],
    y26:[5.74,5.75,5.77,5.79,5.82,5.85,5.89,5.93,5.96,5.98,6.01,6.09,6.09,7.57,7.57],
    kpis:[{l:'Início período',v:'R$ 6,09',s:'01/fev/2026 · ANP',c:'#6b7280'},{l:'Atual',v:'R$ 7,57',s:`${_hStr} · ANP`,c:'#f5a623'},{l:'Δ Período',v:'+24,3%',s:'Acumulado do período',c:'#ef4444',up:true}],
    note:`Diesel S10 acumulou +24,3% no período. Vetores: ICMS (+R$0,05/L), reajuste Petrobras (+R$0,38/L) e choque geopolítico Ormuz (+$47/bbl). Defasagem ainda ~64% (Abicom).`,
    timeline:[{d:'01/fev/26',t:'<strong>Início apuração:</strong> R$6,09/L.',c:'#6b7280'},{d:'28/fev/26',t:'<strong>Conflito Ormuz:</strong> Brent $67→$107+.',c:'#ef4444'},{d:'08/mar/26',t:'<strong>ANP:</strong> diesel S10 → R$6,15.',c:'#fbbf24'},{d:'20/mar/26',t:'<strong>ANP:</strong> S10 → R$7,35.',c:'#f5a623'},{d:`${_hDM}/26`,t:`<strong>Hoje:</strong> R$7,57. Brent ~$100. Sem novo reajuste.`,c:'#ff6b35'}],
  },
  ar: {
    flag:'🇦🇷', title:'Argentina — Gasoil', sub:`Período: ${_pFull}`, color:'#4fc3f7', sym:'ARS$', unit:'ARS/L',
    y25:[950,1020,1080,1130,1180,1230,1290,1340,1380,1410,1450,1620,1620,2000,2050],
    y26:[950,960,975,990,1010,1040,1090,1150,1230,1350,1490,1620,1620,2000,2050],
    kpis:[{l:'Início período',v:'ARS$ 1.620',s:'Fev/26 · CABA YPF',c:'#6b7280'},{l:'Atual',v:'ARS$ 2.050',s:`${_hMA} · YPF congelado 45d`,c:'#4fc3f7'},{l:'Δ Período',v:'+26,5%',s:'Acumulado do período',c:'#ef4444',up:true}],
    note:'Gasoil acumulou +26,5% no período. Postos de fronteira em alta. YPF congelou por 45 dias para tentar barrar a inflação interna.',
    timeline:[{d:'01/fev/26',t:'<strong>Início:</strong> ARS$1.620.',c:'#6b7280'},{d:'28/fev/26',t:'<strong>Conflito Ormuz:</strong> pressão acelerada.',c:'#ef4444'},{d:'Mar/26',t:'<strong>Gasoil cruza ARS$2.000:</strong> +20% no mês.',c:'#4fc3f7'},{d:`${_hDM}/26`,t:'<strong>YPF congela 45 dias:</strong> ARS$2.050 CABA. Estabilização temporária.',c:'#4fc3f7'}],
  },
  cl: {
    flag:'🇨🇱', title:'Chile — Diésel', sub:`Período: ${_pFull}`, color:'#e84393', sym:'CLP$', unit:'CLP/L',
    y25:[912,914,916,918,920,922,924,928,932,936,946,960,975,1512,1512],
    y26:[912,913,914,916,918,920,922,926,930,934,944,958,975,1512,1512],
    kpis:[{l:'Início período',v:'CLP$ 975',s:'Fev/26 · RM COPEC',c:'#6b7280'},{l:'Atual',v:'CLP$ 1.512',s:`RM · Até ${_hStr}`,c:'#e84393'},{l:'Δ Período',v:'+55,1%',s:'Acumulado do período',c:'#ef4444',up:true}],
    note:`Chile registrou maior alta em 36 anos: diésel +$580,3/L. Governo fez repasse quase integral. Aysén é a região mais cara com ~$1.590/L. O país é 99% vulnerável às oscilações internacionais.`,
    timeline:[{d:'01/fev/26',t:'<strong>Início:</strong> CLP$975/L.',c:'#6b7280'},{d:'28/fev/26',t:'<strong>Conflito Ormuz:</strong> repasse aos importadores.',c:'#ef4444'},{d:'26/mar/26',t:'<strong>ENAP aplica:</strong> diésel +$580,3/L na bomba.',c:'#ef4444'},{d:`${_hDM}/26`,t:`<strong>Hoje:</strong> CLP$1.512 estável. Brent recuando alivia projeções médias.`,c:'#4ade80'}],
  },
  brent: {
    flag:'🛢', title:'Petróleo Brent', sub:`Período: ${_pFull}`, color:'#ff6b35', sym:'$', unit:'USD/bbl',
    y25:[72,71,70,69,68,67,67,68,69,70,68,66,72,104,100],
    y26:[72,71,70,70,69,68,67,67,68,68,72,72,72,119,100],
    kpis:[{l:'Início período',v:'$ 72',s:'01/fev/26 · antes conflito',c:'#6b7280'},{l:'Pico',v:'$ 119',s:'Máxima alcançada',c:'#ef4444'},{l:'Atual',v:'$ ~100',s:`${_hStr} · recuando`,c:'#ff6b35',up:false}],
    note:'Brent saltou de $72 para $119 (+65%) em 21 dias (maior ganho desde 1988) com bloqueio parcial de Ormuz. Recua para ~$100 com sinais de alívio diplomático que afrouxou o mercado do óleo cru.',
    timeline:[{d:'01/fev/26',t:'<strong>Início:</strong> ~$72/bbl.',c:'#6b7280'},{d:'28/fev/26',t:'<strong>GUERRA:</strong> Ormuz bloqueado. +$20 em 2 dias.',c:'#ef4444'},{d:'21/mar/26',t:'<strong>Pico $119,50:</strong> maior ganho mensal histórico.',c:'#ef4444'},{d:`${_hDM}/26`,t:'<strong>Recuo ~$100:</strong> YPF congela 45d. EIA reporta estoques globais adequados na matriz de balanço.',c:'#4ade80'}],
  },
  comp: {
    flag:'🌎', title:'Comparativo Regional', sub:`Variação % acumulada — ${_pFull}`, color:'#9ca3af',
    kpis:[{l:'🇧🇷 +24,3%',v:'R$6,09→7,57',s:'Diesel S10',c:'#f5a623'},{l:'🇦🇷 +26,5%',v:'ARS$1.620→2.050',s:'Gasoil CABA',c:'#4fc3f7'},{l:'🇨🇱 +55,1%',v:'CLP$975→1.512',s:'Diésel RM',c:'#e84393'}],
    note:`Chile lidera o repasse na América do Sul absorvendo quase todo o choque na base do CLP. Brasil (+24%) tem influência do teto da Petrobras. Argentina (+26%) foi refreada pelo congelamento de curto prazo feito pela YPF de forma preventiva.`,
    timeline:[{d:'01/fev/26',t:'<strong>Base zero:</strong> BR R$6,09 · AR ARS$1.620 · CL CLP$975 · Brent $72',c:'#6b7280'},{d:'28/fev/26',t:'<strong>Conflito global:</strong> início da disrupção simétrica imediata.',c:'#ef4444'},{d:'26/mar/26',t:'<strong>Chile explode:</strong> principal alta no continente em 30 anos.',c:'#e84393'},{d:`${_hDM}/26`,t:`<strong>Panorama atual:</strong> Brent nos $100 gerando falso alívio nas defasagens remanescentes.`,c:'#4fc3f7'}],
  },
};
