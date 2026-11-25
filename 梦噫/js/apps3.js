/* ============ 图库 · 人生四格 · 电话 · 信息 · 设置 ============ */
'use strict';

/* ================= 图库 ================= */
const GAL = { cat: '全部', idx: -1 };

function allGallery() {
  const custom = (state.customPhotos || []).map((p) => ({ ...p, custom: true }));
  return [...custom, ...D.gallery];
}
function galleryList() {
  const all = allGallery();
  return GAL.cat === '全部' ? all : all.filter((g) => g.cat === GAL.cat);
}
function galleryHTML() {
  const cats = ['全部', '他', '我们', '生活', '四格'];
  const list = galleryList();
  return `<div class="app gallery-app">
    ${appbar('图库', `<button class="ab-btn" data-gal="camera">${icon('camera')}</button>`)}
    <div class="app-body" style="padding-bottom:0">
      <div class="g-tabs">
        ${cats.map((c) => `<button class="${GAL.cat === c ? 'on' : ''}" data-gal-cat="${c}">${c}</button>`).join('')}
      </div>
      <div class="g-grid">
        ${list.map((g, i) => `<button class="g-item" data-gi="${i}">
          <img src="${g.src}" alt="${esc(g.cap || '')}">
          <span class="cap">${esc(g.cap || '')}</span>
        </button>`).join('')}
      </div>
    </div>
    <div class="g-viewer" id="gViewer">
      <div class="gv-head">
        <button class="ab-btn" data-gal="gvclose">${icon('back')}</button>
        <span class="t" id="gvIndex"></span>
      </div>
      <div class="gv-body" id="gvBody"><img id="gvImg" src="" alt=""></div>
      <div class="gv-foot">
        <div class="gv-cap" id="gvCap"></div>
        <div class="gv-date" id="gvDate"></div>
        <div class="gv-acts">
          <button data-gal="gvshare">${icon('share')}分享给他</button>
          <button data-gal="gvlike" id="gvLike">${icon('heart')}喜欢</button>
          <button data-gal="gvsave">${icon('download')}保存</button>
        </div>
      </div>
    </div>
  </div>`;
}
function bindGallery() {
  $$('[data-gal-cat]').forEach((b) => {
    b.onclick = () => { GAL.cat = b.dataset.galCat; GAL.idx = -1; refreshApp(galleryHTML, bindGallery); };
  });
  $$('[data-gi]').forEach((b) => {
    b.onclick = () => openGalleryViewer(+b.dataset.gi);
  });
  const acts = { gvclose: closeGalleryViewer, gvshare: shareGalleryToHim, gvlike: likeGalleryPhoto, gvsave: saveGalleryPhoto };
  $$('[data-gal]').forEach((b) => {
    const fn = acts[b.dataset.gal];
    if (fn) b.onclick = fn;
    else if (b.dataset.gal === 'camera') b.onclick = () => openApp('camera');
  });
  const body = $('#gvBody');
  if (body) {
    body.onclick = (e) => {
      const list = galleryList();
      if (!list.length) return;
      const r = body.getBoundingClientRect();
      const next = e.clientX - r.left > r.width / 2;
      stepGallery(next ? 1 : -1);
    };
  }
}
function galleryCurrent() { return galleryList()[GAL.idx] || null; }
function openGalleryViewer(i) {
  GAL.idx = i;
  paintGalleryViewer();
  const v = $('#gViewer');
  if (v) v.classList.add('show');
}
function closeGalleryViewer() {
  const v = $('#gViewer');
  if (v) v.classList.remove('show');
  GAL.idx = -1;
}
function stepGallery(dir) {
  const list = galleryList();
  if (!list.length) return;
  GAL.idx = (GAL.idx + dir + list.length) % list.length;
  paintGalleryViewer();
}
function paintGalleryViewer() {
  const g = galleryCurrent();
  if (!g) return;
  const list = galleryList();
  $('#gvImg').src = g.src;
  $('#gvCap').textContent = g.cap || '';
  $('#gvDate').textContent = `${g.date || ''} · ${g.cat || ''}`;
  $('#gvIndex').textContent = `${GAL.idx + 1} / ${list.length}`;
  const liked = (state.galleryLikes || []).includes(g.src);
  const likeBtn = $('#gvLike');
  if (likeBtn) {
    likeBtn.classList.toggle('liked', liked);
    likeBtn.innerHTML = `${icon('heart')}${liked ? '已喜欢' : '喜欢'}`;
  }
}
function likeGalleryPhoto() {
  const g = galleryCurrent();
  if (!g) return;
  const arr = state.galleryLikes || [];
  const i = arr.indexOf(g.src);
  if (i >= 0) arr.splice(i, 1); else arr.push(g.src);
  state.galleryLikes = arr;
  save();
  paintGalleryViewer();
  ding('send');
}
function shareGalleryToHim() {
  const g = galleryCurrent();
  if (!g) return;
  const now = new Date();
  state.chat.push({ from: 'me', type: 'image', img: g.src, text: g.cap || '', at: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
  save();
  ding('send');
  toast('发给他了');
  setTimeout(() => pushHimMessage('这张好看。发我原图，我存起来。'), 1500);
}
function saveGalleryPhoto() {
  const g = galleryCurrent();
  if (!g) return;
  downloadFile(g.src, `梦噫-${g.cap || '照片'}.jpg`);
  toast('已保存到相册');
}
function downloadFile(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
APP_DEFS.gallery = {
  darkUI: true,
  render() { return galleryHTML(); },
  mount() { bindGallery(); },
  back() {
    if ($('#gViewer') && $('#gViewer').classList.contains('show')) { closeGalleryViewer(); return true; }
    return false;
  }
};

/* ================= 人生四格 ================= */
const CAM = {
  shots: [], frame: 0, label: '', result: '', stream: null,
  noCam: false, busy: false, timer: null
};
const CAM_FRAMES = [
  { id: 'cream', color: '#f6f1e4', fg: '#5c5346', dot: 'linear-gradient(135deg,#fdfbf4,#e8e0cd)' },
  { id: 'white', color: '#ffffff', fg: '#333333', dot: 'linear-gradient(135deg,#fff,#eee)' },
  { id: 'black', color: '#161616', fg: '#f2eee4', dot: 'linear-gradient(135deg,#333,#111)' },
  { id: 'green', color: '#5c7a48', fg: '#f3f7ec', dot: 'linear-gradient(135deg,#7f9e63,#3d5533)' },
  { id: 'pink', color: '#f3ded9', fg: '#8a5e57', dot: 'linear-gradient(135deg,#fbeae6,#e7c4bd)' }
];
function todayDot() {
  const d = new Date();
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}
function cameraHTML() {
  const f = CAM_FRAMES[CAM.frame];
  return `<div class="app cam-app">
    ${appbar('人生四格', `<button class="ab-btn" data-cam="gallery">${icon('gallery')}</button>`)}
    <div class="app-body" style="padding-bottom:0">
      ${CAM.result ? `<div class="cam-result"><img src="${CAM.result}" alt="人生四格"></div>
        <div class="cam-result-acts">
          <button class="btn" data-cam="retake">${icon('refresh')} 重拍</button>
          <button class="btn" data-cam="savegal">${icon('gallery')} 存图库</button>
          <button class="btn btn-primary" data-cam="export">${icon('download')} 导出整张</button>
        </div>
        <div class="cam-hint">长按图片也可以保存到相册<br>${esc(CAM.label || '梦噫 · 人生四格')} · ${todayDot()}</div>`
      : `<div class="cam-stage" id="camStage">
          <video id="camVideo" autoplay playsinline muted></video>
          <div class="noCam" id="camNoCam" style="display:none">
            ${icon('camera')}
            <div>没有拿到摄像头<br>先用照片陪你拍完这四格</div>
          </div>
          <div class="cam-count" id="camCount" style="display:none">3</div>
          <div class="cam-flash" id="camFlash"></div>
        </div>
        <div class="cam-shots" id="camShots">${camShotsHTML()}</div>
        <div class="cam-opts">
          <div class="cam-row">
            <span class="lbl">画框</span>
            <div class="cam-frames">
              ${CAM_FRAMES.map((x, i) => `<button class="cam-frame ${i === CAM.frame ? 'on' : ''}" data-frame="${i}"><i style="background:${x.dot}"></i></button>`).join('')}
            </div>
          </div>
          <div class="cam-row">
            <span class="lbl">文案</span>
            <input class="cam-input" id="camLabel" maxlength="18" placeholder="写一句话，印在照片下面" value="${esc(CAM.label)}">
          </div>
          <div class="cam-shoot">
            <button class="cam-shutter" id="camShutter" aria-label="拍照${CAM.shots.length >= 4 ? '，已完成' : ''}"><i></i></button>
          </div>
          <div class="cam-hint">${CAM.shots.length >= 4 ? '四格拍完啦，正在拼图…' : `第 ${CAM.shots.length + 1} / 4 张 · 点击快门`}<br>四张会拼成一整张，可以导出</div>
        </div>`}
    </div>
  </div>`;
}
function camShotsHTML() {
  return [0, 1, 2, 3].map((i) => `<span class="s">${CAM.shots[i] ? `<img src="${CAM.shots[i]}" alt="">` : ''}</span>`).join('');
}
function bindCamera() {
  const shutter = $('#camShutter');
  if (shutter) shutter.onclick = takeShot;
  const label = $('#camLabel');
  if (label) label.oninput = () => { CAM.label = label.value; };
  $$('[data-frame]').forEach((b) => {
    b.onclick = () => {
      CAM.frame = +b.dataset.frame;
      $$('[data-frame]').forEach((x) => x.classList.toggle('on', x === b));
      if (CAM.result) { CAM.result = ''; buildStripResult(); }
    };
  });
  $$('[data-cam]').forEach((b) => {
    const a = b.dataset.cam;
    if (a === 'gallery') b.onclick = () => openApp('gallery');
    else if (a === 'retake') b.onclick = retakeCamera;
    else if (a === 'export') b.onclick = () => { downloadFile(CAM.result, `人生四格-${todayDot()}.jpg`); toast('已导出整张四格'); };
    else if (a === 'savegal') b.onclick = saveStripToGallery;
  });
}
function startCameraStream() {
  if (CAM.stream) { attachStream(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { camFallback(); return; }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 960, height: 1280 }, audio: false })
    .then((s) => { CAM.stream = s; attachStream(); })
    .catch(() => camFallback());
}
function attachStream() {
  const v = $('#camVideo');
  if (v && CAM.stream) {
    v.style.display = '';
    v.srcObject = CAM.stream;
    v.play && v.play().catch(() => {});
    const ph = $('#camStage .ph'); if (ph) ph.remove();
  }
}
function camFallback() {
  CAM.noCam = true;
  const v = $('#camVideo'); if (v) v.style.display = 'none';
  const box = $('#camNoCam'); if (box) box.style.display = 'flex';
  const stage = $('#camStage');
  if (stage && !stage.querySelector('.ph')) {
    const img = document.createElement('img');
    img.className = 'ph';
    img.src = ['assets/g2.jpg', 'assets/g6.jpg', 'assets/g11.jpg', 'assets/moment-like.jpg'][CAM.shots.length % 4];
    stage.insertBefore(img, stage.firstChild);
  }
}
function stopCameraStream() {
  if (CAM.stream) {
    CAM.stream.getTracks().forEach((t) => t.stop());
    CAM.stream = null;
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function takeShot() {
  if (CAM.busy || CAM.shots.length >= 4 || CAM.result) return;
  CAM.busy = true;
  const btn = $('#camShutter'); if (btn) btn.disabled = true;
  const count = $('#camCount');
  if (count) count.style.display = 'grid';
  for (let n = 3; n >= 1; n--) {
    if (count) count.textContent = n;
    await sleep(430);
  }
  if (count) count.style.display = 'none';
  const flash = $('#camFlash');
  if (flash) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
  let data;
  const video = $('#camVideo');
  if (CAM.stream && video && video.videoWidth) data = grabVideoFrame(video);
  else data = await grabFallbackFrame(CAM.shots.length);
  if (!data) { CAM.busy = false; if (btn) btn.disabled = false; return; }
  CAM.shots.push(data);
  const shots = $('#camShots'); if (shots) shots.innerHTML = camShotsHTML();
  const hint = $('#appContent .cam-hint');
  if (hint && CAM.shots.length < 4) hint.innerHTML = `第 ${CAM.shots.length + 1} / 4 张 · 点击快门<br>四张会拼成一整张，可以导出`;
  if (CAM.shots.length >= 4) {
    setTimeout(buildStripResult, 240);
  } else {
    CAM.busy = false;
    if (btn) btn.disabled = false;
  }
}
function grabVideoFrame(video) {
  const w = 540, h = 720;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const vw = video.videoWidth, vh = video.videoHeight;
  const scale = Math.max(w / vw, h / vh);
  ctx.translate(w, 0); ctx.scale(-1, 1);
  ctx.drawImage(video, (w - vw * scale) / 2, (h - vh * scale) / 2, vw * scale, vh * scale);
  return c.toDataURL('image/jpeg', .84);
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function grabFallbackFrame(i) {
  const pool = ['assets/g2.jpg', 'assets/g6.jpg', 'assets/g11.jpg', 'assets/moment-like.jpg', 'assets/g1.jpg', 'assets/g7.jpg'];
  const src = pool[i % pool.length];
  try {
    const img = await loadImage(src);
    const w = 540, h = 720;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const scale = Math.max(w / img.width, h / img.height);
    ctx.drawImage(img, (w - img.width * scale) / 2, (h - img.height * scale) / 2, img.width * scale, img.height * scale);
    return c.toDataURL('image/jpeg', .84);
  } catch (e) { return null; }
}
async function buildStripResult() {
  const frame = CAM_FRAMES[CAM.frame];
  const W = 720, PAD = 30, GAP = 12, HEAD = 74, FOOT = 80;
  const cellW = (W - PAD * 2 - GAP) / 2;
  const cellH = Math.round(cellW * 1.24);
  const H = PAD + HEAD + cellH * 2 + GAP + FOOT + PAD;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = frame.color;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = frame.fg;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = '600 20px "Songti SC","Noto Serif SC",serif';
  ctx.fillText('DREAMYI', PAD, PAD + 22);
  ctx.font = '16px "Songti SC","Noto Serif SC",serif';
  ctx.textAlign = 'right';
  ctx.fillText(todayDot(), W - PAD, PAD + 22);
  ctx.globalAlpha = .25;
  ctx.fillRect(PAD, PAD + 40, W - PAD * 2, 1);
  ctx.globalAlpha = 1;

  const top = PAD + HEAD;
  const images = await Promise.all(CAM.shots.map((s) => loadImage(s).catch(() => null)));
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (cellW + GAP);
    const y = top + row * (cellH + GAP);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, cellW, cellH);
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,.06)';
    ctx.fillRect(x, y, cellW, cellH);
    const im = images[i];
    if (im) {
      const scale = Math.max(cellW / im.width, cellH / im.height);
      ctx.drawImage(im, x + (cellW - im.width * scale) / 2, y + (cellH - im.height * scale) / 2, im.width * scale, im.height * scale);
    }
    ctx.restore();
  }

  ctx.fillStyle = frame.fg;
  ctx.textAlign = 'center';
  ctx.font = '26px "Songti SC","Noto Serif SC",serif';
  ctx.globalAlpha = .9;
  ctx.fillText(CAM.label || '和你在一起的四格', W / 2, H - PAD - FOOT / 2 + 2);
  ctx.globalAlpha = .55;
  ctx.font = '13px "Songti SC","Noto Serif SC",serif';
  ctx.fillText('梦噫 · 人生四格', W / 2, H - PAD - 14);
  ctx.globalAlpha = 1;

  CAM.result = c.toDataURL('image/jpeg', .92);
  CAM.busy = false;
  if (currentApp === 'camera') refreshApp(cameraHTML, bindCamera);
}
function retakeCamera() {
  CAM.shots = [];
  CAM.result = '';
  CAM.busy = false;
  refreshApp(cameraHTML, bindCamera);
  attachStream();
}
function saveStripToGallery() {
  if (!CAM.result) return;
  const photos = state.customPhotos || [];
  photos.unshift({ src: CAM.result, cap: CAM.label || '人生四格', date: todayDot(), cat: '四格' });
  state.customPhotos = photos.slice(0, 6);
  save();
  toast('已经放进图库啦');
  if (currentApp === 'camera') refreshApp(cameraHTML, bindCamera);
  attachStream();
}
APP_DEFS.camera = {
  darkUI: true,
  render() { return cameraHTML(); },
  mount() { bindCamera(); startCameraStream(); },
  unmount() { stopCameraStream(); },
  back() { return false; }
};

/* ================= 电话 ================= */
const CALL = { on: false, sec: 0, timer: null, tab: 'recent', muted: false, speaker: false };
function phoneHTML() {
  return `<div class="app phone-app">
    ${appbar('电话', `<button class="ab-btn" data-phone="add">${icon('plus')}</button>`)}
    <div class="app-body">
      <div class="tab-seg">
        <button class="${CALL.tab === 'recent' ? 'on' : ''}" data-phone-tab="recent">最近通话</button>
        <button class="${CALL.tab === 'contacts' ? 'on' : ''}" data-phone-tab="contacts">通讯录</button>
      </div>
      ${CALL.tab === 'recent' ? `<div class="call-row" data-call="zeyu">
          <div class="call-ava"><img src="assets/avatar.jpg" alt=""></div>
          <div class="call-main"><div class="call-name">Aaa.我最爱的宝宝</div><div class="call-no">138 0430 0430 · 昨天 22:14 · 未接来电</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div class="call-row" data-call="mom" style="margin-top:8px">
          <div class="call-ava"><div class="wx-avatar" style="width:46px;height:46px;border-radius:50%"><div class="mono">妈</div></div></div>
          <div class="call-main"><div class="call-name">妈妈</div><div class="call-no">昨天 12:03 · 通话 4 分 12 秒</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div class="call-row" data-call="dad" style="margin-top:8px">
          <div class="call-ava"><div class="wx-avatar" style="width:46px;height:46px;border-radius:50%"><div class="mono" style="background:linear-gradient(135deg,#9fb7c9,#6f8ba0)">爸</div></div></div>
          <div class="call-main"><div class="call-name">爸爸</div><div class="call-no">11月20日 · 通话 1 分 06 秒</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div style="text-align:center;font-size:9px;color:#b0b6a6;padding:26px 0">通话记录会替我们记得<br>他每次都是先挂的那一个</div>`
      : `<div class="call-row" data-call="zeyu">
          <div class="call-ava"><img src="assets/avatar.jpg" alt=""></div>
          <div class="call-main"><div class="call-name">Aaa.我最爱的宝宝</div><div class="call-no">138 0430 0430</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div class="call-row" data-call="mom" style="margin-top:8px">
          <div class="call-ava"><div class="wx-avatar" style="width:46px;height:46px;border-radius:50%"><div class="mono">妈</div></div></div>
          <div class="call-main"><div class="call-name">妈妈</div><div class="call-no">137 1234 5678</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div class="call-row" data-call="dad" style="margin-top:8px">
          <div class="call-ava"><div class="wx-avatar" style="width:46px;height:46px;border-radius:50%"><div class="mono" style="background:linear-gradient(135deg,#9fb7c9,#6f8ba0)">爸</div></div></div>
          <div class="call-main"><div class="call-name">爸爸</div><div class="call-no">136 8765 4321</div></div>
          <button class="call-btn">${icon('phone')}</button>
        </div>
        <div style="text-align:center;font-size:9px;color:#b0b6a6;padding:26px 0">通讯录里的人不多<br>最上面的那个，备注最长</div>`}
    </div>
    <div class="call-screen" id="callScreen"></div>
  </div>`;
}
function bindPhone() {
  $$('[data-phone-tab]').forEach((b) => {
    b.onclick = () => { CALL.tab = b.dataset.phoneTab; refreshApp(phoneHTML, bindPhone); };
  });
  $$('[data-call]').forEach((r) => {
    r.onclick = () => startCall(r.dataset.call);
  });
  const add = $('[data-phone="add"]');
  if (add) add.onclick = () => toast('通讯录已同步，暂无新号码');
}
function callMeta(id) {
  if (id === 'mom') return { name: '妈妈', num: '137 1234 5678', note: '妈妈' };
  if (id === 'dad') return { name: '爸爸', num: '136 8765 4321', note: '爸爸' };
  return { name: '张泽禹', num: '138 0430 0430', note: 'Aaa.我最爱的宝宝' };
}
function startCall(id) {
  const m = callMeta(id);
  CALL.on = true; CALL.sec = 0; CALL.muted = false; CALL.speaker = false;
  const screen = $('#callScreen');
  if (!screen) return;
  const lines = id === 'zeyu' ? D.callLines.slice(-4) : id === 'mom'
    ? [{ from: 'her', text: '降温了，秋裤穿上没？' }, { from: 'me', text: '穿了穿了。' }, { from: 'her', text: '别糊弄我。' }]
    : [{ from: 'him', text: '钱够不够花？' }, { from: 'me', text: '够的。' }, { from: 'him', text: '不够就说，别硬撑。' }];
  screen.innerHTML = `
    <div class="cs-status">正在通话</div>
    <div class="cs-ava">${id === 'zeyu' ? '<img src="assets/avatar.jpg" alt="">' : `<div class="wx-avatar" style="width:100%;height:100%;border-radius:50%"><div class="mono" style="font-size:38px">${id === 'mom' ? '妈' : '爸'}</div></div>`}</div>
    <div class="cs-name">${m.note}</div>
    <div class="cs-num">${m.num}</div>
    <div class="cs-chat">${lines.map((l) => `<div class="cs-line ${l.from === 'me' ? 'me' : ''}">${esc(l.text)}</div>`).join('')}</div>
    <div class="cs-timer" id="csTimer">00:00</div>
    <div class="cs-controls">
      <div class="cs-ctrl" id="csMute"><button>${icon('volume')}</button><span>静音</span></div>
      <div class="cs-ctrl" id="csSpeaker"><button>${icon('music')}</button><span>免提</span></div>
      <div class="cs-ctrl hang"><button data-call-end>${icon('phone')}</button><span>挂断</span></div>
    </div>`;
  requestAnimationFrame(() => screen.classList.add('show'));
  ding('msg');
  clearInterval(CALL.timer);
  CALL.timer = setInterval(() => {
    CALL.sec++;
    const t = $('#csTimer');
    if (t) t.textContent = `${pad(Math.floor(CALL.sec / 60))}:${pad(CALL.sec % 60)}`;
  }, 1000);
  $('#csMute').onclick = () => {
    CALL.muted = !CALL.muted;
    $('#csMute').classList.toggle('on', CALL.muted);
    toast(CALL.muted ? '已静音' : '已取消静音');
  };
  $('#csSpeaker').onclick = () => {
    CALL.speaker = !CALL.speaker;
    $('#csSpeaker').classList.toggle('on', CALL.speaker);
    toast(CALL.speaker ? '已开免提' : '已关免提');
  };
  $('[data-call-end]').onclick = endCall;
}
function endCall() {
  const screen = $('#callScreen');
  if (screen) screen.classList.remove('show');
  clearInterval(CALL.timer);
  CALL.timer = null;
  CALL.on = false;
  setTimeout(() => { if (screen && !CALL.on) screen.innerHTML = ''; }, 480);
}
APP_DEFS.phone = {
  darkUI: false,
  render() { return phoneHTML(); },
  mount() { bindPhone(); },
  unmount() { endCall(); clearInterval(CALL.timer); CALL.timer = null; },
  back() {
    if (CALL.on) { endCall(); return true; }
    return false;
  }
};

/* ================= 信息 ================= */
APP_DEFS.messages = {
  darkUI: false,
  render() {
    return `<div class="app messages-app">
      ${appbar('信息')}
      <div class="app-body" style="padding-bottom:0">
        <div class="msg-empty">
          <div class="empty-ico">${icon('message')}</div>
          <h3>没有新信息</h3>
          <p>该说的，都在微信里说了。<br>该藏的，也藏在 0430 里了。</p>
          <button class="btn btn-ghost" data-open="wechat">去微信看看</button>
        </div>
      </div>
    </div>`;
  },
  back() { return false; }
};

/* ================= 设置 ================= */
function settingsHTML() {
  const ava = state.myAvatar ? `<img src="${state.myAvatar}" alt="">` : myAvatarHTML();
  return `<div class="app settings-app">
    ${appbar('设置')}
    <div class="app-body">
      <div class="set-profile" data-set="avatar">
        <div class="set-ava">${ava}<span class="cam">${icon('camera')}</span></div>
        <div style="flex:1">
          <div class="set-name">${esc(state.username || '小梦')}</div>
          <div class="set-id">梦噫 ID：mengyi_0430 · 他对你的称呼「${esc(petName())}」</div>
        </div>
        <span class="chev">${icon('chevron')}</span>
      </div>

      <div class="set-group-title">账号</div>
      <div class="set-group">
        <div class="set-cell" data-set="name"><span class="ic">${icon('user')}</span><span class="lb">微信名</span><span class="val">${esc(state.username || '小梦')}</span><span class="chev">${icon('chevron')}</span></div>
        <div class="set-cell" data-set="pet"><span class="ic">${icon('heart')}</span><span class="lb">他对我的称呼<small>留空会自动生成</small></span><span class="val">${esc(petName())}</span><span class="chev">${icon('chevron')}</span></div>
        <div class="set-cell" data-set="reply"><span class="ic">${icon('edit')}</span><span class="lb">指定下一条回复<small>只生效一次</small></span><span class="val">${state.nextReply ? '已设置' : '未设置'}</span><span class="chev">${icon('chevron')}</span></div>
      </div>

      <div class="set-group-title">个性</div>
      <div class="set-group">
        <div class="set-cell" data-set="birthday"><span class="ic">${icon('cake')}</span><span class="lb">我的生日</span><span class="val">${esc(state.birthday || '10-16')}</span><span class="chev">${icon('chevron')}</span></div>
        <div class="set-cell" data-set="wallpaper"><span class="ic">${icon('image')}</span><span class="lb">桌面壁纸</span><span class="val">${String(state.wallpaper).startsWith('data:') ? '自定义' : '默认'}</span><span class="chev">${icon('chevron')}</span></div>
      </div>

      <div class="set-group-title">系统</div>
      <div class="set-group">
        <div class="set-cell" data-set="notify"><span class="ic">${icon('bell')}</span><span class="lb">消息通知</span><span class="switch ${state.notify ? 'on' : ''}" data-set-switch="notify"></span></div>
        <div class="set-cell" data-set="sound"><span class="ic">${icon('volume')}</span><span class="lb">提示音</span><span class="switch ${state.sound ? 'on' : ''}" data-set-switch="sound"></span></div>
        <div class="set-cell" data-set="clear"><span class="ic" style="background:#fbeeec;color:#c05e56">${icon('trash')}</span><span class="lb">清空全部数据<small>聊天、设置都会回到最初</small></span><span class="chev">${icon('chevron')}</span></div>
      </div>

      <div class="set-about">
        <b>梦噫</b>
        DREAMYI OS · Version 4.30<br>
        一部关于你的手机<br>
        所有消息都是假的，喜欢是真的
      </div>
    </div>
  </div>`;
}
function bindSettings() {
  $$('[data-set]').forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest('[data-set-switch]')) return;
      const a = el.dataset.set;
      if (a === 'avatar') setMyAvatarFromSettings();
      else if (a === 'name') setNameFromSettings();
      else if (a === 'pet' || a === 'reply') { openReplySettings(); }
      else if (a === 'birthday') openBirthdaySetting();
      else if (a === 'wallpaper') openWallpaperSheet();
      else if (a === 'clear') confirmClearData();
    };
  });
  $$('[data-set-switch]').forEach((sw) => {
    sw.onclick = (e) => {
      e.stopPropagation();
      const k = sw.dataset.setSwitch;
      state[k] = !state[k];
      save();
      sw.classList.toggle('on', !!state[k]);
      if (k === 'sound' && state[k]) ding('msg');
      if (k === 'notify') toast(state[k] ? '通知已开启' : '通知已关闭');
    };
  });
}
function setMyAvatarFromSettings() {
  chooseImageFile((data) => {
    state.myAvatar = data;
    save();
    renderHome();
    refreshApp(settingsHTML, bindSettings);
    toast('头像换好啦');
  });
}
function setNameFromSettings() {
  openModal(`<h3>修改微信名</h3><div class="field" style="margin-top:14px"><input id="setNewName" maxlength="12" value="${esc(state.username || '')}" placeholder="你的名字"></div><p style="font-size:9px;color:#a9b09f">他会根据这个名字，给你起一个专属昵称。</p><div class="modal-acts"><button class="btn btn-ghost" data-close-modal>取消</button><button class="btn btn-primary" id="setNameSave">保存</button></div>`);
  bindModalClosers();
  $('#setNameSave').onclick = () => {
    const v = $('#setNewName').value.trim();
    if (!v) { toast('总得有个名字呀'); return; }
    state.username = v;
    save();
    closeModal();
    renderHome();
    refreshApp(settingsHTML, bindSettings);
    toast('改好了，他会换个方式叫你');
  };
}
function openWallpaperSheet() {
  const walls = [
    { src: 'assets/lock.jpg', name: '花与少年' },
    { src: 'assets/moment-you.jpg', name: '有你' },
    { src: 'assets/g1.jpg', name: '路过的光' },
    { src: 'assets/g10.jpg', name: '雪落之前' },
    { src: 'assets/photostrip-ref.jpg', name: '人生四格' },
    { src: 'assets/moment-hug.jpg', name: '你怀里' }
  ];
  openSheet(sheet('桌面壁纸', '换一张，换一种心情', `
    <div class="picker-grid wall-grid">
      ${walls.map((w) => `<button data-wall="${w.src}"><img src="${w.src}" alt=""><span>${w.name}</span></button>`).join('')}
    </div>
    <button class="btn btn-block" id="wallUpload" style="margin-top:12px">${icon('image')} 从相册选一张</button>`));
  $$('#sheetRoot [data-wall]').forEach((b) => {
    b.onclick = () => {
      state.wallpaper = b.dataset.wall;
      save();
      applyWallpaper();
      closeSheet();
      refreshApp(settingsHTML, bindSettings);
      toast('壁纸换好啦');
    };
  });
  $('#wallUpload').onclick = () => {
    chooseImageFile((data) => {
      state.wallpaper = data;
      save();
      applyWallpaper();
      closeSheet();
      refreshApp(settingsHTML, bindSettings);
      toast('壁纸换好啦');
    });
  };
}
function confirmClearData() {
  openModal(modal('清空全部数据', `<p>聊天记录、昵称、头像、生日、订单、图库里的四格都会消失。<br><br>手机回到最初的样子，故事可以重新开始。</p>`, `<button class="btn btn-ghost" data-close-modal>再想想</button><button class="btn btn-primary" id="clearYes" style="background:#c05e56">确认清空</button>`));
  bindModalClosers();
  $('#clearYes').onclick = () => {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { }
    location.reload();
  };
}
APP_DEFS.settings = {
  darkUI: false,
  render() { return settingsHTML(); },
  mount() { bindSettings(); },
  back() { return false; }
};
