/* ============ 梦噫 · 核心 ============ */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STORE_KEY = 'mengyi_os_v1';
const DEFAULT_STATE = {
  username: '小梦',
  petName: '',
  myAvatar: '',
  birthday: '10-16',
  wallpaper: 'assets/lock.jpg',
  sound: true,
  notify: true,
  likedPosts: [],
  nextReply: '',
  customReplies: [],
  chat: D.zeyuChat.map((m) => ({ ...m })),
  chatSeed: 2,
  unread: { zeyu: 2, family: 2, mom: 1, dad: 0, wang: 0 },
  orders: [],
  tickets: [],
  customPhotos: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredCloneSafe(DEFAULT_STATE);
    const s = JSON.parse(raw);
    const merged = Object.assign(structuredCloneSafe(DEFAULT_STATE), s, {
      unread: Object.assign({ zeyu: 2, family: 2, mom: 1, dad: 0, wang: 0 }, s.unread || {}),
      chat: Array.isArray(s.chat) && s.chat.length ? s.chat : DEFAULT_STATE.chat
    });
    if (s.chatSeed !== DEFAULT_STATE.chatSeed) {
      merged.chat = structuredCloneSafe(DEFAULT_STATE.chat);
      merged.chatSeed = DEFAULT_STATE.chatSeed;
    }
    return merged;
  } catch (e) {
    return structuredCloneSafe(DEFAULT_STATE);
  }
}
function structuredCloneSafe(o) { return JSON.parse(JSON.stringify(o)); }

let state = loadState();

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch (e) { /* 存储满了也不影响使用 */ }
}

/* ---------- 头像 ---------- */
function petName() {
  if (state.petName && state.petName.trim()) return state.petName.trim();
  const n = (state.username || '小乖').trim();
  if (!n) return '小乖';
  if (/[宝宝贝乖]$/.test(n)) return n;
  const last = Array.from(n).pop();
  return last ? last + '宝' : '小乖';
}
function avatarOf(who, cls = '') {
  if (who === 'me') {
    if (state.myAvatar) return `<div class="wx-avatar ${cls}"><img src="${state.myAvatar}" alt=""></div>`;
    const ch = Array.from(state.username || '梦')[0] || '梦';
    return `<div class="wx-avatar ${cls}"><div class="mono">${esc(ch)}</div></div>`;
  }
  if (who === 'zeyu') return `<div class="wx-avatar ${cls}"><img src="assets/avatar.jpg" alt="张泽禹"></div>`;
  if (who === 'mom') return `<div class="wx-avatar ${cls}"><div class="mono" style="background:linear-gradient(135deg,#e6b3a8,#cf8f84)">妈</div></div>`;
  if (who === 'dad') return `<div class="wx-avatar ${cls}"><div class="mono" style="background:linear-gradient(135deg,#9fb7c9,#6f8ba0)">爸</div></div>`;
  if (who === 'wang') return `<div class="wx-avatar ${cls}"><div class="mono" style="background:linear-gradient(135deg,#c9b3d9,#9d86b0)">桐</div></div>`;
  return `<div class="wx-avatar ${cls}"><div class="mono">家</div></div>`;
}

/* ---------- 图标 ---------- */
const ICONS = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  chevronL: '<path d="M15 5l-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  heart: '<path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6C19 15.4 12 20 12 20Z"/>',
  comment: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
  eyeOff: '<path d="M3 3l18 18M10.6 6.3A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.2 2.8M6.5 7.9C4.2 9.4 3 12 3 12s4 6 9 6c1.4 0 2.7-.4 3.8-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  eye: '<path d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.6"/>',
  camera: '<path d="M4 8h3l1.4-2h7.2L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8Z"/><circle cx="12" cy="13.4" r="3.2"/>',
  torch: '<path d="M9 3h6v4l-1.4 2.2V21h-3.2V9.2L9 7V3Z"/><path d="M10.4 14h3.2"/>',
  phone: '<path d="M6.5 3.5 9 3l2 4-1.8 1.7a12 12 0 0 0 6.1 6.1L17 13l4 2-.5 2.5c-.3 1.6-1.7 2.6-3.2 2.2C10.6 18.4 5.6 13.4 4.3 6.7 3.9 5.2 4.9 3.8 6.5 3.5Z"/>',
  message: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  weather: '<path d="M7 18h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.4-1.2A4.6 4.6 0 0 0 7 18Z"/><path d="M12 3v2M4.5 6l1.4 1.4M19.5 6l-1.4 1.4"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  browser: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5S14.5 18 12 20.5C9.5 18 8.5 15 8.5 12S9.5 6 12 3.5Z"/>',
  train: '<rect x="5" y="3.5" width="14" height="14" rx="4"/><path d="M5 11h14M9 21l1.5-3M15 21l-1.5-3"/><circle cx="9" cy="14.5" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="14.5" r=".8" fill="currentColor" stroke="none"/>',
  food: '<path d="M5 10h14l-1.2 9.2a1.8 1.8 0 0 1-1.8 1.6H8a1.8 1.8 0 0 1-1.8-1.6L5 10Z"/><path d="M8 10V7a4 4 0 0 1 8 0v3M9 4l-1-2M15 4l1-2"/>',
  gallery: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><circle cx="9" cy="9.5" r="1.6"/><path d="m4 18 5.5-5.5 4 4 2.5-2.5L20 18"/>',
  arrowleft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  wechat: '<path d="M9.5 4C5.6 4 2.5 6.6 2.5 9.8c0 1.8 1 3.4 2.5 4.5l-.7 2.2 2.5-1.3c.8.2 1.7.3 2.6.3"/><path d="M15.5 8c3.2 0 5.8 2.2 5.8 4.9 0 1.5-.8 2.8-2 3.7l.6 1.9-2.2-1.1c-.7.2-1.4.3-2.2.3-3.2 0-5.8-2.2-5.8-4.9S12.3 8 15.5 8Z"/>',
  contact: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2M16 5.5a3 3 0 0 1 0 6M17.5 20c0-2-.7-3.7-1.8-4.8 2.8-.3 5 1.8 5 4.8"/>',
  discover: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  me: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6"/>',
  send: '<path d="M4 12 20 4l-4 16-4-6-8-2Z"/><path d="m12 14 8-10"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-5 4 4 2.5-2.5L20 18"/>',
  location: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  transfer: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
  voice: '<rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  play: '<path d="M7 4l13 8L7 20V4Z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
  prev: '<path d="M19 5v14L8 12l11-7Z" fill="currentColor" stroke="none"/><rect x="4" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none"/>',
  next: '<path d="M5 5v14l11-7L5 5Z" fill="currentColor" stroke="none"/><rect x="17.5" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none"/>',
  list: '<path d="M4 6h12M4 12h12M4 18h8"/><circle cx="19" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 4 2 5 2 5H4s2-1 2-5Z"/><path d="M10 18a2 2 0 0 0 4 0"/>',
  volume: '<path d="M4 10v4h3l4 3V7L7 10H4Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11"/>',
  trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  download: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v2h-4v6l-1 1-1-1v-6H7v-2l3-3-1-5Z"/>',
  check: '<path d="M5 12l5 5L20 6"/>',
  edit: '<path d="M4 20h4L20 8l-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
  qr: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4M8 13l8 4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3M9 20h6"/>',
  smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2l2.5 11h11L21 8H6"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/>',
  cake: '<path d="M4 20h16v-7H4v7Z"/><path d="M4 15c1.5 0 1.5 2 3 2s1.5-2 3-2 1.5 2 3 2 1.5-2 3-2 1.5 2 3 2M8 13V9M12 13V8M16 13V9"/><path d="M8 4v2M12 3v2M16 4v2"/>',
  gift: '<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 13h18M12 9v11M12 9c-2-4-6-3-6-1s4 1 6 1Zm0 0c2-4 6-3 6-1s-4 1-6 1Z"/>'
};
function icon(name, cls = '') {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ---------- 声音 ---------- */
let audioCtx = null;
function ding(kind = 'msg') {
  if (!state.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const notes = kind === 'send' ? [[660, .05], [880, .08]] : [[784, .07], [1046, .1]];
    notes.forEach((n, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = n[0];
      g.gain.setValueAtTime(0, t + i * .09);
      g.gain.linearRampToValueAtTime(.05, t + i * .09 + .015);
      g.gain.exponentialRampToValueAtTime(.0001, t + i * .09 + n[1]);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t + i * .09); o.stop(t + i * .09 + n[1] + .02);
    });
  } catch (e) { }
}

/* ---------- 通用 UI ---------- */
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
}

let bannerTimer = null;
function banner(opts) {
  const el = $('#banner');
  if (!el) return;
  if (!state.notify) return;
  const ava = opts.avatar === 'zeyu'
    ? '<img src="assets/avatar.jpg" alt="">'
    : opts.avatar === 'me'
      ? (state.myAvatar ? `<img src="${state.myAvatar}" alt="">` : `<div class="mono" style="font-family:var(--serif);font-size:17px;color:#fff;width:100%;height:100%;display:grid;place-items:center">${esc(Array.from(state.username || '梦')[0])}</div>`)
      : '<svg viewBox="0 0 24 24"><path d="M4.5 5.5h15v11h-9l-4 3v-3h-2v-11Z"/></svg>';
  el.innerHTML = `
    <div class="banner-ico">${ava}</div>
    <div class="banner-main">
      <div class="banner-top"><span>${esc(opts.app || '微信')}</span><span>现在</span></div>
      <div class="banner-title">${esc(opts.title || '')}</div>
      <div class="banner-body">${esc(opts.body || '')}</div>
    </div>
    <button class="banner-close" aria-label="关闭">${icon('close')}</button>`;
  el.classList.add('show');
  clearTimeout(bannerTimer);
  const hide = () => el.classList.remove('show');
  bannerTimer = setTimeout(hide, 4600);
  el.querySelector('.banner-close').onclick = (e) => { e.stopPropagation(); hide(); };
  el.onclick = () => { hide(); opts.onClick && opts.onClick(); };
  if (!locked) ding('msg');
}

function openSheet(html, cls = '') {
  closeSheet();
  const root = $('#sheetRoot');
  root.innerHTML = `<div class="overlay show" data-sheet-close></div><div class="sheet show ${cls}">${html}</div>`;
  root.querySelector('[data-sheet-close]').onclick = closeSheet;
  const c = root.querySelector('.sheet .sheet-close');
  if (c) c.onclick = closeSheet;
}
function closeSheet() { const r = $('#sheetRoot'); if (r) r.innerHTML = ''; }
function sheet(title, sub, body) {
  return `<div class="sheet-grip"></div><button class="sheet-close">${icon('close')}</button><h3>${title}</h3>${sub ? `<div class="sub">${sub}</div>` : ''}<div class="sheet-body">${body}</div>`;
}

function openModal(html) {
  const root = $('#modalRoot');
  root.innerHTML = `<div class="modal-wrap show"><div class="modal">${html}</div></div>`;
  const wrap = root.firstElementChild;
  wrap.onclick = (e) => { if (e.target === wrap) closeModal(); };
}
function closeModal() { const r = $('#modalRoot'); if (r) r.innerHTML = ''; }
function modal(title, body, acts = '') {
  return `<h3>${title}</h3>${body || ''}${acts ? `<div class="modal-acts">${acts}</div>` : ''}`;
}

/* ---------- 时间 ---------- */
function daysToNewYear() {
  const now = new Date();
  const target = new Date(now.getFullYear() + 1, 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(1, Math.round((target - today) / 86400000));
}
function cnWeek(d) { return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]; }
function dateCN(d) { return `${d.getMonth() + 1}月${d.getDate()}日`; }
function fullDateCN(d) { return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`; }

function tick() {
  const now = new Date();
  const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const days = daysToNewYear();
  ['#sbTime', '#lockTime', '#homeTime', '#passTime'].forEach((s) => { const el = $(s); if (el) el.textContent = hm; });
  const lockDate = $('#lockDate'); if (lockDate) lockDate.textContent = `${dateCN(now)} ${cnWeek(now)}`;
  const homeDate = $('#homeDate'); if (homeDate) homeDate.textContent = `${dateCN(now)} ${cnWeek(now)}`;
  const cd = $('#cdDays'); if (cd) cd.textContent = days;
  const homeCd = $('#homeCd');
  if (homeCd) homeCd.innerHTML = `<span class="mini-heart">♡</span><span>元旦 · <b>${days}</b> 天</span>`;
  const calCd = $('#calCd'); if (calCd) calCd.textContent = days;
}

/* ---------- 天气 ---------- */
const WMO = {
  0: ['晴', '☀️'], 1: ['晴间多云', '🌤️'], 2: ['多云', '⛅'], 3: ['阴', '☁️'],
  45: ['有雾', '🌫️'], 48: ['雾凇', '🌫️'], 51: ['毛毛雨', '🌦️'], 53: ['小雨', '🌦️'], 55: ['细雨', '🌧️'],
  61: ['小雨', '🌧️'], 63: ['中雨', '🌧️'], 65: ['大雨', '⛈️'], 71: ['小雪', '🌨️'], 73: ['中雪', '❄️'], 75: ['大雪', '❄️'],
  77: ['雪粒', '🌨️'], 80: ['阵雨', '🌦️'], 81: ['阵雨', '🌧️'], 82: ['强阵雨', '⛈️'], 85: ['阵雪', '🌨️'], 86: ['强阵雪', '❄️'],
  95: ['雷阵雨', '⛈️'], 96: ['雷阵雨伴冰雹', '⛈️'], 99: ['强雷暴', '⛈️']
};
let weatherData = null;
let weatherLoading = false;

function weatherInfo(code) { return WMO[code] || ['多云', '⛅']; }

function applyWeatherChips() {
  if (!weatherData) return;
  const w = weatherData;
  const lockW = $('#lockWeather');
  if (lockW) lockW.textContent = `${w.city} · ${w.cond}`;
  const lockT = $('#lockTemp');
  if (lockT) lockT.textContent = `${Math.round(w.temp)}°`;
  const homeW = $('#homeWeather');
  if (homeW) homeW.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.4-1.2A4.6 4.6 0 0 0 7 18Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>${esc(w.city)} ${Math.round(w.temp)}°</span>`;
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no geo'));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
  });
}

async function loadWeather(force = false) {
  if (weatherLoading) return;
  if (weatherData && !force) { applyWeatherChips(); return; }
  weatherLoading = true;
  try {
    let lat = 45.8038, lon = 126.5349, city = '哈尔滨', fallback = true;
    try {
      const pos = await getPosition();
      lat = pos.coords.latitude; lon = pos.coords.longitude; fallback = false;
      try {
        const geo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`).then((r) => r.json());
        city = geo.city || geo.locality || geo.principalSubdivision || '你的位置';
      } catch (e) { city = '你的位置'; }
    } catch (e) { /* 定位失败，默认哈尔滨 */ }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    const data = await fetch(url).then((r) => r.json());
    const c = data.current || {};
    weatherData = {
      city, fallback, lat, lon,
      temp: c.temperature_2m ?? 3,
      feels: c.apparent_temperature ?? 1,
      humidity: c.relative_humidity_2m ?? 45,
      wind: c.wind_speed_10m ?? 8,
      code: c.weather_code ?? 2,
      cond: weatherInfo(c.weather_code)[1],
      daily: (data.daily && data.daily.time || []).map((t, i) => ({
        date: t, max: data.daily.temperature_2m_max[i], min: data.daily.temperature_2m_min[i], code: data.daily.weather_code[i]
      })),
      hourly: (data.hourly && data.hourly.time || []).map((t, i) => ({ time: t, temp: data.hourly.temperature_2m[i], code: data.hourly.weather_code[i] }))
    };
    applyWeatherChips();
    if (currentApp === 'weather' && APP_DEFS.weather && APP_DEFS.weather.refresh) APP_DEFS.weather.refresh();
    if (currentApp === 'train' && typeof renderTrain === 'function') renderTrain();
  } catch (e) {
    weatherData = {
      city: '哈尔滨', fallback: true, temp: -6, feels: -10, humidity: 58, wind: 12, code: 71,
      cond: '小雪',
      daily: [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const d = new Date(Date.now() + i * 86400000);
        return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, max: [-4, -3, -5, -2, 0, 1, -1][i], min: [-11, -10, -13, -9, -7, -6, -8][i], code: [71, 3, 71, 1, 0, 2, 71][i] };
      }),
      hourly: Array.from({ length: 24 }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() + i, 0, 0, 0);
        return {
          time: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`,
          temp: -6 + Math.round(Math.sin(i) * 3),
          code: i % 4 === 0 ? 71 : 3
        };
      })
    };
    applyWeatherChips();
    if (currentApp === 'weather' && APP_DEFS.weather && APP_DEFS.weather.refresh) APP_DEFS.weather.refresh();
    if (currentApp === 'train' && typeof renderTrain === 'function') renderTrain();
  }
  weatherLoading = false;
}

/* ---------- 未读 / 备注 ---------- */
function totalUnread() {
  return Object.entries(state.unread).reduce((n, [k, v]) => n + (k === 'zeyu' ? 0 : v || 0), 0);
}
function applyWallpaper() {
  const wall = `url("${state.wallpaper}")`;
  document.documentElement.style.setProperty('--home-wall', wall);
  const lockBg = $('.lock-bg');
  if (lockBg) lockBg.style.backgroundImage = wall;
}
function myAvatarHTML(cls = '') {
  if (state.myAvatar) return `<img src="${state.myAvatar}" alt="">`;
  const ch = Array.from(state.username || '梦')[0] || '梦';
  return `<div class="mono" style="width:100%;height:100%;display:grid;place-items:center;font-family:var(--serif);font-size:19px;color:#fff;background:linear-gradient(135deg,#a8bf8d,#6f8f52)">${esc(ch)}</div>`;
}
