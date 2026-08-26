/* ════════════════════════════════════════════════════════════════
   GAME-ID MARKETPLACE FLOW
   CARD → GAME SELECTION → ACCOUNT LIST → ACCOUNT DETAIL → PURCHASE
   Split into: DATA · GAME SELECTION · ACCOUNT MARKETPLACE ·
               ACCOUNT DETAIL · GALLERY · IMAGE VIEWER · PURCHASE
   ════════════════════════════════════════════════════════════════ */

/* ---------------------------------------------------------------
   DATA LAYER
   --------------------------------------------------------------- */
const GAMES = [
  { id:'mlbb',      name:'Mobile Legends', accent:'#7CC9FF', icon:'<path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12"/>' },
  { id:'pubgm',     name:'PUBG Mobile',    accent:'#8FD8FF', icon:'<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2"/>' },
  { id:'valorant',  name:'Valorant',       accent:'#FF6B81', icon:'<path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z"/><path d="M9 12l2 2 4-4"/>' },
  { id:'freefire',  name:'Free Fire',      accent:'#FFB25C', icon:'<path d="M12 2c1.5 3 1 4.5-1 6.5C9 10.5 8 12 8 14a4 4 0 0 0 8 0c0-1.2-.5-2-1.2-2.8.9.4 2.2 1.6 2.2 3.8a5 5 0 0 1-10 0c0-3.5 2-5 3-8 .5-1.2.7-2.2 1-5Z"/>' },
  { id:'genshin',   name:'Genshin Impact', accent:'#B18CFF', icon:'<path d="M12 2 2 9l10 13L22 9 12 2Z"/><path d="M2 9h20M8 9l4 13 4-13M12 2v7"/>' },
  { id:'wildrift',  name:'Wild Rift',      accent:'#7CE2C4', icon:'<path d="M14.5 2 3 13.5 6 17 17.5 5.5 14.5 2Z"/><path d="M17.5 5.5 22 4l-1.5 4.5M6 17l-4 1.5L3.5 14"/>' },
];
const GAME_BY_ID = Object.fromEntries(GAMES.map(g => [g.id, g]));

// which games surface under each of the 4 category cards
const CATEGORY_GAMES = {
  games: ['mlbb','pubgm','valorant','freefire','genshin','wildrift'],
  gift:  ['mlbb','genshin','valorant'],
  topup: ['mlbb','pubgm','freefire','wildrift'],
  best:  ['mlbb','freefire','genshin','pubgm'],
};
const CATEGORY_META = {
  games:{ title:'GAME COLLECTION',       subtitle:'Choose a game to explore available accounts' },
  gift:  { title:'GIFT-READY GAMES',      subtitle:'Choose a game to explore gift-ready accounts' },
  topup: { title:'TOP-UP READY GAMES',    subtitle:'Choose a game to explore top-up ready accounts' },
  best:  { title:'BEST SELLER GAMES',     subtitle:"Choose a game from this week's trending picks" },
};

function hashCode(str){ let h = 0; for (let i = 0; i < str.length; i++){ h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return Math.abs(h) || 1; }
function seededRandom(seed){ let s = seed % 2147483647; if (s <= 0) s += 2147483646; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function formatKip(n){ return n.toLocaleString('en-US') + ' ₭'; }

function svgPlaceholder(accent, n){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0%' stop-color='${accent}'/><stop offset='100%' stop-color='#0b131c'/>` +
    `</linearGradient></defs>` +
    `<rect width='800' height='600' fill='url(#g)'/>` +
    `<circle cx='${120 + (n*57)%560}' cy='${90 + (n*83)%420}' r='170' fill='rgba(255,255,255,0.05)'/>` +
    `<text x='50%' y='54%' font-family='Arial, sans-serif' font-size='130' fill='rgba(255,255,255,0.16)' text-anchor='middle'>${String(n).padStart(2,'0')}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function generateImages(accent, count){
  const arr = [];
  for (let n = 1; n <= count; n++) arr.push(svgPlaceholder(accent, n));
  return arr;
}

const ACCOUNTS_CACHE = {};
const ACC_DESC_TH = (gameName) =>
  `ไอดี ${gameName} พรีเมียม เลเวลสูง ปลดล็อกไอเทมหายากมากมาย ผ่านการตรวจสอบครบถ้วนก่อนลงขายทุกครั้ง พร้อมโอนให้ผู้ซื้อใช้งานได้ทันทีหลังชำระเงินเสร็จสมบูรณ์.`;
const ACC_SAFETY_TH = [
  'เปลี่ยนอีเมลและรหัสผ่านได้ทันทีหลังซื้อ',
  'ตรวจสอบข้อมูลไอดีให้ครบก่อนโอนเงินทุกครั้ง',
  'มีการรับประกันหลังการขาย 7 วัน หากไอดีมีปัญหาจากผู้ขาย',
];

function generateAccounts(game){
  if (ACCOUNTS_CACHE[game.id]) return ACCOUNTS_CACHE[game.id];
  const rnd = seededRandom(hashCode(game.id));
  const count = 6;
  const badges = ['PREMIUM','RARE','STANDARD','PREMIUM','RARE','PREMIUM'];
  const list = [];
  for (let i = 1; i <= count; i++){
    const level = 30 + Math.floor(rnd() * 70);
    const skins = 10 + Math.floor(rnd() * 90);
    const rareItems = Math.floor(rnd() * 20);
    const price = 150000 + Math.floor(rnd() * 22) * 35000;
    const stock = rnd() > 0.12;
    list.push({
      id: `${game.id}-${String(i).padStart(3,'0')}`,
      gameId: game.id,
      title: `Account #${String(i).padStart(3,'0')}`,
      badge: badges[(i - 1) % badges.length],
      price, level, skins, rareItems, stock,
      description: ACC_DESC_TH(game.name),
      details: [
        `Level ${level}`,
        `${skins} Skins Unlocked`,
        `${rareItems} Rare Items`,
        'Bindable email — changeable after purchase',
        'Full account access included',
      ],
      safety: ACC_SAFETY_TH,
      images: generateImages(game.accent, 20),
    });
  }
  ACCOUNTS_CACHE[game.id] = list;
  return list;
}
function findAccount(accountId){
  const gameId = accountId.split('-')[0];
  const list = ACCOUNTS_CACHE[gameId] || generateAccounts(GAME_BY_ID[gameId] || GAMES[0]);
  return list.find(a => a.id === accountId);
}

