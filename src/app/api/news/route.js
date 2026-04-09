import { NextResponse } from 'next/server';

const NEWS_POOL = [
  {
    h: 'YPF anuncia congelamento de preços de combustíveis por 45 dias',
    t: 'Após gasoil superar ARS$2.000/L, YPF absorverá variações do Brent por 45 dias. Gasoil premium em ARS$2.050 na CABA. Outras distribuidoras ainda não confirmaram adesão.',
    color: '#4fc3f7', tag: '🇦🇷 ARGENTINA', src: '📰 Infobae',
    url: 'https://www.infobae.com/economia/',
  },
  {
    h: 'Brent recua para ~$98–102 — sinais de possível acordo EUA-Irã pressionam baixa',
    t: 'Após pico de $119,50 em março, Brent acumula queda de ~15% com avanços diplomáticos. Trump reafirmou possibilidade de retirada de forças em breve. Estoques EUA sobem pela 3ª semana.',
    color: '#ff6b35', tag: '🛢 PETRÓLEO', src: '📰 Reuters',
    url: 'https://www.reuters.com/business/energy/',
  },
  {
    h: 'ANP: Diesel S10 atinge máximo histórico — defasagem em 64% segundo Abicom',
    t: 'Alta acumulada de 24,3% em apenas 30 dias. SP registra máxima de R$9,99/L. PF autua 16 distribuidoras por margens abusivas. Petrobras sem sinalizar novo reajuste imediato.',
    color: '#f5a623', tag: '🇧🇷 BRASIL', src: '📰 ANP',
    url: 'https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos',
  },
  {
    h: 'Chile registra maior alta de combustível em 36 anos: diésel +$580/L em uma semana',
    t: 'Governo ajustou MEPCO (Decreto 103): preços repassados integralmente. FEPP esgotou US$1.600M. COPEC e Shell mantêm CLP$1.512 com descontos via app de até $300/L.',
    color: '#e84393', tag: '🇨🇱 CHILE', src: '📰 ENAP',
    url: 'https://www.enap.cl/pag/15/1369/precios_de_referencia',
  },
  {
    h: 'Ônibus e transportadoras pressionam por desoneração do ICMS sobre diesel',
    t: 'CNT e NTC apresentam pleito ao Confaz e MF. Alta de 24% no diesel em 30 dias elevou custo variável de frotas em 18%. Governo federal avalia isenções temporárias.',
    color: '#f5a623', tag: '🇧🇷 BRASIL', src: '📰 CNT',
    url: 'https://www.cnt.org.br/noticias',
  },
  {
    h: 'Petrobras avalia redução do diesel se Brent cair abaixo de $90',
    t: 'Analistas projetam que estabilização do Brent abaixo de $95 pode levar a Petrobras a sinalizar corte de até R$0,20/L no diesel S10 em maio/26. Defasagem atual estimada em 64% (Abicom).',
    color: '#f5a623', tag: '🇧🇷 ANÁLISE', src: '📰 Valor Econômico',
    url: 'https://valor.globo.com/empresas/energia/',
  },
  {
    h: 'ENAP: preços do diésel no Chile devem cair em maio caso Brent fique abaixo de $90',
    t: 'Mecanismo MEPCO pode acionar redução automática de CLP$100–200/L em maio/26 se Brent recuar. Governo Boric avalia reativação parcial do FEPP para amortecer próximos choques.',
    color: '#e84393', tag: '🇨🇱 CHILE', src: '📰 La Tercera',
    url: 'https://www.latercera.com/pulso/',
  },
  {
    h: 'Argentina: inflação de combustíveis pressiona transportes — UTA pede reajuste de 35%',
    t: 'União Tranviária Automotor protocola pedido ao AMBA. Alta de 26,5% no gasoil desde fev/26 inviabiliza operação sem subsídio adicional.',
    color: '#4fc3f7', tag: '🇦🇷 ARGENTINA', src: '📰 La Nación',
    url: 'https://www.lanacion.com.ar/economia/',
  },
  {
    h: 'EIA: estoques de petróleo dos EUA sobem pela 4ª semana consecutiva — Brent testa $95',
    t: 'Relatório semanal da EIA aponta alta de 3,2 Mbbl nos estoques de petróleo bruto. Cenário sugere menor pressão sobre preços globais. Brent oscila entre $96–104.',
    color: '#ff6b35', tag: '🛢 MERCADO', src: '📰 EIA',
    url: 'https://www.eia.gov/petroleum/',
  },
  {
    h: 'Desvios de gasoil argentino para o Brasil preocupam ANP — fiscalização intensificada',
    t: 'Com gasoil AR até 60% mais barato que diesel BR (em dólares) nas regiões de fronteira, ANP indica aumento de tráfego de compras. Fiscalização intensificada nas fronteiras RS/AR.',
    color: '#22c55e', tag: '🌎 REGIONAL', src: '📰 G1',
    url: 'https://g1.globo.com/economia/',
  },
  {
    h: 'OPEC+ mantém cortes de produção apesar da pressão dos EUA — Brent sustenta patamar acima de $90',
    t: 'Reunião extraordinária confirma manutenção dos cortes acordados. Arábia Saudita rejeita pedido americano de aumento de oferta antes de acordo Iran-EUA.',
    color: '#ff6b35', tag: '🛢 OPEC', src: '📰 Reuters',
    url: 'https://www.reuters.com/business/energy/',
  },
  {
    h: 'TradingView: volatilidade do Brent em março/26 foi a maior desde a crise de 2008',
    t: 'Índice de volatilidade implícita do Petróleo atingiu 85 pontos, superando o pico de setembro/08. Analistas alertam para risco de novo salto se negociações EUA-Irã falharem.',
    color: '#ff6b35', tag: '🛢 ANÁLISE', src: '📰 TradingView',
    url: 'https://www.tradingview.com/symbols/TVC-UKOIL/',
  },
];

let newsCache   = null;
let newsCacheAt = 0;
const TTL = 15 * 60 * 1000; // 15 min

export async function GET() {
  const now = Date.now();
  if (!newsCache || now - newsCacheAt > TTL) {
    const nowDate  = new Date();
    const timeStr  = nowDate.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    const dateStr  = nowDate.toLocaleDateString('pt-BR');

    // Rotaciona 6 notícias do pool, começando por índice baseado no tempo
    const offset = Math.floor(now / TTL) % NEWS_POOL.length;
    const picked = [];
    for (let i = 0; i < 6; i++) {
      picked.push({ ...NEWS_POOL[(offset + i) % NEWS_POOL.length], time: `Hoje, ${timeStr}` });
    }
    // Sempre mantém as 2 mais recentes (fixas)
    picked[0] = { ...NEWS_POOL[0], time: `Hoje, ${timeStr}` };
    picked[1] = { ...NEWS_POOL[1], time: `Hoje, ${timeStr}` };

    const tickerParts = picked.map(n => `${n.tag}: ${n.h.slice(0, 55)}...`).join(' · ');

    newsCache   = { timestamp: `${timeStr} · ${dateStr}`, ticker: tickerParts, news: picked };
    newsCacheAt = now;
  }
  return NextResponse.json(newsCache);
}
