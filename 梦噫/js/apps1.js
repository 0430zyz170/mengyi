/* ============ 日历 · 天气 · 音乐 ============ */
'use strict';

function appbar(title, right = '', back = true) {
  return `<div class="appbar">
    ${back ? `<button class="ab-btn" data-back>${icon('back')}</button>` : '<span style="width:8px"></span>'}
    <div class="ab-title">${title}</div>
    <div class="ab-right">${right}</div>
  </div>`;
}

/* ---------- 日历 ---------- */
const CAL = { cursor: null, selected: null };
function calInit() {
  const n = new Date();
  CAL.cursor = new Date(n.getFullYear(), n.getMonth(), 1);
  CAL.selected = new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function sameDate(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function dateKey(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function eventsFor(d) {
  const md = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const evs = (D.calendarEvents[md] || []).map((e) => ({ ...e }));
  if (md === state.birthday) evs.unshift({ title: '你的生日', sub: '他会记得，也会说生日快乐', tone: 'rose' });
  const now = new Date();
  if (sameDate(d, now)) evs.push({ title: '今天', sub: `距离元旦还有 ${daysToNewYear()} 天`, tone: 'green' });
  return evs;
}

function calendarHTML() {
  if (!CAL.cursor) calInit();
  const cur = CAL.cursor;
  const year = cur.getFullYear(), month = cur.getMonth();
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    let d, dim = false;
    if (i < start) { d = new Date(year, month - 1, prevDays - start + i + 1); dim = true; }
    else if (i >= start + daysInMonth) { d = new Date(year, month + 1, i - start - daysInMonth + 1); dim = true; }
    else d = new Date(year, month, i - start + 1);
    const evs = eventsFor(d);
    const today = sameDate(d, new Date());
    const sel = sameDate(d, CAL.selected);
    cells.push(`<button class="cal-day ${dim ? 'dim' : ''} ${today ? 'today' : ''} ${sel ? 'sel' : ''}" data-date="${dateKey(d)}">
      ${d.getDate()}${evs.length ? `<i class="dot ${evs[0].tone === 'green' ? 'b' : ''}"></i>` : ''}
    </button>`);
  }
  const sel = CAL.selected || new Date();
  const selEvs = eventsFor(sel);
  return `<div class="app">
    ${appbar('日历', `<button class="ab-btn" data-cal="birthday">${icon('gift')}</button>`)}
    <div class="app-body">
      <div class="cal-hero">
        <div class="k">NEW YEAR COUNTDOWN</div>
        <div class="v" id="calCd">${daysToNewYear()}<small>天</small></div>
        <div class="d">距离 ${new Date().getFullYear() + 1} 年元旦 · 想和他一起跨年</div>
      </div>
      <div class="cal-head">
        <div class="cal-month">${year} 年 ${month + 1} 月</div>
        <div class="cal-nav">
          <button data-cal="prev">${icon('chevronL')}</button>
          <button data-cal="next">${icon('chevron')}</button>
        </div>
      </div>
      <div class="cal-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
      <div class="cal-grid">${cells.join('')}</div>
      <div class="cal-detail">
        <h4>${sel.getMonth() + 1} 月 ${sel.getDate()} 日</h4>
        <div class="date">${fullDateCN(sel)} · ${cnWeek(sel)}</div>
        ${selEvs.length ? selEvs.map((e) => `<div class="cal-ev ${e.tone === 'green' ? 'green' : ''}"><span class="bar"></span><div><div class="t">${esc(e.title)}</div><div class="s">${esc(e.sub)}</div></div></div>`).join('') : `<div style="font-size:11px;color:#a3aa9b;padding:12px 0 4px">这一天还没有安排。要不要问问他？</div>`}
      </div>
      <div class="cal-actions">
        <button class="btn btn-ghost" data-cal="birthday">设置我的生日</button>
        <button class="btn btn-primary" data-cal="wish">生日彩蛋</button>
      </div>
      <div style="text-align:center;font-size:9px;color:#b3b9aa;padding-bottom:16px">4月30日 · 张泽禹的生日 · 也是我们的开始</div>
    </div>
  </div>`;
}

function bindCalendar() {
  $$('[data-cal]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.cal;
      if (a === 'prev' || a === 'next') {
        CAL.cursor = new Date(CAL.cursor.getFullYear(), CAL.cursor.getMonth() + (a === 'next' ? 1 : -1), 1);
        refreshApp(calendarHTML, bindCalendar);
      } else if (a === 'birthday') openBirthdaySetting();
      else if (a === 'wish') sendBirthdayWish();
    };
  });
  $$('[data-date]').forEach((b) => {
    b.onclick = () => {
      const [y, m, d] = b.dataset.date.split('-').map(Number);
      CAL.selected = new Date(y, m, d);
      refreshApp(calendarHTML, bindCalendar);
    };
  });
}
function refreshApp(renderFn, bindFn) {
  const body = document.querySelector('#appContent .app-body');
  const top = body ? body.scrollTop : 0;
  $('#appContent').innerHTML = renderFn();
  if (bindFn) bindFn();
  const nb = document.querySelector('#appContent .app-body');
  if (nb) nb.scrollTop = top;
}
function openBirthdaySetting() {
  const [bm, bd] = (state.birthday || '10-16').split('-').map(Number);
  openModal(`<h3>设置我的生日</h3><p>到那天，他会给你发消息。</p>
    <div style="display:flex;gap:10px;margin-top:16px">
      <div class="field" style="flex:1"><label>月</label><input id="bdM" type="number" min="1" max="12" value="${bm}"></div>
      <div class="field" style="flex:1"><label>日</label><input id="bdD" type="number" min="1" max="31" value="${bd}"></div>
    </div>
    <div class="modal-acts"><button class="btn btn-ghost" data-close-modal>取消</button><button class="btn btn-primary" id="bdSave">保存</button></div>`);
  bindModalClosers();
  $('#bdSave').onclick = () => {
    let m = parseInt($('#bdM').value, 10), d = parseInt($('#bdD').value, 10);
    if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) { toast('日期不太对哦'); return; }
    if (d > new Date(2026, m, 0).getDate()) { toast('这个月没有这一天'); return; }
    state.birthday = `${pad(m)}-${pad(d)}`; save();
    closeModal();
    if (currentApp === 'calendar') refreshApp(calendarHTML, bindCalendar);
    if (currentApp === 'settings' && typeof settingsHTML !== 'undefined') refreshApp(settingsHTML, bindSettings);
    toast('记住啦，' + petName() + '的生日');
  };
}
APP_DEFS.calendar = {
  darkUI: false,
  render() { if (!CAL.cursor) calInit(); return calendarHTML(); },
  mount() { bindCalendar(); },
  back() { return false; }
};

/* ---------- 天气 ---------- */
function weatherBodyHTML() {
  if (!weatherData) {
    return `<div class="app-body"><div class="wx-loading"><div class="ring"></div>正在定位，等风来…</div></div>`;
  }
  const w = weatherData;
  const info = weatherInfo(w.code);
  const hours = w.hourly.slice(new Date().getHours(), new Date().getHours() + 12);
  const days = w.daily;
  const dateLabel = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}`; };
  const week = (s, i) => i === 0 ? '今天' : i === 1 ? '明天' : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(s).getDay()];
  return `<div class="app-body">
    <div class="wx-weather">
      <div class="wx-city">${icon('location')}${esc(w.city)}<button class="refresh" data-weather="retry">${icon('refresh')} 更新</button></div>
      <div class="wx-now">
        <div class="wx-temp">${Math.round(w.temp)}<small>°</small></div>
        <div class="wx-cond"><div class="c">${info[0]}</div><div class="r">体感 ${Math.round(w.feels)}° · 湿度 ${w.humidity}%</div><div class="f">${days[0] ? `最高 ${Math.round(days[0].max)}° / 最低 ${Math.round(days[0].min)}°` : ''} · 风 ${Math.round(w.wind)} km/h</div></div>
        <div class="wx-sun" style="display:grid;place-items:center;font-size:26px">${info[1]}</div>
      </div>
    </div>
    ${w.fallback ? `<div class="wx-fallback">没有拿到你的定位，先给你看哈尔滨的天气。${navigator.geolocation ? '开启定位权限后点「更新」就会自动切换。' : '当前浏览器不支持定位。'}
      <div class="wx-cities"><button data-weather="retry">重新定位</button><button data-weather="harbin">哈尔滨</button><button data-weather="beijing">北京</button><button data-weather="nanjing">南京</button></div></div>` : ''}
    <div class="wx-hourly">
      ${hours.map((h, i) => `<div class="wx-hour"><span>${i === 0 ? '现在' : h.time.slice(11, 13) + ':00'}</span><span class="ic">${weatherInfo(h.code)[1]}</span><b>${Math.round(h.temp)}°</b></div>`).join('')}
    </div>
    <div class="wx-days">
      ${days.map((d, i) => `<div class="wx-day"><span class="n">${week(d.date, i)}</span><span class="ic">${weatherInfo(d.code)[1]}</span><span style="flex:1;font-size:9px;color:#b3baa9">${dateLabel(d.date)}</span><span class="t">${Math.round(d.min)}° / ${Math.round(d.max)}°</span></div>`).join('')}
    </div>
    <div style="text-align:center;font-size:9px;color:#aeb6a3;padding-bottom:24px;line-height:1.9">定位自动更新 · 数据来自 Open-Meteo<br>${w.fallback ? '当前为默认城市' : '已按你的位置更新'}</div>
  </div>`;
}
function renderWeatherApp() {
  $('#appContent').innerHTML = `<div class="app weather-app">
    ${appbar('天气', `<button class="ab-btn" data-weather="retry">${icon('refresh')}</button>`)}
    <div id="weatherBody">${weatherBodyHTML()}</div>
  </div>`;
  bindWeather();
}
function bindWeather() {
  $$('[data-weather]').forEach((b) => {
    b.onclick = async () => {
      const a = b.dataset.weather;
      if (a === 'retry') { weatherData = null; renderWeatherApp(); await loadWeather(true); renderWeatherApp(); }
      else {
        const cityMap = { harbin: ['哈尔滨', 45.8038, 126.5349], beijing: ['北京', 39.9042, 116.4074], nanjing: ['南京', 32.0603, 118.7969] };
        const c = cityMap[a]; if (!c) return;
        await weatherForCoords(c[0], c[1], c[2]);
        renderWeatherApp();
      }
    };
  });
}
async function weatherForCoords(city, lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    const data = await fetch(url).then((r) => r.json());
    const c = data.current || {};
    weatherData = {
      city, fallback: true, lat, lon, temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m, wind: c.wind_speed_10m, code: c.weather_code, cond: weatherInfo(c.weather_code)[1],
      daily: (data.daily.time || []).map((t, i) => ({ date: t, max: data.daily.temperature_2m_max[i], min: data.daily.temperature_2m_min[i], code: data.daily.weather_code[i] })),
      hourly: (data.hourly.time || []).map((t, i) => ({ time: t, temp: data.hourly.temperature_2m[i], code: data.hourly.weather_code[i] }))
    };
    applyWeatherChips();
  } catch (e) { toast('天气暂时连不上，等会儿再试'); }
}
APP_DEFS.weather = {
  darkUI: false,
  render() { return `<div class="app weather-app">${appbar('天气', `<button class="ab-btn" data-weather="retry">${icon('refresh')}</button>`)}<div id="weatherBody">${weatherBodyHTML()}</div></div>`; },
  mount() {
    bindWeather();
    if (!weatherData) loadWeather(true).then(() => { if (currentApp === 'weather') renderWeatherApp(); });
  },
  refresh() { if (currentApp === 'weather') renderWeatherApp(); },
  back() { return false; }
};

/* ---------- 音乐 ---------- */
const MUS = { idx: 0, playing: false, progress: 0, together: false, timer: null, togetherTimer: null };
const MUSIC_COMMENTS = ['这句像你。', '我在跟着哼，跑调了别笑。', '下次一起听现场。', '这首歌单曲循环一下午了。', '听到这儿会想你。'];
function fmtDur(s) { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; }
function currentSong() { return D.songs[MUS.idx] || D.songs[0]; }
function musicHTML() {
  const s = currentSong();
  const lines = s.lyrics;
  let li = 0;
  for (let i = 0; i < lines.length; i++) if (MUS.progress >= lines[i][0]) li = i;
  const line = lines[li], nextLine = lines[li + 1];
  const pct = Math.min(100, MUS.progress / s.dur * 100);
  return `<div class="app music-app">
    ${appbar('正在播放', `<button class="ab-btn" data-music="together" style="color:${MUS.together ? '#cfe3b6' : 'rgba(255,255,255,.6)'}">${icon('share')}</button>`)}
    <div class="app-body nopad" style="display:flex;flex-direction:column">
      <div class="music-now">
        <div class="vinyl-wrap ${MUS.playing ? '' : 'paused'}">
          <div class="vinyl ${MUS.playing ? 'playing' : ''}"><img src="${s.cover}" alt=""></div>
          <div class="vinyl-center"><i></i></div>
        </div>
        ${MUS.together ? `<div class="together-chip"><span class="live"></span><span>正在和张泽禹一起听</span><span class="avs"><span>${myAvatarHTML()}</span><span><img src="assets/avatar.jpg" alt=""></span></span></div>` : `<button class="together-chip" data-music="together"><span>${icon('music')}</span><span>和张泽禹一起听</span></button>`}
        <div class="music-title">${esc(s.title)}</div>
        <div class="music-artist">${esc(s.artist)} · 梦噫音乐</div>
        <div class="music-lyric">
          <div class="line on">${esc(line[1])}</div>
          <div class="line">${nextLine ? esc(nextLine[1]) : ''}</div>
        </div>
        <div class="music-progress">
          <div class="mp-bar" id="mpBar"><i id="mpFill" style="width:${pct}%"></i><b id="mpDot" style="left:${pct}%"></b></div>
          <div class="mp-time"><span id="mpCur">${fmtDur(MUS.progress)}</span><span id="mpDur">${fmtDur(s.dur)}</span></div>
        </div>
        <div class="music-controls">
          <button class="mc" data-music="prev">${icon('prev')}</button>
          <button class="mc play" data-music="toggle">${icon(MUS.playing ? 'pause' : 'play')}</button>
          <button class="mc" data-music="next">${icon('next')}</button>
        </div>
        <div class="music-actions">
          <button data-music="like">${icon('heart')}<span>喜欢</span></button>
          <button data-music="share" class="${MUS.together ? 'on' : ''}">${icon('share')}<span>分享给他</span></button>
          <button data-music="list">${icon('list')}<span>播放列表</span></button>
        </div>
      </div>
      <div class="playlist">
        <h4>播放列表 · ${D.songs.length} 首</h4>
        ${D.songs.map((x, i) => `<div class="pl-item ${i === MUS.idx ? 'on' : ''}" data-song="${i}">
          <span class="idx">${i === MUS.idx && MUS.playing ? `<span class="pl-eq"><i></i><i></i><i></i></span>` : pad(i + 1)}</span>
          <img src="${x.cover}" alt="">
          <span class="t">${esc(x.title)}<small>${esc(x.artist)}</small></span>
          <span class="d">${fmtDur(x.dur)}</span>
        </div>`).join('')}
        <div style="font-size:9px;color:rgba(235,242,225,.28);text-align:center;padding:18px 0 26px">耳机分你一半 · 一起听</div>
      </div>
    </div>
  </div>`;
}
function renderMusic() {
  $('#appContent').innerHTML = musicHTML();
  bindMusic();
}
function bindMusic() {
  $$('[data-music]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const a = b.dataset.music;
      if (a === 'toggle') { MUS.playing = !MUS.playing; renderMusic(); ensureMusicTimer(); }
      else if (a === 'prev' || a === 'next') {
        MUS.idx = (MUS.idx + (a === 'next' ? 1 : D.songs.length - 1)) % D.songs.length;
        MUS.progress = 0; MUS.playing = true; renderMusic(); ensureMusicTimer();
      } else if (a === 'together') {
        MUS.together = !MUS.together;
        if (MUS.together) {
          MUS.playing = true; ensureMusicTimer(); startTogether();
          toast('张泽禹加入了「一起听」');
          setTimeout(() => banner({ app: '微信', title: '张泽禹', avatar: 'zeyu', body: '我也在听。这歌选得好。' }), 900);
        } else { stopTogether(); }
        renderMusic();
      } else if (a === 'share') {
        state.chat.push({ from: 'me', type: 'music', title: currentSong().title, at: `${pad(new Date().getHours())}:${pad(new Date().getMinutes())}` });
        save(); renderHome(); toast('已分享到微信，张泽禹应该会点开');
        setTimeout(() => pushHimMessage('在听。你选的歌，我都爱听。'), 1800);
      } else if (a === 'like') { toast('已收藏到「一起听的歌」'); }
      else if (a === 'list') {
        const body = document.querySelector('#appContent .playlist');
        if (body) body.scrollIntoView({ behavior: 'smooth' });
      }
    };
  });
  $$('[data-song]').forEach((el) => {
    el.onclick = () => {
      MUS.idx = +el.dataset.song; MUS.progress = 0; MUS.playing = true; renderMusic(); ensureMusicTimer();
    };
  });
  $('#mpBar').onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    MUS.progress = Math.floor((e.clientX - r.left) / r.width * currentSong().dur);
    updateMusicProgress();
  };
}
function updateMusicProgress() {
  const s = currentSong();
  const pct = Math.min(100, MUS.progress / s.dur * 100);
  const fill = $('#mpFill'), dot = $('#mpDot'), cur = $('#mpCur');
  if (fill) fill.style.width = pct + '%';
  if (dot) dot.style.left = pct + '%';
  if (cur) cur.textContent = fmtDur(MUS.progress);
  const lyricBox = document.querySelector('.music-lyric');
  if (lyricBox) {
    let li = 0;
    for (let i = 0; i < s.lyrics.length; i++) if (MUS.progress >= s.lyrics[i][0]) li = i;
    const lines = lyricBox.querySelectorAll('.line');
    if (lines[0]) { lines[0].textContent = s.lyrics[li][1]; lines[0].classList.add('on'); }
    if (lines[1]) lines[1].textContent = s.lyrics[li + 1] ? s.lyrics[li + 1][1] : '';
  }
}
function ensureMusicTimer() {
  if (MUS.timer) return;
  MUS.timer = setInterval(() => {
    if (!MUS.playing) return;
    if (currentApp !== 'music') {
      const t = MUS.timer;
      MUS.timer = null;
      clearInterval(t);
      MUS.playing = false;
      return;
    }
    MUS.progress++;
    if (MUS.progress >= currentSong().dur) {
      MUS.idx = (MUS.idx + 1) % D.songs.length;
      MUS.progress = 0;
      renderMusic();
    } else updateMusicProgress();
  }, 1000);
}
function startTogether() {
  stopTogether();
  MUS.togetherTimer = setInterval(() => {
    if (currentApp !== 'music' || !MUS.together) { stopTogether(); return; }
    const text = MUSIC_COMMENTS[Math.floor(Math.random() * MUSIC_COMMENTS.length)];
    banner({ app: '一起听', title: '张泽禹', avatar: 'zeyu', body: text });
  }, 28000);
}
function stopTogether() {
  if (MUS.togetherTimer) clearInterval(MUS.togetherTimer);
  MUS.togetherTimer = null;
}
APP_DEFS.music = {
  darkUI: true,
  render() { return musicHTML(); },
  mount() {
    bindMusic();
    if (currentParams && currentParams.together) { MUS.together = true; MUS.playing = true; startTogether(); }
    ensureMusicTimer();
  },
  unmount() { MUS.playing = false; if (MUS.timer) { clearInterval(MUS.timer); MUS.timer = null; } stopTogether(); MUS.together = false; },
  back() { return false; }
};
