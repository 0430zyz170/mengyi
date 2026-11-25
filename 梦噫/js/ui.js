/* ============ 梦噫 · 界面与路由 ============ */
'use strict';

let locked = true;
let currentApp = null;
let currentParams = {};
let pendingAfterUnlock = null;
let proactiveStarted = false;
let birthdayFired = false;
const APP_DEFS = {};

const HOME_APPS = [
  { id: 'wechat', name: '微信', icon: 'wechat', bg: 'linear-gradient(135deg,#41d478,#0fa957)' },
  { id: 'phone', name: '电话', icon: 'phone', bg: 'linear-gradient(135deg,#63d795,#1c9c5c)' },
  { id: 'messages', name: '信息', icon: 'message', bg: 'linear-gradient(135deg,#74c9f7,#2f8fe0)' },
  { id: 'calendar', name: '日历', icon: 'calendar', bg: 'linear-gradient(135deg,#fffdf8,#eae3d3)', fg: '#b3655c', custom: true },
  { id: 'weather', name: '天气', icon: 'weather', bg: 'linear-gradient(135deg,#93cbea,#4b8dc2)' },
  { id: 'music', name: '音乐', icon: 'music', bg: 'linear-gradient(135deg,#f4a3a0,#cf6464)' },
  { id: 'browser', name: '浏览器', icon: 'browser', bg: 'linear-gradient(135deg,#84aee8,#3d6cc0)' },
  { id: 'train', name: '铁路12306', icon: 'train', bg: 'linear-gradient(135deg,#6ea6e2,#2c68b0)' },
  { id: 'food', name: '美团', icon: 'food', bg: 'linear-gradient(135deg,#f8d66d,#e3a51f)', fg: '#6b4b13' },
  { id: 'gallery', name: '图库', icon: 'gallery', bg: 'linear-gradient(135deg,#e8b0a4,#a5bed8)' },
  { id: 'camera', name: '人生四格', icon: 'camera', bg: 'linear-gradient(135deg,#53624a,#232c1e)' },
  { id: 'settings', name: '设置', icon: 'settings', bg: 'linear-gradient(135deg,#c1c5bc,#7c8377)' }
];
const DOCK_APPS = ['phone', 'wechat', 'camera', 'gallery'];

function setStatusBar(mode) { $('#screen').dataset.status = mode; }

function appUnread(id) {
  if (id === 'wechat') return totalUnread();
  return 0;
}

function renderHome() {
  const grid = $('#appGrid');
  if (!grid) return;
  grid.innerHTML = HOME_APPS.map((a) => {
    const fg = a.fg || '#fff';
    const badge = appUnread(a.id);
    return `<button class="app-item" data-open="${a.id}">
      <span class="app-ico" style="background:${a.bg};color:${fg}">
        ${a.custom ? `<span style="font-family:var(--serif);font-size:22px;color:#b3655c;font-weight:600">${new Date().getDate()}</span>` : icon(a.icon)}
        ${badge ? `<i class="badge">${badge > 99 ? '99+' : badge}</i>` : ''}
      </span>
      <span class="app-name">${a.name}</span>
    </button>`;
  }).join('');
  const dock = $('#dock');
  if (dock) {
    dock.innerHTML = DOCK_APPS.map((id) => {
      const a = HOME_APPS.find((x) => x.id === id);
      const badge = appUnread(id);
      return `<button class="app-item" data-open="${a.id}">
        <span class="app-ico" style="background:${a.bg};color:${a.fg || '#fff'}">${icon(a.icon)}
        ${badge ? `<i class="badge">${badge > 99 ? '99+' : badge}</i>` : ''}</span>
        <span class="app-name">${a.name}</span>
      </button>`;
    }).join('');
  }
  applyWallpaper();
}

function renderLockNotes() {
  const box = $('#lockNotes');
  if (!box) return;
  const notes = [];
  const zNew = state.unread.zeyu || 0;
  if (zNew > 0) {
    const last = [...state.chat].reverse().find((m) => m.from === 'him' && (m.text || m.type));
    const text = last ? (last.type === 'image' ? '[图片] ' + (last.text || '') : last.type === 'transfer' ? `[转账] ${last.amount}` : last.type === 'voice' ? '[语音]' : last.type === 'location' ? `[位置] ${last.place}` : last.text) : '给我回个话。';
    notes.push({ ico: 'wx-avatar', who: 'zeyu', app: '微信', title: '张泽禹', body: text, time: '刚刚' });
  }
  if (state.unread.mom) {
    notes.push({ ico: 'mom', app: '微信', title: '妈妈', body: '降温了，穿秋裤没？', time: '12:03' });
  }
  if (state.unread.family) {
    notes.push({ ico: 'fam', app: '相亲相爱一家人', title: '妈妈', body: '元旦回来不？我跟你爸包酸菜馅饺子。', time: '12:06' });
  }
  notes.push({ app: '日历', title: '距离元旦', body: `还有 ${daysToNewYear()} 天，想和他一起跨年。`, time: '今天', cal: true });
  box.innerHTML = notes.slice(0, 3).map((n) => {
    const ico = n.ico === 'wx-avatar'
      ? `<div class="note-ico"><img src="assets/avatar.jpg" alt=""></div>`
      : n.cal ? `<div class="note-ico cal">${icon('calendar')}</div>`
        : `<div class="note-ico mom">${icon('message')}</div>`;
    return `<div class="note">${ico}<div class="note-main">
      <div class="note-top"><span>${esc(n.app)}</span><span>${esc(n.time)}</span></div>
      <div class="note-title">${esc(n.title)}</div>
      <div class="note-body">${esc(n.body)}</div>
    </div></div>`;
  }).join('');
}

/* ---------- 锁屏 / 解锁 ---------- */
function initLock() {
  const lock = $('#lock');
  let startY = null;
  lock.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-lockact]')) return;
    startY = e.clientY;
  });
  lock.addEventListener('pointerup', (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    startY = null;
    if (dy < -66) openPasscode();
  });
  lock.addEventListener('pointercancel', () => { startY = null; });

  $$('[data-lockact]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = b.dataset.lockact;
      if (act === 'torch') toggleTorch();
      else { pendingAfterUnlock = 'camera'; openPasscode(); toast('先解锁，再拍照呀'); }
    });
  });

  $('#swipeHint').addEventListener('click', () => openPasscode());
  $('#torchOff').addEventListener('click', () => toggleTorch(false));
  $('#torchOverlay').addEventListener('click', () => toggleTorch(false));

  $('#keypad').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const k = b.dataset.key;
    if (k === 'cancel') { closePasscode(); return; }
    if (k === 'del') { pinBuf = pinBuf.slice(0, -1); renderDots(); return; }
    if (pinBuf.length >= 4) return;
    pinBuf += k;
    renderDots();
    ding('send');
    if (pinBuf.length === 4) setTimeout(checkPin, 150);
  });
  const passCancel = $('#passCancel');
  if (passCancel) passCancel.addEventListener('click', closePasscode);

  document.addEventListener('keydown', (e) => {
    if (!$('#passcode').classList.contains('show')) return;
    if (/^\d$/.test(e.key)) {
      if (pinBuf.length >= 4) return;
      pinBuf += e.key; renderDots(); ding('send');
      if (pinBuf.length === 4) setTimeout(checkPin, 150);
    } else if (e.key === 'Backspace') { pinBuf = pinBuf.slice(0, -1); renderDots(); }
    else if (e.key === 'Escape') closePasscode();
  });
}

let pinBuf = '';
function renderDots() {
  $$('#passDots i').forEach((el, i) => el.classList.toggle('on', i < pinBuf.length));
  const err = $('#passErr'); if (err) err.textContent = '';
}
function openPasscode() {
  pinBuf = ''; renderDots();
  $('#passTime').textContent = $('#lockTime').textContent;
  $('#passcode').classList.add('show');
}
function closePasscode() {
  pinBuf = '';
  $('#passcode').classList.remove('show');
  pendingAfterUnlock = null;
}
function checkPin() {
  if (pinBuf === (state.pin || '0430')) { unlock(); return; }
  const wrap = $('.pass-wrap');
  wrap.classList.add('shake');
  $('#passErr').textContent = '密码不对，再想想我们的日子';
  setTimeout(() => wrap.classList.remove('shake'), 500);
  pinBuf = '';
  setTimeout(renderDots, 420);
}
function unlock() {
  locked = false;
  pinBuf = '';
  $('#passcode').classList.remove('show');
  $('#lock').classList.remove('show');
  $('#home').classList.add('show');
  setStatusBar('light');
  ding('msg');
  renderHome();
  state.unread.zeyu = 0;
  save();
  renderLockNotes();
  const app = pendingAfterUnlock;
  pendingAfterUnlock = null;
  if (app) setTimeout(() => openApp(app), 360);
  startProactive();
  setTimeout(maybeBirthday, 3200);
}
function toggleTorch(force) {
  const on = force === undefined ? !$('#torchOverlay').classList.contains('show') : force;
  $('#torchOverlay').classList.toggle('show', on);
  const btn = $('[data-lockact="torch"]');
  if (btn) btn.classList.toggle('active', on);
}

/* ---------- 路由 ---------- */
function openApp(id, params = {}) {
  const def = APP_DEFS[id];
  if (!def) { toast('这个应用还在路上'); return; }
  const prev = currentApp && APP_DEFS[currentApp];
  if (prev && prev.unmount) prev.unmount();
  closeSheet(); closeModal();
  currentApp = id;
  currentParams = params;
  const content = $('#appContent');
  content.innerHTML = def.render ? def.render(params) : '';
  $('#app').classList.add('show');
  setStatusBar(def.darkUI ? 'light' : 'dark');
  if (def.mount) def.mount(params);
  const body = content.querySelector('.app-body');
  if (body) body.scrollTop = 0;
  renderHome();
}
function closeApp() {
  const def = currentApp && APP_DEFS[currentApp];
  if (def && def.unmount) def.unmount();
  $('#app').classList.remove('show');
  $('#appContent').innerHTML = '';
  currentApp = null;
  currentParams = {};
  setStatusBar('light');
  renderHome();
  renderLockNotes();
}
function appBack() {
  const def = currentApp && APP_DEFS[currentApp];
  if (def && def.back && def.back()) return;
  if (currentApp) closeApp();
}

/* ---------- 新消息 ---------- */
function isInChatWithZeyu() {
  return currentApp === 'wechat' && typeof WX !== 'undefined' && WX.isChatting && WX.isChatting();
}
function pushHimMessage(text, opts = {}) {
  const now = new Date();
  const msg = Object.assign({
    from: 'him', type: 'text', text,
    at: `${pad(now.getHours())}:${pad(now.getMinutes())}`
  }, opts);
  state.chat.push(msg);
  if (msg.type === 'text') msg.text = text;
  if (!isInChatWithZeyu()) {
    state.unread.zeyu = (state.unread.zeyu || 0) + 1;
  }
  save();
  renderLockNotes();
  renderHome();
  if (typeof WX !== 'undefined' && WX.onNewMessage) WX.onNewMessage(msg);
  if (!locked && !isInChatWithZeyu()) {
    banner({
      app: '微信', title: '张泽禹', avatar: 'zeyu',
      body: msg.type === 'image' ? '[图片] ' + (msg.text || '') : msg.type === 'transfer' ? `[转账] ${msg.amount}` : msg.text,
      onClick: () => { state.unread.zeyu = 0; openApp('wechat', { chat: 'zeyu' }); }
    });
  }
}
function startProactive() {
  if (proactiveStarted) return;
  proactiveStarted = true;
  let last = -1;
  setInterval(() => {
    if (locked || document.hidden) return;
    let i = Math.floor(Math.random() * D.proactive.length);
    if (i === last) i = (i + 1) % D.proactive.length;
    last = i;
    pushHimMessage(D.proactive[i]);
  }, 105000);
}
function maybeBirthday() {
  if (birthdayFired) return;
  const now = new Date();
  const md = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  if (md !== state.birthday) return;
  birthdayFired = true;
  pushHimMessage('生日快乐我的小乖，天天开心。', { birthday: true });
  setTimeout(() => {
    banner({ app: '微信', title: '张泽禹', avatar: 'zeyu', body: '生日快乐我的小乖，天天开心。' });
    openModal(modal('生日快乐', `<div class="bday-card"><div class="cake">🎂</div><h2>生日快乐，${esc(petName())}</h2><p>今天你最大。许个愿吧，剩下的交给我。</p><div class="bday-msg">生日快乐我的小乖，天天开心。<br>—— 张泽禹</div></div>`, `<button class="btn btn-ghost" data-close-modal>收下啦</button>`));
    bindModalClosers();
  }, 900);
}
function sendBirthdayWish() {
  pushHimMessage('生日快乐我的小乖，天天开心。', { birthday: true });
  banner({ app: '微信', title: '张泽禹', avatar: 'zeyu', body: '生日快乐我的小乖，天天开心。' });
  toast('他把祝福发给你了');
}

function bindModalClosers() {
  $$('[data-close-modal]').forEach((b) => { b.onclick = closeModal; });
}

/* ---------- 全局事件 ---------- */
function initGlobalUI() {
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) { openApp(open.dataset.open); return; }
    const back = e.target.closest('[data-back]');
    if (back) { appBack(); return; }
    const closer = e.target.closest('[data-close-modal]');
    if (closer) closeModal();
  });
  $('#homeWeather').addEventListener('click', () => openApp('weather'));
  $('#homeCd').addEventListener('click', () => openApp('calendar'));
  $('#gesturebar').addEventListener('click', () => { if (currentApp) appBack(); });
  $('#torchOverlay').addEventListener('click', () => toggleTorch(false));
}
