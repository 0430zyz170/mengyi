/* ============ 浏览器 · 12306 · 外卖 ============ */
'use strict';

/* ---------- 浏览器 ---------- */
const BR = { article: null, query: '', history: [] };
function articleFor(q) {
  if (!q) return null;
  return D.articles.find((a) => a.title.includes(q) || a.keys.some((k) => q.includes(k) || k.includes(q))) || null;
}
function browserHTML() {
  if (BR.article) {
    const a = BR.article;
    return `<div class="app browser-app">
      ${appbar('梦噫浏览器', `<button class="ab-btn" data-br="share">${icon('share')}</button>`)}
      <div class="app-body">
        <div class="br-result">
          <h1>${esc(a.title)}</h1>
          <div class="br-meta"><span>${esc(a.source)}</span><span>${esc(a.date)}</span></div>
          <div class="lead">${esc(a.lead)}</div>
          ${a.body.map(([t, v]) => t === 'h' ? `<h3>${esc(v)}</h3>` : t === 'tips' ? `<div class="br-tips">${icon('heart')} ${esc(v)}</div>` : `<p>${esc(v)}</p>`).join('')}
          <button class="br-backhome" data-br="home">${icon('arrowleft')} 返回首页</button>
        </div>
      </div>
    </div>`;
  }
  return `<div class="app browser-app">
    ${appbar('梦噫浏览器', `<button class="ab-btn" data-br="close">${icon('close')}</button>`)}
    <div class="app-body">
      <div class="br-top" style="padding-top:0">
        <div class="br-search">${icon('search')}<input id="brInput" placeholder="搜索点什么…" value="${esc(BR.query)}"><button data-br="go" style="font-size:10px;color:#7f8a72">搜索</button></div>
      </div>
      <div class="br-home">
        <div class="br-brand"><h2>梦噫</h2><p>只搜和喜欢有关的事</p></div>
        <div class="br-sugs">
          <h4>大家都在搜</h4>
          ${[
            ['怎么撩男朋友', 'hot'], ['哈尔滨情侣约会去哪', 'hot'], ['元旦北京三天攻略', ''], ['异地恋怎么维持', ''], ['张泽禹 生日 0430', '']
          ].map(([q, hot]) => `<div class="br-sug" data-q="${esc(q)}">${icon('search')}<span>${esc(q)}</span>${hot ? '<span class="hot">热</span>' : ''}</div>`).join('')}
        </div>
        ${BR.history.length ? `<div class="br-sugs"><h4>搜索历史</h4><div class="br-history">${BR.history.map((h) => `<button data-q="${esc(h)}">${esc(h)}</button>`).join('')}</div></div>` : ''}
        <div class="br-sugs">
          <h4>为你推荐</h4>
          ${D.articles.slice(0, 4).map((a) => `<div class="br-sug" data-article="${esc(a.title)}">${icon('browser')}<span>${esc(a.title)}</span></div>`).join('')}
        </div>
        <div style="text-align:center;font-size:8.5px;color:#bfc5b8;padding:24px 0 10px;line-height:1.9">梦噫浏览器 · 本页内容均为虚构<br>愿你搜到的，都是甜的</div>
      </div>
    </div>
  </div>`;
}
function doSearch(q) {
  q = (q || '').trim();
  if (!q) return;
  BR.query = q;
  BR.history = [q, ...BR.history.filter((x) => x !== q)].slice(0, 6);
  const a = articleFor(q);
  if (a) { BR.article = a; }
  else {
    openModal(modal('没有找到', `<p>「${esc(q)}」这个搜索，<br>梦噫还没有答案。<br>不如问问他？</p>`, `<button class="btn btn-ghost" data-close-modal>再搜搜</button><button class="btn btn-primary" id="askHim">去问他</button>`));
    bindModalClosers();
    $('#askHim').onclick = () => {
      closeModal();
      state.chat.push({ from: 'me', type: 'text', text: q, at: `${pad(new Date().getHours())}:${pad(new Date().getMinutes())}` });
      save(); openApp('wechat', { chat: 'zeyu' });
      setTimeout(() => pushHimMessage('你问我啊？那我可得好好想想，不能糊弄你。'), 1800);
    };
  }
  renderBrowserApp();
}
function renderBrowserApp() {
  $('#appContent').innerHTML = browserHTML();
  bindBrowser();
}
function bindBrowser() {
  const input = $('#brInput');
  if (input) {
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(input.value); });
  }
  $$('[data-q]').forEach((el) => { el.onclick = () => doSearch(el.dataset.q); });
  $$('[data-article]').forEach((el) => { el.onclick = () => { BR.article = D.articles.find((a) => a.title === el.dataset.article); BR.history = [BR.article.title, ...BR.history.filter((x) => x !== BR.article.title)].slice(0, 6); renderBrowserApp(); }; });
  $$('[data-br]').forEach((el) => {
    el.onclick = () => {
      const a = el.dataset.br;
      if (a === 'go') doSearch($('#brInput') ? $('#brInput').value : '');
      else if (a === 'home') { BR.article = null; renderBrowserApp(); }
      else if (a === 'share') {
        if (BR.article) {
          const t = BR.article.title;
          state.chat.push({ from: 'me', type: 'text', text: `你看这个：「${t}」`, at: `${pad(new Date().getHours())}:${pad(new Date().getMinutes())}` });
          save(); toast('已发给他');
          setTimeout(() => pushHimMessage('看完了。那我们按这个去？'), 2000);
        }
      } else if (a === 'close') closeApp();
    };
  });
}
APP_DEFS.browser = {
  darkUI: false,
  render() { return browserHTML(); },
  mount() { bindBrowser(); },
  back() {
    if (BR.article) { BR.article = null; renderBrowserApp(); return true; }
    return false;
  }
};

/* ---------- 12306 ---------- */
const TR = { tab: 'tickets', dest: '哈尔滨', dateIdx: 0, order: null };
function trainDates() {
  const out = [];
  const base = new Date();
  const list = [
    new Date(base.getFullYear(), 11, 31),
    new Date(base.getFullYear() + 1, 0, 1),
    new Date(base.getFullYear() + 1, 0, 2),
    new Date(base.getFullYear() + 1, 0, 3)
  ];
  list.forEach((d) => out.push({ d, label: `${d.getMonth() + 1}/${d.getDate()}`, sub: `${cnWeek(d).replace('星期', '周')}` }));
  return out;
}
function trainOrigin() {
  const raw = weatherData && weatherData.city ? String(weatherData.city) : '';
  const city = raw.replace(/市$/, '');
  if (!city || city === '你的位置' || (weatherData && weatherData.fallback)) return '南京';
  return city;
}
function trainRows(dest) {
  const from = trainOrigin();
  const to = dest === '哈尔滨' ? '哈尔滨西' : '北京南';
  return (D.trains[dest] || []).map((t) => ({ ...t, from, to }));
}
function trainHTML() {
  const dates = trainDates();
  if (TR.dateIdx >= dates.length) TR.dateIdx = 0;
  const date = dates[TR.dateIdx];
  const dest = TR.dest;
  const list = trainRows(dest);
  const origin = trainOrigin();
  const toStation = dest === '哈尔滨' ? '哈尔滨西' : '北京南';
  return `<div class="app train-app">
    ${appbar('铁路12306', `<button class="ab-btn" data-tr="orders">${icon('list')}</button>`)}
    <div class="app-body">
      <div class="tr-top">
        <div style="font-size:9px;letter-spacing:2px;opacity:.65">DREAMYI RAILWAY</div>
        <div class="tr-route"><span class="tr-city">${esc(origin)}</span><span class="tr-arrow"></span><span class="tr-city">${toStation}</span></div>
        <div class="tr-sub">${date.d.getFullYear()}年${date.d.getMonth() + 1}月${date.d.getDate()}日 · ${cnWeek(date.d)} · 学生票可享优惠</div>
      </div>
      <div class="tr-tabs">
        <button class="tr-tab on" data-tr="tickets">车票</button>
        <button class="tr-tab ${TR.tab === 'orders' ? 'on' : ''}" data-tr="orders">我的订单</button>
      </div>
      <div class="tr-dates">
        ${dates.map((x, i) => `<button class="tr-date ${i === TR.dateIdx ? 'on' : ''}" data-trdate="${i}"><b>${x.label}</b>${x.sub}</button>`).join('')}
      </div>
      <div class="tr-tabs" style="margin-top:2px">
        <button class="tr-tab ${dest === '哈尔滨' ? 'on' : ''}" data-dest="哈尔滨">去哈尔滨</button>
        <button class="tr-tab ${dest === '北京' ? 'on' : ''}" data-dest="北京">去北京</button>
      </div>
      <div class="tr-list">
        ${list.map((t) => `<div class="tr-card">
          <div class="tr-row1"><span class="tr-no">${t.no}</span><span>${t.dur}</span></div>
          <div class="tr-row2">
            <div><div class="tr-time">${t.dep}</div><div class="tr-station">${t.from}</div></div>
            <div class="tr-mid"><div>${t.no.startsWith('G') ? '高铁' : '普快'}</div><div class="line"></div><div>${t.arr}</div></div>
            <div style="text-align:right"><div class="tr-time">${t.arr}</div><div class="tr-station">${t.to}</div></div>
          </div>
          <div class="tr-row3">
            <div class="tr-seats">${t.seats.map((s) => `<span class="tr-seat">${s.n} <b>¥${s.p}</b></span>`).join('')}</div>
            <button class="tr-book" data-book="${t.no}">预订</button>
          </div>
        </div>`).join('')}
      </div>
      <div class="tr-note">车次、票价均为虚构演示<br>出发站会根据你的位置自动更新<br>买一张票，去见想见的人</div>
    </div>
  </div>`;
}
function ordersHTML() {
  const tickets = state.tickets || [];
  return `<div class="app train-app">
    ${appbar('我的订单', `<button class="ab-btn" data-tr="tickets">${icon('back')}</button>`)}
    <div class="app-body">
      <div class="tr-tabs" style="margin-top:4px"><button class="tr-tab on">未出行</button><button class="tr-tab">已出行</button></div>
      ${tickets.length ? tickets.map((t) => `<div class="tr-ticket">
        <div class="tr-ticket-top"><b>${esc(t.date)} ${esc(t.no)}</b><span>已支付</span></div>
        <div class="tr-ticket-body">
          <div><div class="c">${esc(t.from)}</div><div class="a">${esc(t.dep)} 出发</div></div>
          <div style="text-align:center;font-size:9px;color:#9aa6b5">— ${esc(t.seat)} —</div>
          <div style="text-align:right"><div class="c">${esc(t.to)}</div><div class="a">${esc(t.arr)} 到达</div></div>
          <div class="tr-qr"></div>
        </div>
      </div>`).join('') : `<div class="tr-empty">还没有订单。<br><br>去哈尔滨，还是去北京？</div>`}
      <div style="text-align:center;padding:20px"><button class="btn btn-primary" data-tr="tickets">去选一张票</button></div>
    </div>
  </div>`;
}
function renderTrain() {
  $('#appContent').innerHTML = TR.tab === 'orders' ? ordersHTML() : trainHTML();
  bindTrain();
}
function bindTrain() {
  $$('[data-tr]').forEach((el) => {
    el.onclick = () => {
      const a = el.dataset.tr;
      if (a === 'orders') { TR.tab = 'orders'; renderTrain(); }
      else if (a === 'tickets') { TR.tab = 'tickets'; renderTrain(); }
    };
  });
  $$('[data-trdate]').forEach((el) => { el.onclick = () => { TR.dateIdx = +el.dataset.trdate; renderTrain(); }; });
  $$('[data-dest]').forEach((el) => { el.onclick = () => { TR.dest = el.dataset.dest; renderTrain(); }; });
  $$('[data-book]').forEach((el) => { el.onclick = () => openBookSheet(el.dataset.book); });
}
function openBookSheet(no) {
  const t = trainRows(TR.dest).find((x) => x.no === no);
  if (!t) return;
  const dates = trainDates();
  const date = dates[TR.dateIdx];
  const dateStr = `${date.d.getFullYear()}-${pad(date.d.getMonth() + 1)}-${pad(date.d.getDate())}`;
  openSheet(sheet(`${t.no} · ${t.from} → ${t.to}`, `${dateStr} ${t.dep} 开`, `
    <div class="tr-row2" style="margin-bottom:14px">
      <div><div class="tr-time">${t.dep}</div><div class="tr-station">${t.from}</div></div>
      <div class="tr-mid"><div>${t.dur}</div><div class="line"></div><div>${t.arr}</div></div>
      <div style="text-align:right"><div class="tr-time">${t.arr}</div><div class="tr-station">${t.to}</div></div>
    </div>
    <div class="field"><label>乘车人</label><input value="${esc(state.username || '小梦')}" disabled></div>
    <div class="field"><label>席别</label><div class="opt-row" id="seatOpts">${t.seats.map((s, i) => `<button class="opt ${i === 0 ? 'on' : ''}" data-seat="${i}">${s.n} ¥${s.p}</button>`).join('')}</div></div>
    <div class="field"><label>备注</label><input id="trRemark" placeholder="靠窗，想看看沿途的雪"></div>
    <button class="btn btn-primary btn-block" id="payTicket">去支付 ¥<span id="payPrice">${t.seats[0].p}</span></button>
    <div style="font-size:9px;color:#b3b8a8;text-align:center;margin-top:10px">演示订单，不会真实扣款</div>`));
  let seatIdx = 0;
  $$('#seatOpts [data-seat]').forEach((b) => {
    b.onclick = () => {
      seatIdx = +b.dataset.seat;
      $$('#seatOpts .opt').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      $('#payPrice').textContent = t.seats[seatIdx].p;
    };
  });
  $('#payTicket').onclick = () => {
    closeSheet();
    const seat = t.seats[seatIdx];
    const order = { id: 'T' + Date.now(), no: t.no, from: t.from, to: t.to, dep: t.dep, arr: t.arr, date: dateStr, seat: seat.n, price: seat.p };
    state.tickets = state.tickets || [];
    state.tickets.unshift(order);
    save();
    openModal(modal('支付成功', `<div style="text-align:center;padding:10px 0 2px"><div style="font-size:38px">🎫</div><p style="font-size:11px;color:#8b9580;margin-top:8px">${dateStr} ${t.no}<br>${t.from} → ${t.to} · ${seat.n}</p><div class="tr-ticket" style="margin:16px 0 0;text-align:left"><div class="tr-ticket-top"><b>电子车票</b><span>已支付 ¥${seat.p}</span></div><div class="tr-ticket-body"><div><div class="c">${t.from}</div><div class="a">${t.dep}</div></div><div class="tr-qr"></div><div style="text-align:right"><div class="c">${t.to}</div><div class="a">${t.arr}</div></div></div></div></div>`, `<button class="btn btn-primary" data-close-modal>收好</button>`));
    bindModalClosers();
    TR.tab = 'orders';
    setTimeout(() => { closeModal(); renderTrain(); }, 900);
    setTimeout(() => toast('票买好啦。要告诉他吗？'), 1400);
  };
}
APP_DEFS.train = {
  darkUI: false,
  render() { return TR.tab === 'orders' ? ordersHTML() : trainHTML(); },
  mount() { bindTrain(); },
  back() { if (TR.tab === 'orders') { TR.tab = 'tickets'; renderTrain(); return true; } return false; }
};

/* ---------- 外卖 ---------- */
const FOOD = { store: null, cart: {}, track: null, timer: null };
function cartCount() { return Object.values(FOOD.cart).reduce((a, b) => a + b, 0); }
function cartTotal() {
  if (!FOOD.store) return 0;
  return FOOD.store.items.reduce((sum, it) => sum + (FOOD.cart[it.id] || 0) * it.price, 0);
}
function foodHomeHTML() {
  return `<div class="app food-app">
    ${appbar('美团外卖', `<button class="ab-btn" data-food="search">${icon('search')}</button>`)}
    <div class="app-body">
      <div class="fd-top">${icon('location')} 哈尔滨 · 中央大街 <span style="opacity:.5;font-size:9px">切换</span></div>
      <div class="fd-search" data-food="search">${icon('search')}<span>搜点什么，蛋糕、奶茶还是饭？</span></div>
      <div class="fd-cats">
        ${[['🍰', '甜品'], ['🧋', '奶茶'], ['🍚', '饭'], ['🍜', '面'], ['🥗', '轻食']].map(([e, n]) => `<button class="fd-cat" data-food="cat"><span class="ic">${e}</span>${n}</button>`).join('')}
      </div>
      <div class="fd-banner"><h3>给他点一份？</h3><p>满 30 减 8 · 送到他手里还是热的</p><span class="emo">🧋</span></div>
      <div class="fd-sec"><h4>最近点过</h4><span>再来一单</span></div>
      <div class="fd-past">
        ${D.pastOrders.map((o, i) => `<div class="fd-past-card"><div class="top"><span class="em">${o.emoji}</span><div style="min-width:0"><b>${o.items}</b><small>${o.store} · ${o.date}</small></div></div><div class="again" data-again="${i}">${icon('refresh')}再来一单</div></div>`).join('')}
      </div>
      <div class="fd-sec"><h4>附近商家</h4><span>${D.stores.length} 家</span></div>
      ${D.stores.map((s) => `<div class="fd-store" data-store="${s.id}">
        <div class="logo">${s.emoji}</div>
        <div class="info"><b>${esc(s.name)}</b><div class="stars">★ ${s.rate}</div><div class="meta"><span>${esc(s.desc)}</span><span>${s.dist}</span></div></div>
        <div class="dist"><div>${s.time}</div><div class="fee">免配送费</div></div>
      </div>`).join('')}
      <div style="height:24px"></div>
    </div>
  </div>`;
}
function foodStoreHTML() {
  const s = FOOD.store;
  const total = cartTotal();
  return `<div class="app food-app">
    ${appbar(s.name, `<button class="ab-btn" data-food="home">${icon('close')}</button>`)}
    <div class="app-body" style="padding-bottom:74px">
      <div style="margin:0 16px 6px;border-radius:16px;padding:16px;background:linear-gradient(135deg,#f7e3bd,#efc884);display:flex;gap:12px;align-items:center">
        <div style="width:48px;height:48px;border-radius:12px;background:#fff;display:grid;place-items:center;font-size:24px">${s.emoji}</div>
        <div><div style="font-size:13px;font-weight:600;color:#5b4217">${esc(s.name)}</div><div style="font-size:9px;color:#8a6a2c;margin-top:4px">★ ${s.rate} · ${s.desc}</div></div>
      </div>
      <div class="fd-menu">
        ${s.items.map((it) => `<div class="fd-dish"><div class="pic">${it.emoji}</div><div class="d"><b>${esc(it.name)}</b><p>${esc(it.desc)}</p><div class="bottom"><span class="price"><small>¥</small>${it.price}</span><button class="fd-add" data-add="${it.id}">+</button></div></div></div>`).join('')}
        <div style="font-size:9px;color:#b3b5ab;text-align:center;padding:18px">现做现送 · 冷了不好吃</div>
      </div>
    </div>
    ${cartCount() ? `<div class="fd-cart"><span class="ci">${icon('cart')}<em>${cartCount()}</em></span><div class="total">¥${total.toFixed(2)}<small>另需配送费 ¥0</small></div><button data-food="checkout">去结算</button></div>` : ''}
  </div>`;
}
function foodTrackHTML() {
  const t = FOOD.track;
  const steps = ['商家已接单', '正在制作', '骑手已取餐', '正在配送', '已送达'];
  return `<div class="app food-app">
    ${appbar('订单详情', '')}
    <div class="app-body">
      <div class="fd-track">
        <div class="big">${t.step >= 4 ? '外卖已送达' : '骑手正在赶来'}</div>
        <div class="sub">${esc(t.store)} · ${t.items} · ¥${t.total.toFixed(2)}</div>
        <div class="fd-steps">
          ${steps.map((s, i) => `<div class="fd-step ${i <= t.step ? 'done' : ''}"><i></i><div><div class="t">${s}</div><div class="s">${i <= t.step ? '完成' : '等待中'}</div></div></div>`).join('')}
        </div>
        ${t.step >= 4 ? `<div style="background:#fff;border-radius:14px;padding:14px;font-size:11px;color:#6b7461;line-height:1.8">有一份是给他的，记得说一声：<br>“趁热吃。”</div>` : ''}
        <button class="btn btn-primary btn-block" data-food="home" style="margin-top:18px">完成</button>
      </div>
    </div>
  </div>`;
}
function renderFood() {
  if (FOOD.track) $('#appContent').innerHTML = foodTrackHTML();
  else if (FOOD.store) $('#appContent').innerHTML = foodStoreHTML();
  else $('#appContent').innerHTML = foodHomeHTML();
  bindFood();
}
function bindFood() {
  $$('[data-store]').forEach((el) => { el.onclick = () => { FOOD.store = D.stores.find((s) => s.id === el.dataset.store); FOOD.cart = {}; renderFood(); }; });
  $$('[data-again]').forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const o = D.pastOrders[+el.dataset.again];
      const s = D.stores.find((x) => x.name.includes(o.store) || o.store.includes(x.name.slice(0, 2)));
      if (s) { FOOD.store = s; FOOD.cart = {}; renderFood(); toast('已为你打开店铺'); }
    };
  });
  $$('[data-add]').forEach((el) => {
    el.onclick = () => {
      const id = el.dataset.add;
      FOOD.cart[id] = (FOOD.cart[id] || 0) + 1;
      renderFood();
    };
  });
  $$('[data-food]').forEach((el) => {
    el.onclick = () => {
      const a = el.dataset.food;
      if (a === 'home') { FOOD.store = null; FOOD.cart = {}; FOOD.track = null; renderFood(); }
      else if (a === 'search') toast('今天想吃点什么？');
      else if (a === 'cat') toast('这一栏都是甜的');
      else if (a === 'checkout') openCheckout();
    };
  });
}
function openCheckout() {
  const s = FOOD.store; if (!s) return;
  const items = s.items.filter((it) => FOOD.cart[it.id]);
  const total = cartTotal();
  openSheet(sheet('确认订单', '送到：哈尔滨 · 中央大街', `
    ${items.map((it) => `<div class="sheet-row">${it.emoji}<span style="flex:1">${esc(it.name)} × ${FOOD.cart[it.id]}</span><em>¥${(it.price * FOOD.cart[it.id]).toFixed(2)}</em></div>`).join('')}
    <div class="field" style="margin-top:12px"><label>备注</label><input id="foodNote" placeholder="多给一份餐具 / 少糖 / 给他写张纸条"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 2px 14px;font-size:12px"><span>合计</span><b style="font-size:19px;color:#e0702c">¥${total.toFixed(2)}</b></div>
    <button class="btn btn-primary btn-block" id="foodPay">微信支付</button>`));
  $('#foodPay').onclick = () => {
    const note = $('#foodNote').value;
    closeSheet();
    FOOD.track = { store: s.name, items: items.map((i) => `${i.name}×${FOOD.cart[i.id]}`).join('、'), total, step: 0, note };
    FOOD.store = null; FOOD.cart = {};
    renderFood();
    if (FOOD.timer) clearInterval(FOOD.timer);
    FOOD.timer = setInterval(() => {
      if (!FOOD.track) { clearInterval(FOOD.timer); return; }
      FOOD.track.step++;
      if (FOOD.track.step >= 4) {
        clearInterval(FOOD.timer); FOOD.timer = null;
        banner({ app: '美团外卖', title: '外卖已送达', avatar: '', body: '有一份是给他的，趁热吃。' });
      }
      if (currentApp === 'food') renderFood();
    }, 3200);
    toast('支付成功，商家开始备餐');
  };
}
APP_DEFS.food = {
  darkUI: false,
  render() { return FOOD.track ? foodTrackHTML() : FOOD.store ? foodStoreHTML() : foodHomeHTML(); },
  mount() { bindFood(); },
  back() {
    if (FOOD.track) { FOOD.track = null; renderFood(); return true; }
    if (FOOD.store) { FOOD.store = null; FOOD.cart = {}; renderFood(); return true; }
    return false;
  },
  unmount() { if (FOOD.timer) { clearInterval(FOOD.timer); FOOD.timer = null; } }
};
