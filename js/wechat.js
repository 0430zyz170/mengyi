/* ============ 微信 ============ */
'use strict';

const WX = { view: 'chats', chatId: null, tools: false, parentView: false, typing: false, page: null, emoji: false };
const CHAT_ORDER = ['zeyu', 'family', 'mom', 'dad', 'wang'];
const OTHER_META = {
  mom: { name: '妈妈', who: 'mom' },
  dad: { name: '爸爸', who: 'dad' },
  family: { name: '相亲相爱一家人', who: 'family' },
  wang: { name: '王雨桐', who: 'wang' }
};

function zeyuPreview(m) {
  if (!m) return '';
  if (m.type === 'image') return '[图片]';
  if (m.type === 'transfer') return '[转账]';
  if (m.type === 'voice') return '[语音]';
  if (m.type === 'location') return '[位置]';
  if (m.type === 'music') return '[音乐]';
  return m.text || '';
}
function lastZeyuMessage() {
  return [...state.chat].reverse().find((m) => m.from === 'him' || m.from === 'me');
}
function chatPreview(id) {
  if (id === 'zeyu') return zeyuPreview(lastZeyuMessage());
  const c = D.chats[id];
  return c ? c.preview : '';
}
function chatTime(id) {
  if (id === 'zeyu') {
    const m = lastZeyuMessage();
    return (m && m.at) || '20:41';
  }
  return D.chats[id] ? D.chats[id].time : '';
}

/* ---------- 微信主界面 ---------- */
function renderWeChat() {
  const view = WX.view;
  let bar = '';
  let body = '';
  if (view === 'chats') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="exit">${icon('home')}</button><div class="ab-title">微信</div><div class="ab-right"><button class="ab-btn" data-wxact="plus">${icon('plus')}</button></div></div>`;
    body = `<button class="wx-search" data-wxact="search">${icon('search')}<span>搜索</span></button><div class="wx-list">${CHAT_ORDER.map(chatCell).join('')}</div>`;
  } else if (view === 'contacts') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="exit">${icon('home')}</button><div class="ab-title">通讯录</div><div class="ab-right"><button class="ab-btn" data-wxact="addfriend">${icon('plus')}</button></div></div>`;
    body = `<button class="wx-search" data-wxact="search">${icon('search')}<span>搜索联系人</span></button>
      <div class="wx-menu" style="margin-top:8px">
        ${menuRow('newfriends', '新的朋友', 'user', '1')}
        ${menuRow('groups', '群聊', 'contact', '1')}
        ${menuRow('tags', '标签', 'list', '3')}
        ${menuRow('official', '公众号', 'message', '1')}
      </div>
      <div class="wx-list">
        ${contactRow('zeyu', '张泽禹', 'Aaa.我最爱的宝宝', true)}
        ${contactRow('mom', '妈妈', '微信：妈妈', false)}
        ${contactRow('dad', '爸爸', '微信：爸爸', false)}
        ${contactRow('wang', '王雨桐', '高中同学', false)}
        ${contactRow('family', '相亲相爱一家人', '群聊 · 3人', false)}
      </div>`;
  } else if (view === 'discover') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="exit">${icon('home')}</button><div class="ab-title">发现</div></div>`;
    body = `<div class="wx-menu">
        ${menuRow('moments', '朋友圈', 'gallery', WX.parentView ? '爸妈视角' : '')}
        ${menuRow('channels', '视频号', 'play', '')}
        ${menuRow('live', '直播', 'camera', '')}
        ${menuRow('scan', '扫一扫', 'search', '')}
        ${menuRow('shake', '摇一摇', 'refresh', '')}
        ${menuRow('look', '看一看', 'eye', '')}
        ${menuRow('search', '搜一搜', 'search', '')}
        ${menuRow('nearby', '附近', 'location', '')}
        ${menuRow('shopping', '购物', 'cart', '')}
        ${menuRow('games', '游戏', 'play', '')}
        ${menuRow('mini', '小程序', 'qr', '')}
      </div>
      <div class="wx-menu">
        <button class="wx-menu-row" data-wxact="parenttoggle">
          <span class="wm-ic">${icon('eyeOff')}</span><span class="wm-name">爸妈视角看朋友圈</span>
          <span class="switch ${WX.parentView ? 'on' : ''}" style="margin-right:4px"></span>
        </button>
      </div>`;
  } else if (view === 'me') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="exit">${icon('home')}</button><div class="ab-title">我</div></div>`;
    body = `<div class="me-head">
        <div class="me-row">
          <div class="me-ava">${myAvatarHTML()}</div>
          <div class="me-info"><div class="me-name">${esc(state.username || '小梦')}</div><div class="me-id">微信号：mengyi_0430</div></div>
          <button class="ab-btn" data-wxact="profile" style="color:#9aa28f">${icon('qr')}</button>
        </div>
      </div>
      <div class="wx-menu">
        ${menuRow('services', '服务', 'transfer', '')}
        ${menuRow('favorites', '收藏', 'heart', '暗恋到表白')}
        ${menuRow('moments', '朋友圈', 'gallery', '')}
        ${menuRow('cards', '卡包', 'gift', '')}
        ${menuRow('emojiPack', '表情', 'smile', '')}
        ${menuRow('wxsettings', '设置', 'settings', '')}
      </div>`;
  } else if (view === 'moments') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="backdiscover">${icon('back')}</button><div class="ab-title">朋友圈</div><div class="ab-right"><button class="ab-btn" data-wxact="exit">${icon('home')}</button></div></div>`;
    body = renderMoments();
  } else if (view === 'favorites') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="backdiscover">${icon('back')}</button><div class="ab-title">收藏</div><div class="ab-right"><button class="ab-btn" data-wxact="exit">${icon('home')}</button></div></div>`;
    body = renderFavorites();
  } else if (view === 'page') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="backpage">${icon('back')}</button><div class="ab-title">${esc(WX.page ? WX.page.title : '')}</div><div class="ab-right"><button class="ab-btn" data-wxact="exit">${icon('home')}</button></div></div>`;
    body = WX.page ? WX.page.body : '';
  }

  const showTabs = ['chats', 'contacts', 'discover', 'me'].includes(view);
  const tabbar = showTabs ? `<div class="wx-tabbar">
    ${wxTab('chats', '微信', 'wechat', view === 'chats')}
    ${wxTab('contacts', '通讯录', 'contact', view === 'contacts')}
    ${wxTab('discover', '发现', 'discover', view === 'discover')}
    ${wxTab('me', '我', 'me', view === 'me')}
  </div>` : '';

  $('#appContent').innerHTML = `<div class="app wx">
    ${bar}
    <div class="app-body" id="wxBody" style="padding-bottom:${showTabs ? '62px' : '82px'}">${body}</div>
    ${tabbar}
    ${WX.chatId ? renderChatScreen() : ''}
  </div>`;

  bindWeChat();
  if (WX.chatId) scrollChat();
  if (view === 'page' && WX.page && typeof WX.page.mount === 'function') WX.page.mount();
}

function wxTab(view, label, ic, on) {
  const un = view === 'chats' && totalUnread();
  return `<button class="wx-tab ${on ? 'on' : ''}" data-wxtab="${view}">${icon(ic)}<span>${label}</span>${un ? '<i class="dotred"></i>' : ''}</button>`;
}
function chatCell(id) {
  if (id === 'zeyu') {
    const un = state.unread.zeyu || 0;
    return `<button class="wx-cell pinned" data-chat="zeyu">
      <div class="wx-avatar"><img src="assets/avatar.jpg" alt=""></div>
      <div class="wx-main">
        <div class="wx-row1"><span class="wx-name">张泽禹</span><span class="wx-time">${esc(chatTime('zeyu'))}</span></div>
        <div class="wx-preview">${esc(chatPreview('zeyu'))}</div>
      </div>
      ${un ? `<span class="wx-badge">${un > 99 ? '99+' : un}</span>` : `<span class="wx-pin">${icon('pin')}</span>`}
    </button>`;
  }
  const c = D.chats[id];
  if (!c) return '';
  const un = state.unread[id] || 0;
  const group = c.kind === 'group';
  return `<button class="wx-cell" data-chat="${id}">
    <div class="wx-avatar ${group ? '' : ''}">${group ? `<div class="mono" style="background:linear-gradient(135deg,#b7c9a1,#7d9a5f)">家</div>` : avatarInner(id)}</div>
    <div class="wx-main">
      <div class="wx-row1"><span class="wx-name">${esc(c.name)}</span><span class="wx-time">${esc(c.time)}</span></div>
      <div class="wx-preview">${un ? '<span class="red">[未读]</span>' : ''}${esc(c.preview)}</div>
    </div>
    ${un ? `<span class="wx-badge">${un}</span>` : ''}
  </button>`;
}
function avatarInner(id) {
  if (id === 'mom') return `<div class="mono" style="background:linear-gradient(135deg,#e6b3a8,#cf8f84)">妈</div>`;
  if (id === 'dad') return `<div class="mono" style="background:linear-gradient(135deg,#9fb7c9,#6f8ba0)">爸</div>`;
  if (id === 'wang') return `<div class="mono" style="background:linear-gradient(135deg,#c9b3d9,#9d86b0)">桐</div>`;
  return `<div class="mono">${id}</div>`;
}
function contactRow(id, name, sub, pinned) {
  return `<button class="wx-cell" data-chat="${id}">
    <div class="wx-avatar">${id === 'zeyu' ? '<img src="assets/avatar.jpg" alt="">' : id === 'family' ? `<div class="mono" style="background:linear-gradient(135deg,#b7c9a1,#7d9a5f)">家</div>` : avatarInner(id)}</div>
    <div class="wx-main"><div class="wx-row1"><span class="wx-name">${esc(name)}</span>${pinned ? `<span class="tag" style="font-size:8px">置顶</span>` : ''}</div><div class="wx-preview">${esc(sub)}</div></div>
  </button>`;
}
function menuRow(act, name, ic, val) {
  return `<button class="wx-menu-row" data-wxact="${act}">
    <span class="wm-ic">${icon(ic)}</span><span class="wm-name">${name}</span>
    ${val ? `<span class="wm-val">${esc(val)}</span>` : ''}<span class="chev">${icon('chevron')}</span>
  </button>`;
}

/* ---------- 会话 ---------- */
function renderChatScreen() {
  const id = WX.chatId;
  const other = id === 'zeyu' ? { name: '张泽禹', who: 'zeyu' } : OTHER_META[id];
  const isZeyu = id === 'zeyu';
  const msgs = id === 'zeyu' ? state.chat : D.chats[id].messages;
  return `<div class="chat-screen show" id="wxChat">
    <div class="chat-head">
      <button class="ab-btn" data-wxact="closechat">${icon('back')}</button>
      <div class="ab-title">${esc(other.name)}</div>
      ${isZeyu ? '<div class="ab-sub" id="chatSub"></div>' : ''}
      <div class="ab-right"><button class="ab-btn" data-wxact="exit">${icon('home')}</button><button class="ab-btn" data-wxact="chatmore">${icon('more')}</button></div>
    </div>
    <div class="chat-body" id="chatBody">${messagesHTML(msgs, other)}</div>
    ${isZeyu ? `<div class="chat-tools ${WX.tools ? '' : 'hidden'}" id="chatTools">
      ${toolBtn('gallery', 'image', '相册')}
      ${toolBtn('camera', 'camera', '拍摄')}
      ${toolBtn('audiocall', 'phone', '语音通话')}
      ${toolBtn('location', 'location', '位置')}
      ${toolBtn('redpacket', 'gift', '红包')}
      ${toolBtn('gift', 'cake', '礼物')}
      ${toolBtn('fav', 'heart', '收藏')}
      ${toolBtn('transfer', 'transfer', '转账')}
      ${toolBtn('music', 'music', '一起听歌')}
    </div>
    <div class="emoji-panel hidden" id="emojiPanel"></div>` : ''}
    ${isZeyu ? `<div class="chat-input">
      <button class="ci-btn" data-wxact="voice">${icon('voice')}</button>
      <div class="ci-field"><textarea id="wxInput" rows="1" placeholder="说点什么…"></textarea></div>
      <button class="ci-btn" data-wxact="emoji">${icon('smile')}</button>
      <button class="ci-btn" data-wxact="plusTools">${icon('plus')}</button>
      <button class="ci-send" id="wxSend" data-wxact="send">发送</button>
    </div>` : `<div class="chat-input" style="justify-content:center;color:#a3a3a3;font-size:10px;padding:13px">仅展示聊天记录</div>`}
  </div>`;
}
function toolBtn(id, ic, label) {
  return `<button class="tool" data-tool="${id}"><span class="tool-ico">${icon(ic)}</span>${label}</button>`;
}
function messagesHTML(msgs, other) {
  return msgs.map((m) => {
    if (m.type === 'stage') return `<div class="stage-line"><span>${esc(m.text)}</span></div>`;
    if (m.type === 'date') return `<div class="chat-date">${esc(m.text)}</div>`;
    const mine = m.from === 'me';
    const who = mine ? 'me' : (m.sender || other.who);
    const ava = mine ? avatarOf('me')
      : m.sender === '妈妈' ? avatarOf('mom')
        : m.sender === '爸爸' ? avatarOf('dad')
          : m.sender === '王雨桐' ? avatarOf('wang')
            : other.who === 'family'
              ? `<div class="wx-avatar"><div class="mono" style="background:linear-gradient(135deg,#b7c9a1,#7d9a5f)">家</div></div>`
              : avatarOf('zeyu');
    let content = '';
    if (m.type === 'image') content = `<div class="bubble img" data-img="${m.img}"><img src="${m.img}" alt=""><div style="font-size:9px;color:#999;padding:4px 3px 2px">${esc(m.text || '')}</div></div>`;
    else if (m.type === 'transfer') content = `<div class="bubble transfer ${mine ? '' : 'receive'}">
        <div class="transfer-top"><span class="transfer-ico">${icon('transfer')}</span><div><div class="transfer-amt">¥${esc(m.amount)}</div><div class="transfer-desc">${esc(m.note || '转账')}</div></div></div>
        <div class="transfer-bottom"><span>微信转账</span><span>${mine ? '已转出' : '已收款'}</span></div></div>`;
    else if (m.type === 'location') content = `<div class="bubble location"><div class="loc-card"><div class="loc-map"></div><div class="loc-meta"><b>${esc(m.place)}</b><span>${esc(m.addr || '')}</span></div></div></div>`;
    else if (m.type === 'voice') content = `<div class="bubble voice" data-voice="${m.dur || 4}"><svg class="ico" viewBox="0 0 24 24"><path d="M8 9v6M11 6v12M14 8v8M17 10v4"/></svg><div class="voice-wave"><i></i><i></i><i></i><i></i><i></i></div><span class="voice-dur">${m.dur || 4}″</span></div>`;
    else if (m.type === 'music') content = `<div class="bubble music-card"><span class="mc-cover">${icon('music')}</span><div><b>${esc(m.title)}</b><small>张泽禹 · 一起听</small></div></div>`;
    else if (m.type === 'redpacket') content = `<div class="bubble redpacket" data-rp="${esc(m.amount)}"><div class="rp-top"><span class="rp-ico">${icon('gift')}</span><div><b>${esc(m.note || '恭喜发财，大吉大利')}</b><span>¥${esc(m.amount)}</span></div></div><div class="rp-bottom">微信红包</div></div>`;
    else if (m.type === 'gift') content = `<div class="bubble gift-card"><span class="gift-emoji">${m.emoji || '🎁'}</span><div><b>${esc(m.gift)}</b><small>礼物 · 不花你的钱</small></div></div>`;
    else if (m.type === 'call') content = `<div class="bubble call-summary"><div class="call-sum-head">${icon('phone')}<b>语音通话</b><span>${esc(m.dur)}</span></div><div class="call-sum-lines">${(m.lines || []).map((l) => `<div class="call-sum-line ${l.from === 'me' ? 'me' : ''}"><em>${l.from === 'me' ? '我' : '他'}</em>${esc(l.text)}</div>`).join('')}</div></div>`;
    else content = `<div class="bubble">${esc(m.text).replace(/\n/g, '<br>')}</div>`;
    const sender = other.who === 'family' && !mine ? `<div class="msg-name">${esc(m.sender || '')}</div>` : '';
    return `<div class="msg ${mine ? 'me' : ''}" data-msg="${m.type || 'text'}">
      <div class="msg-ava">${ava}</div>
      <div class="msg-wrap">${sender}${content}${m.at ? `<span class="msg-time">${esc(m.at)}</span>` : ''}</div>
    </div>`;
  }).join('');
}

function bindWeChat() {
  const root = $('#appContent');
  if (!root) return;
  $$('#wxBody [data-chat]', root).forEach((el) => {
    el.onclick = () => openChat(el.dataset.chat);
  });
  $$('.wx-tab', root).forEach((el) => {
    el.onclick = () => {
      WX.view = el.dataset.wxtab;
      WX.chatId = null;
      WX.tools = false;
      renderWeChat();
    };
  });
  $$('[data-wxact]', root).forEach((el) => {
    el.onclick = (e) => { e.stopPropagation(); wxAction(el.dataset.wxact, el); };
  });
  if (WX.chatId) bindChat();
}

function wxAction(act, el) {
  if (act === 'plus') {
    openSheet(sheet('微信', '想做什么？', `
      <div class="sheet-row" data-plus="group">${icon('contact')}<span>发起群聊</span></div>
      <div class="sheet-row" data-plus="addfriend">${icon('user')}<span>添加朋友</span></div>
      <div class="sheet-row" data-plus="scan">${icon('search')}<span>扫一扫</span></div>
      <div class="sheet-row" data-plus="pay">${icon('transfer')}<span>收付款</span></div>`));
    $$('#sheetRoot [data-plus]').forEach((r) => {
      r.onclick = () => {
        const a = r.dataset.plus;
        closeSheet();
        if (a === 'group') openGroupsPage();
        else if (a === 'addfriend') openNewFriendsPage();
        else if (a === 'scan') openScanPage();
        else openPayPage();
      };
    });
  } else if (act === 'backpage') {
    const back = WX.page && WX.page.back ? WX.page.back : 'discover';
    WX.page = null;
    WX.view = back;
    renderWeChat();
  } else if (act === 'exit') { closeApp(); }
  else if (act === 'search') openSearchPage();
  else if (act === 'newfriends' || act === 'addfriend') openNewFriendsPage();
  else if (act === 'groups') openGroupsPage();
  else if (act === 'tags') openTagsPage();
  else if (act === 'official') openOfficialPage();
  else if (act === 'channels') openChannelsPage();
  else if (act === 'live') openLivePage();
  else if (act === 'scan') openScanPage();
  else if (act === 'shake') openShakePage();
  else if (act === 'look') openLookPage();
  else if (act === 'nearby') openNearbyPage();
  else if (act === 'shopping') openShoppingPage();
  else if (act === 'games') openGamesPage();
  else if (act === 'mini') openMiniPage();
  else if (act === 'profile' || act === 'qr') openProfilePage();
  else if (act === 'services') openServicesPage();
  else if (act === 'wallet') openWalletPage();
  else if (act === 'pay') openPayPage();
  else if (act === 'cards') openCardsPage();
  else if (act === 'emojiPack') openEmojiPage();
  else if (act === 'wxsettings') openSettingsPage();
  else if (act === 'parenttoggle') { WX.parentView = !WX.parentView; renderWeChat(); }
  else if (act === 'moments') { WX.view = 'moments'; WX.chatId = null; renderWeChat(); }
  else if (act === 'favorites') { WX.view = 'favorites'; WX.chatId = null; renderWeChat(); }
  else if (act === 'backdiscover') { WX.view = 'discover'; renderWeChat(); }
  else if (act === 'closechat') closeChat();
  else if (act === 'chatmore') openChatMore();
  else if (act === 'send') sendCurrentText();
  else if (act === 'emoji') { WX.emoji = !WX.emoji; openEmojiPanel(); }
  else if (act === 'plusTools') {
    WX.tools = !WX.tools;
    const box = $('#chatTools');
    if (box) box.classList.toggle('hidden', !WX.tools);
    if (WX.tools) {
      WX.emoji = false;
      const ep = $('#emojiPanel');
      if (ep) { ep.classList.add('hidden'); ep.innerHTML = ''; }
    }
    setTimeout(scrollChat, 40);
  }
  else if (act === 'voice') toast('按住说话…算了，还是打字吧');
  else if (act.startsWith('openchat-')) { WX.view = 'chats'; openChat(act.slice(9)); }
  else if (act === 'acceptfriend') {
    if (el) { el.textContent = '已添加'; el.disabled = true; el.style.color = '#a9b09f'; }
    toast('已通过，去打个招呼吧');
  }
  else if (act === 'tagfamily') toast('家人：妈妈、爸爸、我');
  else if (act === 'tagclass') toast('同学：王雨桐、你');
  else if (act === 'taglove') toast('恋爱：只有张泽禹');
  else if (act === 'scannow') {
    const box = $('#scanBox');
    if (box) box.innerHTML = `<div class="scan-done"><img src="assets/avatar.jpg" alt=""><b>扫到了张泽禹</b><span>他的微信名片 · 已置顶</span></div>`;
    toast('识别成功');
  }
  else if (act === 'shakeit') {
    const box = $('#shakeRes');
    if (box) box.innerHTML = `<div class="shake-card"><img src="assets/avatar.jpg" alt=""><b>张泽禹</b><span>距离 0.1km · 刚刚也在摇</span><button class="btn btn-primary" data-wxact="openchat-zeyu">打招呼</button></div>`;
  }
  else if (act === 'buygift') { toast('已下单，记得写他的名字'); }
  else if (act === 'article') {
    const a = D.articles[+el.dataset.idx] || D.articles[0];
    openSheet(sheet(a.title, a.sub || '看一看', `<div class="article-body">${a.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`));
  }
  else if (act === 'miniapp') {
    const app = el.dataset.app;
    closeApp();
    setTimeout(() => openApp(app), 180);
  }
  else if (act === 'toggleNotify') { state.notify = !state.notify; save(); openSettingsPage(); }
  else if (act === 'toggleSound') { state.sound = !state.sound; save(); openSettingsPage(); }
  else if (act === 'clearcache') { toast('缓存清好啦，回忆都还在'); }
  else if (act === 'logout') toast('这是你的手机，退不出去的');
  else if (act === 'addtag') toast('标签已经分好了：家人、同学、恋爱');
  else if (act === 'editinfo') { closeApp(); setTimeout(() => openApp('settings'), 150); }
}

/* ---------- 微信子页面 ---------- */
function openWxPage(title, body, back, mount) {
  WX.page = { title, body, back: back || 'discover', mount };
  WX.view = 'page';
  WX.chatId = null;
  renderWeChat();
}
function openSearchPage() {
  const back = ['chats', 'contacts', 'discover', 'me'].includes(WX.view) ? WX.view : 'chats';
  openWxPage('搜索', `<div class="wx-page-pad"><input id="wxSearchInput" class="wx-page-input" placeholder="搜索聊天记录、联系人、朋友圈"></div><div id="wxSearchRes"></div>`, back, () => {
    const inp = $('#wxSearchInput');
    const res = $('#wxSearchRes');
    if (!inp || !res) return;
    const items = [
      { name: '张泽禹', sub: '聊天记录 · 置顶', act: 'openchat-zeyu' },
      { name: '妈妈', sub: '联系人', act: 'openchat-mom' },
      { name: '爸爸', sub: '联系人', act: 'openchat-dad' },
      { name: '王雨桐', sub: '联系人', act: 'openchat-wang' },
      { name: '相亲相爱一家人', sub: '群聊', act: 'openchat-family' },
      { name: '有你', sub: '朋友圈 · 仅好友可见', act: 'moments' },
      { name: '你怀里很安心', sub: '朋友圈 · 屏蔽爸妈', act: 'moments' },
      { name: '收藏', sub: `暗恋到表白 · ${D.favorites.length} 条`, act: 'favorites' }
    ];
    const draw = () => {
      const q = inp.value.trim();
      const list = items.filter((x) => !q || x.name.includes(q) || x.sub.includes(q));
      res.innerHTML = `<div class="wx-list">${list.map((x) => `<button class="wx-cell" data-wxact="${x.act}"><div class="wx-avatar"><div class="mono">${x.name[0]}</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">${esc(x.name)}</span></div><div class="wx-preview">${esc(x.sub)}</div></div></button>`).join('') || '<div class="wx-empty">没有找到，换个词试试</div>'}</div>`;
      $$('#wxSearchRes [data-wxact]').forEach((b) => { b.onclick = () => wxAction(b.dataset.wxact, b); });
    };
    inp.oninput = draw;
    draw();
    setTimeout(() => inp.focus(), 60);
  });
}
function openNewFriendsPage() {
  openWxPage('新的朋友', `<div class="wx-list">
    <div class="wx-cell"><div class="wx-avatar"><div class="mono" style="background:linear-gradient(135deg,#c9b3d9,#9d86b0)">陈</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">陈星</span></div><div class="wx-preview">请求添加你为朋友</div></div><button class="wx-mini-btn" data-wxact="acceptfriend">接受</button></div>
    <div class="wx-cell"><div class="wx-avatar"><div class="mono" style="background:linear-gradient(135deg,#a8bf8d,#6f8f52)">桐</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">王雨桐</span></div><div class="wx-preview">已经是你的朋友</div></div><span class="wx-mini-btn done">已添加</span></div>
  </div><div class="wx-empty">通过后，TA 会出现在通讯录里</div>`, 'contacts');
}
function openGroupsPage() {
  openWxPage('群聊', `<div class="wx-list">
    ${contactRow('family', '相亲相爱一家人', '3人 · 爸妈不知道你在恋爱', false)}
  </div><div class="wx-empty">你创建或加入的群聊</div>`, 'contacts');
}
function openTagsPage() {
  openWxPage('标签', `<div class="wx-list">
    ${contactRow('family', '家人', '3人 · 妈妈、爸爸、我', false)}
    ${contactRow('wang', '同学', '2人 · 王雨桐、我', false)}
    ${contactRow('zeyu', '恋爱', '1人 · 只对他可见', false)}
  </div><div class="wx-page-tip">标签用来分组看朋友圈，爸妈永远在「家人」里。</div>`, 'contacts');
}
function openOfficialPage() {
  openWxPage('公众号', `<div class="wx-list">
    <button class="wx-cell" data-wxact="article" data-idx="0"><div class="wx-avatar"><img src="assets/avatar.jpg" alt=""></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">张泽禹的小行星</span><span class="wx-time">1篇</span></div><div class="wx-preview">今天也想把喜欢说给你听</div></div></button>
  </div><div class="wx-page-tip">他偶尔会在这里写一点东西，只给你看。</div>`, 'contacts');
}
function openChannelsPage() {
  openWxPage('视频号', `<div class="wx-channel">
    <div class="wx-channel-video" style="background-image:url('assets/g1.jpg')"><span class="wx-channel-play">${icon('play')}</span><span class="wx-channel-like" data-wxact="likechannel">${icon('heart')}</span></div>
    <div class="wx-channel-meta"><b>张泽禹</b><span>冬夜里的一点灯光 · 12月</span></div>
    <div class="wx-channel-video" style="background-image:url('assets/g2.jpg')"><span class="wx-channel-play">${icon('play')}</span><span class="wx-channel-like" data-wxact="likechannel">${icon('heart')}</span></div>
    <div class="wx-channel-meta"><b>张泽禹</b><span>排练结束，路灯下有雪 · 11月</span></div>
  </div>`, 'discover', () => {
    $$('[data-wxact="likechannel"]').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); b.classList.toggle('on'); toast(b.classList.contains('on') ? '已点亮' : '取消点赞'); };
    });
  });
}
function openLivePage() {
  openWxPage('直播', `<div class="wx-live">
    <div class="wx-live-cover"><img src="assets/avatar.jpg" alt=""><span>未开播</span></div>
    <h3>张泽禹</h3><p>他还没有开播，先预约一下吧。</p>
    <button class="btn btn-primary" data-wxact="liveremind">${icon('bell')} 开播提醒</button>
  </div>`, 'discover', () => {
    const b = $('[data-wxact="liveremind"]');
    if (b) b.onclick = () => { b.textContent = '已预约，开播会叫你'; b.disabled = true; toast('好啦，我第一时间叫你'); };
  });
}
function openScanPage() {
  openWxPage('扫一扫', `<div class="scan-wrap" id="scanBox"><div class="scan-frame"><i></i></div><p>把二维码放进框里</p></div><div class="wx-page-pad"><button class="btn btn-primary btn-block" data-wxact="scannow">开始扫描</button></div>`, 'discover');
}
function openShakePage() {
  openWxPage('摇一摇', `<div class="shake-wrap"><div class="shake-phone">${icon('phone')}</div><p>摇一摇，看看能遇见谁</p><button class="btn btn-primary" data-wxact="shakeit">摇一下</button></div><div id="shakeRes"></div>`, 'discover');
}
function openLookPage() {
  openWxPage('看一看', `<div class="wx-list">${D.articles.map((a, i) => `<button class="wx-cell" data-wxact="article" data-idx="${i}"><div class="wx-avatar"><div class="mono">看</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">${esc(a.title)}</span><span class="wx-time">${i + 1} 篇</span></div><div class="wx-preview">${esc(a.sub || '')}</div></div></button>`).join('')}</div>`, 'discover');
}
function openNearbyPage() {
  openWxPage('附近', `<div class="wx-list">
    <button class="wx-cell" data-wxact="openchat-zeyu"><div class="wx-avatar"><img src="assets/avatar.jpg" alt=""></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">张泽禹</span><span class="wx-time">0.1km</span></div><div class="wx-preview">刚刚路过你楼下</div></div></button>
    <button class="wx-cell" data-wxact="openchat-wang"><div class="wx-avatar"><div class="mono" style="background:linear-gradient(135deg,#c9b3d9,#9d86b0)">桐</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">王雨桐</span><span class="wx-time">0.3km</span></div><div class="wx-preview">在奶茶店排队</div></div></button>
  </div><div class="wx-page-tip">附近的人只能看到你愿意公开的距离。</div>`, 'discover');
}
function openShoppingPage() {
  openWxPage('购物', `<div class="wx-shop">${[
    { img: 'assets/g3.jpg', name: '一条暖和的围巾', price: '129' },
    { img: 'assets/g5.jpg', name: '印着名字的杯子', price: '59' },
    { img: 'assets/g7.jpg', name: '写给他的信纸', price: '19' }
  ].map((x) => `<div class="wx-good"><img src="${x.img}" alt=""><div><b>${x.name}</b><span>¥${x.price}</span></div><button class="wx-mini-btn" data-wxact="buygift">购买</button></div>`).join('')}</div>`, 'discover');
}
function openGamesPage() {
  openWxPage('游戏', `<div class="wx-menu">
    ${menuRow('jumpplay', '跳一跳', 'play', '和他比一比')}
    ${menuRow('gameyang', '羊了个羊', 'gift', '第二关永远过不去')}
  </div><div class="wx-page-tip">小游戏只是陪衬，真正想赢的是他的心。</div>`, 'discover', () => {
    const j = $('[data-wxact="jumpplay"]');
    if (j) j.onclick = () => openJumpGame();
    const y = $('[data-wxact="gameyang"]');
    if (y) y.onclick = () => toast('今天的第二关，还是没过');
  });
}
function openMiniPage() {
  openWxPage('小程序', `<div class="wx-menu">
    ${menuRow('miniapp', '天气', 'weather', '')}
    ${menuRow('miniapp', '一起听歌', 'music', '')}
    ${menuRow('miniapp', '外卖', 'food', '')}
    ${menuRow('miniapp', '日历', 'calendar', '')}
  </div>`, 'discover', () => {
    const apps = ['weather', 'music', 'food', 'calendar'];
    $$('[data-wxact="miniapp"]').forEach((b, i) => { b.dataset.app = apps[i]; b.onclick = () => wxAction('miniapp', b); });
  });
}
function openProfilePage() {
  openWxPage('个人信息', `<div class="wx-profile">
    <div class="wx-profile-ava">${myAvatarHTML()}</div>
    <h3>${esc(state.username || '小梦')}</h3>
    <p>微信号：mengyi_0430</p>
    <div class="wx-qr-box"><div class="wx-qr"></div><span>扫一扫上面的二维码，加我为朋友</span></div>
  </div>
  <div class="wx-menu">
    ${menuRow('editname', '名字', 'edit', state.username || '小梦')}
    ${menuRow('editavatar', '头像', 'camera', state.myAvatar ? '已自定义' : '默认')}
    ${menuRow('editinfo', '更多信息', 'info', '')}
  </div>`, 'me', () => {
    $$('[data-wxact="editname"]').forEach((b) => { b.onclick = () => editProfile(); });
    $$('[data-wxact="editavatar"]').forEach((b) => { b.onclick = () => pickAvatar(); });
  });
}
function openServicesPage() {
  openWxPage('服务', `<div class="pay-card">
    <div class="pay-card-top"><span>零钱</span><b>¥520.30</b></div>
    <div class="pay-grid">
      <button data-wxact="pay">${icon('transfer')}<span>收付款</span></button>
      <button data-wxact="wallet">${icon('transfer')}<span>钱包</span></button>
      <button data-wxact="wallet">${icon('list')}<span>账单</span></button>
      <button data-wxact="pay">${icon('gift')}<span>红包</span></button>
    </div>
  </div>
  <div class="wx-menu">
    ${menuRow('wallet', '钱包', 'transfer', '¥520.30')}
    ${menuRow('pay', '收付款', 'qr', '')}
    ${menuRow('wallet', '账单', 'list', '本月 3 笔')}
  </div>`, 'me');
}
function openWalletPage() {
  const orders = state.orders || [];
  const tickets = state.tickets || [];
  openWxPage('钱包', `<div class="pay-card"><div class="pay-card-top"><span>余额</span><b>¥520.30</b></div><p class="pay-note">这些钱都留给你，买点好吃的。</p></div>
  <div class="wx-menu">
    ${menuRow('wallet', '零钱通', 'transfer', '¥0.00')}
    ${menuRow('wallet', '银行卡', 'transfer', '尾号 0430')}
  </div>
  <div class="wx-section-title">最近账单</div>
  <div class="wx-list">
    ${orders.slice(0, 3).map((o) => `<div class="wx-cell"><div class="wx-avatar"><div class="mono">单</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">${esc(o.store || '外卖')}</span><span class="wx-time">-¥${esc(o.total || '0')}</span></div><div class="wx-preview">${esc(o.items || '')}</div></div></div>`).join('')}
    ${tickets.slice(0, 2).map((t) => `<div class="wx-cell"><div class="wx-avatar"><div class="mono">票</div></div><div class="wx-main"><div class="wx-row1"><span class="wx-name">${esc(t.no || '车票')}</span><span class="wx-time">-¥${esc(t.price || '0')}</span></div><div class="wx-preview">${esc(t.from || '')} → ${esc(t.to || '')}</div></div></div>`).join('')}
    ${!orders.length && !tickets.length ? '<div class="wx-empty">还没有账单，先去吃点好的</div>' : ''}
  </div>
  <div class="wx-page-pad"><button class="btn btn-primary btn-block" data-wxact="pay">收付款</button></div>`, 'me');
}
function openPayPage() {
  openWxPage('收付款', `<div class="wx-pay-qr"><div class="wx-qr big"></div><b>向商家付款</b><span>演示用，不会真的扣钱</span></div><div class="wx-menu">${menuRow('pay', '零钱', 'transfer', '¥520.30')}${menuRow('pay', '优先使用', 'check', '零钱')}</div>`, 'me');
}
function openCardsPage() {
  openWxPage('卡包', `<div class="wx-card-gift"><div><span>生日礼物卡</span><b>张泽禹 · 04.30</b></div><em>已领取</em></div><div class="wx-page-tip">卡包里只有一张卡，是他给的。</div>`, 'me');
}
function openEmojiPage() {
  const list = ['😊', '🥰', '😘', '🌙', '⭐', '❄️', '🎂', '🎁', '💌', '🧣', '☕', '🍰', '🐻', '🌷', '💕', '✨', '🥺', '😴', '🫶', '🎵'];
  openWxPage('表情', `<div class="emoji-grid">${list.map((e) => `<button data-wxact="sendemoji" data-emoji="${e}">${e}</button>`).join('')}</div><div class="wx-page-tip">点一下，发到和他的聊天里。</div>`, 'me', () => {
    $$('[data-wxact="sendemoji"]').forEach((b) => { b.onclick = () => { const e = b.dataset.emoji; WX.view = 'chats'; WX.chatId = 'zeyu'; openChat('zeyu'); setTimeout(() => { const inp = $('#wxInput'); if (inp) { inp.value += e; inp.focus(); } }, 120); }; });
  });
}
function openSettingsPage() {
  openWxPage('设置', `<div class="wx-menu">
    <button class="wx-menu-row" data-wxact="toggleNotify"><span class="wm-ic">${icon('bell')}</span><span class="wm-name">新消息通知</span><span class="switch ${state.notify ? 'on' : ''}"></span></button>
    <button class="wx-menu-row" data-wxact="toggleSound"><span class="wm-ic">${icon('volume')}</span><span class="wm-name">声音</span><span class="switch ${state.sound ? 'on' : ''}"></span></button>
  </div>
  <div class="wx-menu">
    ${menuRow('editname', '账号与安全', 'lock', '')}
    ${menuRow('parenttoggle', '隐私', 'eyeOff', '朋友圈分组')}
    ${menuRow('clearcache', '通用', 'settings', '')}
    ${menuRow('info', '帮助与反馈', 'info', '')}
    ${menuRow('info', '关于微信', 'wechat', '8.0.43')}
  </div>
  <div class="wx-menu"><button class="wx-menu-row" data-wxact="logout"><span class="wm-name" style="color:#c05e56;text-align:center;flex:1">退出登录</span></button></div>`, 'me', () => {
    $$('[data-wxact="editname"]').forEach((b) => { b.onclick = () => editProfile(); });
    $$('[data-wxact="info"]').forEach((b) => { b.onclick = () => toast('这些都不重要，重要的是他'); });
  });
}
function openEmojiPanel() {
  const box = $('#emojiPanel');
  if (!box) return;
  if (WX.emoji) {
    box.classList.remove('hidden');
    box.innerHTML = `<div class="emoji-quick">${['😊', '🥰', '😘', '🌙', '❄️', '🎂', '💌', '☕', '🧣', '🍰'].map((e) => `<button data-emoji="${e}">${e}</button>`).join('')}</div>`;
    $$('#emojiPanel [data-emoji]').forEach((b) => { b.onclick = () => { const inp = $('#wxInput'); if (inp) { inp.value += b.dataset.emoji; inp.focus(); } }; });
    const tools = $('#chatTools'); if (tools) tools.classList.add('hidden');
    WX.tools = false;
  } else {
    box.classList.add('hidden');
    box.innerHTML = '';
  }
  setTimeout(scrollChat, 40);
}
function openJumpGame() {
  openModal(`<h3>跳一跳</h3><p style="font-size:10px;color:#9aa28f;margin-top:6px">按住蓄力，松手起跳。</p><div class="jump-box"><div class="jump-dot" id="jumpDot"></div></div><div class="modal-acts"><button class="btn btn-ghost" data-close-modal>退出</button><button class="btn btn-primary" id="jumpBtn">按住</button></div>`);
  bindModalClosers();
  const dot = $('#jumpDot');
  const btn = $('#jumpBtn');
  let score = 0, t = null;
  const start = () => { t = setInterval(() => { score++; dot.style.transform = `translateY(-${Math.min(score, 90)}px)`; }, 16); };
  const stop = () => {
    clearInterval(t);
    dot.style.transform = '';
    toast(`跳了 ${score} 分，他给你点了个赞`);
    score = 0;
  };
  btn.onmousedown = start; btn.onmouseup = stop; btn.ontouchstart = start; btn.ontouchend = stop;
}

function openChat(id) {
  if (!D.chats[id] && id !== 'zeyu') return;
  WX.chatId = id;
  state.unread[id] = 0;
  save();
  renderWeChat();
  renderHome();
  renderLockNotes();
  setTimeout(scrollChat, 40);
}
function closeChat() {
  WX.chatId = null; WX.tools = false; WX.typing = false;
  renderWeChat();
}
function refreshChat() {
  if (!WX.chatId) return;
  const body = $('#chatBody');
  if (!body) return;
  const other = WX.chatId === 'zeyu' ? { name: '张泽禹', who: 'zeyu' } : OTHER_META[WX.chatId];
  const msgs = WX.chatId === 'zeyu' ? state.chat : D.chats[WX.chatId].messages;
  body.innerHTML = messagesHTML(msgs, other);
  bindChatMedia();
  scrollChat();
}
function scrollChat() {
  const body = $('#chatBody');
  if (body) body.scrollTop = body.scrollHeight;
}
function bindChat() {
  const input = $('#wxInput');
  if (input) {
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 76) + 'px';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCurrentText(); }
    });
  }
  bindChatMedia();
  const more = $('[data-wxact="chatmore"]');
  if (more) more.onclick = openChatMore;
  $$('[data-tool]').forEach((b) => { b.onclick = () => chatTool(b.dataset.tool); });
  scrollChat();
}
function bindChatMedia() {
  $$('#chatBody [data-img]').forEach((el) => {
    el.onclick = () => openImageViewer(el.dataset.img);
  });
  $$('#chatBody [data-voice]').forEach((el) => {
    el.onclick = () => {
      toast(`正在播放 ${el.dataset.voice}″ 语音…`);
      setTimeout(() => toast('他：别笑我啊。'), 1400);
    };
  });
}
function openImageViewer(src) {
  openModal(`<img src="${src}" style="width:100%;border-radius:14px" alt=""><div style="text-align:center;margin-top:12px"><button class="btn btn-ghost" data-close-modal>收起</button></div>`);
}

function sendCurrentText() {
  if (WX.chatId !== 'zeyu') return;
  const input = $('#wxInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const now = new Date();
  state.chat.push({ from: 'me', type: 'text', text, at: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
  input.value = '';
  input.style.height = 'auto';
  ding('send');
  save();
  refreshChat();
  if (WX.tools) { WX.tools = false; $('#chatTools').classList.add('hidden'); }
  if (WX.emoji) { WX.emoji = false; const ep = $('#emojiPanel'); if (ep) { ep.classList.add('hidden'); ep.innerHTML = ''; } }
  replyLater(text);
}
function replyLater(text) {
  const sub = $('#chatSub');
  WX.typing = true;
  if (sub) sub.textContent = '对方正在输入…';
  const body = $('#chatBody');
  if (body) {
    body.insertAdjacentHTML('beforeend', `<div class="msg" id="typingMsg"><div class="msg-ava"><img src="assets/avatar.jpg" alt=""></div><div class="typing"><i></i><i></i><i></i></div></div>`);
    scrollChat();
  }
  const delay = 1100 + Math.random() * 1200;
  setTimeout(() => {
    WX.typing = false;
    if (sub) sub.textContent = '';
    const t = $('#typingMsg'); if (t) t.remove();
    const reply = chooseReply(text);
    const now = new Date();
    state.chat.push({ from: 'him', type: 'text', text: reply, at: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
    state.unread.zeyu = 0;
    save();
    refreshChat();
    renderHome();
    renderLockNotes();
    ding('msg');
  }, delay);
}
function chooseReply(text) {
  if (state.nextReply && state.nextReply.trim()) {
    const r = state.nextReply.trim();
    state.nextReply = '';
    save();
    return r.replace(/\{pet\}/g, petName());
  }
  const t = String(text || '').trim();
  const map = [
    [/想你|想我|想见|梦到/, 'miss'],
    [/喜欢|爱你|爱不|心动/, 'love'],
    [/晚安|睡了|睡觉|困|熬夜/, 'night'],
    [/早安|早上|醒了|起床/, 'morning'],
    [/吃|饭|饿|奶茶|外卖|蛋糕/, 'eat'],
    [/冷|凉|冻|秋裤|降温|下雪/, 'cold'],
    [/抱|怀里/, 'hug'],
    [/亲|mua|么么|啵/, 'kiss'],
    [/在哪|干嘛|干什么|做什么|忙啥/, 'where'],
    [/气|不理|哼|讨厌|烦/, 'angry'],
    [/累|辛苦|加班|排练/, 'tired'],
    [/到家|到了|回家|回宿舍/, 'home'],
    [/上课|考试|作业|复习|学习|成绩|论文/, 'study'],
    [/下雨|天气|热|刮风|晒/, 'weather'],
    [/哈尔滨|北京|车票|高铁|火车|旅游|出去玩|回东北/, 'travel'],
    [/照片|自拍|拍照|拍得|相册/, 'photo'],
    [/听歌|音乐|耳机|歌词|唱歌/, 'music'],
    [/生日|礼物|蛋糕/, 'birthday'],
    [/元旦|跨年|新年|倒计时/, 'newyear'],
    [/谢谢|谢啦|感谢|麻烦你/, 'thanks'],
    [/对不起|抱歉|我错|道歉/, 'sorry'],
    [/哈哈|笑死|好笑|嘿嘿|笑/, 'laugh'],
    [/吃醋|谁啊|那个女生|那个男生|别人|前任/, 'jealous'],
    [/你妈|你爸|你爸妈|叔叔|阿姨|见家长|家里人/, 'family'],
    [/以后|结婚|未来|毕业|一直|永远/, 'future']
  ];
  let key = 'default';
  for (const [re, k] of map) { if (re.test(t)) { key = k; break; } }
  if (key === 'default') {
    if (/^(嗯|哦|噢|好|行|可以|知道|收到|在|是|对|中)[。！!…~～\s]*$/.test(t)) key = 'short';
    else if (/好看|漂亮|可爱|帅|厉害|棒|优秀|牛/.test(t)) key = 'praise';
    else if (/[?？]|吗|呢|咋|怎么|为什么|啥|多少|几点|去哪|行不行|好不好/.test(t)) key = 'question';
  }
  const pool = (D.replies[key] || D.replies.default).slice();
  if (state.customReplies && state.customReplies.length && Math.random() < .42) {
    pool.push(...state.customReplies);
  }
  let reply = pool[Math.floor(Math.random() * pool.length)];
  const recent = [...state.chat].reverse().find((m) => m.from === 'him' && (!m.type || m.type === 'text'));
  if (recent && recent.text && pool.length > 1) {
    let tries = 0;
    while (reply === recent.text && tries++ < 6) {
      reply = pool[Math.floor(Math.random() * pool.length)];
    }
  }
  if (t.length >= 4 && t.length <= 24 && (key === 'default' || key === 'question') && Math.random() < .24) {
    const snip = t.replace(/[。！？!?~～\s]/g, '').slice(0, 10);
    const lead = [
      `你说“${snip}”，我看了两遍。`,
      `“${snip}”是吧？我记住了。`,
      `你跟我讲${snip}的时候，我正想着你呢。`
    ];
    reply = lead[Math.floor(Math.random() * lead.length)] + ' ' + reply;
  }
  return reply.replace(/\{pet\}/g, petName());
}

/* ---------- 聊天工具 ---------- */
function chatTool(kind) {
  if (WX.chatId !== 'zeyu') return;
  if (kind === 'gallery') openGalleryPicker();
  else if (kind === 'camera') openCameraCapture();
  else if (kind === 'location') openLocationPicker();
  else if (kind === 'transfer') openTransferSheet();
  else if (kind === 'fav') openFavPicker();
  else if (kind === 'voice') sendVoice();
  else if (kind === 'music') sendMusicCard();
  else if (kind === 'redpacket') openRedPacketSheet();
  else if (kind === 'gift') openGiftSheet();
  else if (kind === 'audiocall') { WX.tools = false; const box = $('#chatTools'); if (box) box.classList.add('hidden'); startCall('zeyu'); }
  else if (kind === 'videocall') { toast('他接起了视频…然后把镜头对向天花板'); }
}
function openRedPacketSheet() {
  openSheet(sheet('红包', '给他塞一个，不用真花钱', `
    <div class="field"><label>金额</label><input id="rpAmount" value="52.0" inputmode="decimal"></div>
    <div class="field"><label>留言</label><input id="rpNote" value="新年快乐，我的小乖"></div>
    <button class="btn btn-primary btn-block" id="rpGo">塞进红包</button>
    <div class="hint">演示红包，不会扣你的钱</div>`));
  $('#rpGo').onclick = () => {
    const amt = parseFloat($('#rpAmount').value || '0');
    if (!amt || amt <= 0) { toast('先填个金额'); return; }
    const note = $('#rpNote').value.trim() || '恭喜发财，大吉大利';
    closeSheet();
    sendMessageObject({ from: 'me', type: 'redpacket', amount: amt.toFixed(2), note }, '红包我收啦。晚上给你买好吃的，别嫌少。');
  };
}
function openGiftSheet() {
  const gifts = [
    { n: '一条围巾', e: '🧣' }, { n: '一杯热奶茶', e: '☕' },
    { n: '小蛋糕', e: '🍰' }, { n: '一束花', e: '🌷' }
  ];
  openSheet(sheet('礼物', '挑一个送给他', gifts.map((g, i) => `<div class="sheet-row" data-gift="${i}"><span style="font-size:18px">${g.e}</span><span style="flex:1">${g.n}</span><em>送出</em></div>`).join('')));
  $$('#sheetRoot [data-gift]').forEach((r) => {
    r.onclick = () => {
      const g = gifts[+r.dataset.gift];
      closeSheet();
      sendMessageObject({ from: 'me', type: 'gift', gift: g.n, emoji: g.e }, '收到啦。你怎么老想着给我买东西。');
    };
  });
}
function addCallSummary(lines, dur) {
  if (!lines || !lines.length) return;
  const now = new Date();
  state.chat.push({
    from: 'me', type: 'call', dur,
    text: `语音通话 · ${dur}`,
    lines: lines.slice(-8).map((l) => ({ from: l.from, text: l.text })),
    at: `${pad(now.getHours())}:${pad(now.getMinutes())}`
  });
  save();
  renderHome();
  renderLockNotes();
  if (typeof currentApp !== 'undefined' && currentApp === 'wechat' && WX.chatId === 'zeyu') refreshChat();
  ding('msg');
}
function sendMessageObject(obj, ack) {
  const now = new Date();
  obj.at = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  state.chat.push(obj);
  save();
  refreshChat();
  renderHome();
  if (ack) setTimeout(() => {
    state.chat.push({ from: 'him', type: 'text', text: ack.replace(/\{pet\}/g, petName()), at: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
    save(); refreshChat(); ding('msg');
  }, 1200);
}
function openGalleryPicker() {
  const imgs = D.gallery.filter((g) => !g.src.includes('photostrip')).slice(0, 12);
  openSheet(sheet('选择图片', '挑一张发给他', `<div class="picker-grid">${imgs.map((g) => `<button data-pick="${g.src}"><img src="${g.src}" alt=""></button>`).join('')}</div>`));
  $$('#sheetRoot [data-pick]').forEach((b) => {
    b.onclick = () => {
      closeSheet();
      sendMessageObject({ from: 'me', type: 'image', img: b.dataset.pick, text: '' }, '这张我存了。别删啊，我手机里也有一份。');
    };
  });
}
function openCameraCapture() {
  const existing = $('#camCaptureModal');
  if (existing) existing.remove();
  openModal(`<h3>拍摄</h3><div style="margin-top:12px;border-radius:14px;overflow:hidden;background:#111;aspect-ratio:4/5"><video id="wxCamVideo" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1)"></video></div><div class="modal-acts"><button class="btn btn-ghost" id="wxCamCancel">取消</button><button class="btn btn-primary" id="wxCamShot">拍下</button></div>`);
  const video = $('#wxCamVideo');
  let stream = null;
  navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then((s) => { stream = s; video.srcObject = s; })
    .catch(() => {
      closeModal();
      toast('没有拿到摄像头，改用相册');
      openGalleryPicker();
    });
  $('#wxCamCancel').onclick = () => { stopCam(); closeModal(); };
  $('#wxCamShot').onclick = () => {
    if (!stream) return;
    const c = document.createElement('canvas');
    c.width = 720; c.height = 900;
    const ctx = c.getContext('2d');
    const vw = video.videoWidth || 720, vh = video.videoHeight || 900;
    const scale = Math.max(c.width / vw, c.height / vh);
    ctx.translate(c.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, (c.width - vw * scale) / 2, (c.height - vh * scale) / 2, vw * scale, vh * scale);
    const data = c.toDataURL('image/jpeg', .82);
    stopCam(); closeModal();
    sendMessageObject({ from: 'me', type: 'image', img: data, text: '拍给你看' }, '好看。我说人，不是照片。');
  };
  function stopCam() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; }
}
function openLocationPicker() {
  const places = [
    { place: '哈尔滨 · 中央大街', addr: '黑龙江省哈尔滨市道里区' },
    { place: '北京 · 南锣鼓巷', addr: '北京市东城区' },
    { place: '南京 · 先锋书店', addr: '江苏省南京市鼓楼区' }
  ];
  openSheet(sheet('发送位置', '你在哪儿，我记一下', places.map((p, i) => `<div class="sheet-row" data-loc="${i}">${icon('location')}<span>${p.place}</span></div>`).join('')));
  $$('#sheetRoot [data-loc]').forEach((r) => {
    r.onclick = () => {
      const p = places[+r.dataset.loc];
      closeSheet();
      sendMessageObject({ from: 'me', type: 'location', place: p.place, addr: p.addr }, '这地儿我知道。等我放假回去，带你去吃马迭尔。');
    };
  });
}
function openTransferSheet() {
  openSheet(sheet('转账', '给他转点「恋爱基金」', `
    <div class="field"><label>金额</label><input id="trAmount" type="number" inputmode="decimal" placeholder="0.00" style="font-size:22px;font-family:var(--serif)"></div>
    <div class="opt-row" style="margin-bottom:14px">
      <button class="opt" data-amt="52">52.0</button><button class="opt" data-amt="520">520</button><button class="opt" data-amt="1314">1314</button>
    </div>
    <div class="field"><label>备注</label><input id="trNote" value="给你买好吃的"></div>
    <button class="btn btn-primary btn-block" id="trGo">确认转账</button>
    <div style="font-size:9px;color:#b3b8a8;text-align:center;margin-top:10px">演示用，不产生真实扣款</div>`));
  $$('#sheetRoot [data-amt]').forEach((b) => { b.onclick = () => { $('#trAmount').value = b.dataset.amt; }; });
  $('#trGo').onclick = () => {
    const amt = parseFloat($('#trAmount').value || '0');
    if (!amt || amt <= 0) { toast('先填个金额'); return; }
    const note = $('#trNote').value || '转账';
    closeSheet();
    sendMessageObject({ from: 'me', type: 'transfer', amount: amt.toFixed(2), note }, '你干啥呀，收回去。…行吧我收着，以后给你花。');
  };
}
function openFavPicker() {
  openSheet(sheet('收藏', '把心里的话发给他', D.favorites.map((f, i) => `<div class="sheet-row" data-fav="${i}">${icon('heart')}<span style="flex:1">${esc(f.quote)}</span><em>${f.stage}</em></div>`).join('')));
  $$('#sheetRoot [data-fav]').forEach((r) => {
    r.onclick = () => {
      const f = D.favorites[+r.dataset.fav];
      closeSheet();
      const input = $('#wxInput');
      if (input) { input.value = '「' + f.quote + '」'; sendCurrentText(); }
    };
  });
}
function sendVoice() {
  sendMessageObject({ from: 'me', type: 'voice', dur: 4 }, '嗓子咋有点哑。多喝热水，听见没。');
}
function sendMusicCard() {
  sendMessageObject({ from: 'me', type: 'music', title: '晚风告白' }, '好啊。我戴耳机了，你放。');
  setTimeout(() => toast('已分享到「一起听歌」'), 600);
}
function insertEmoji() {
  const input = $('#wxInput');
  if (input) { input.value += '😊'; input.focus(); }
}

function openChatMore() {
  openSheet(sheet('聊天设置', '只属于你们的聊天', `
    <div class="sheet-row" data-more="reply">${icon('edit')}<span>回复设置</span><em>昵称 / 指定回复</em></div>
    <div class="sheet-row" data-more="search">${icon('search')}<span>查找聊天记录</span></div>
    <div class="sheet-row" data-more="bg">${icon('image')}<span>聊天背景</span><em>他的照片</em></div>
    <div class="sheet-row" data-more="clear">${icon('trash')}<span style="color:#c05e56">清空聊天记录</span></div>`));
  $$('#sheetRoot [data-more]').forEach((r) => {
    r.onclick = () => {
      const a = r.dataset.more;
      closeSheet();
      if (a === 'reply') openReplySettings();
      else if (a === 'search') toast('搜到的都是他');
      else if (a === 'bg') toast('背景已经是他的照片啦');
      else if (a === 'clear') {
        openModal(modal('清空聊天记录', '<p>聊天记录会全部消失，<br>但喜欢不会。</p>', '<button class="btn btn-ghost" data-close-modal>再想想</button><button class="btn btn-primary" id="doClear">清空</button>'));
        bindModalClosers();
        $('#doClear').onclick = () => {
          state.chat = state.chat.filter((m) => m.type === 'stage' || m.type === 'date');
          save(); closeModal(); refreshChat(); toast('清空了。他还会再发来的。');
        };
      }
    };
  });
}
function openReplySettings() {
  openSheet(sheet('回复设置', '他会怎么叫你、怎么回你', `
    <div class="field"><label>他对你的称呼</label><input id="rsPet" value="${esc(state.petName || '')}" placeholder="${esc(petName())}"><div class="hint">留空会根据你的微信名自动生成。现在是「${esc(petName())}」。</div></div>
    <div class="field"><label>下一条指定回复</label><textarea id="rsNext" placeholder="写下你想让他说的下一句话">${esc(state.nextReply || '')}</textarea><div class="hint">只生效一次，说完就恢复自动回复。</div></div>
    <div class="field"><label>自定义回复库（一行一句）</label><textarea id="rsPool" placeholder="例如：今天也要想我。">${esc((state.customReplies || []).join('\n'))}</textarea><div class="hint">自动回复时有一定概率用到这些话。</div></div>
    <button class="btn btn-primary btn-block" id="rsSave">保存</button>
    <button class="btn btn-block" id="rsDefault" style="margin-top:8px;background:transparent;color:#a0a79a;font-size:11px">恢复默认昵称</button>`));
  $('#rsSave').onclick = () => {
    state.petName = $('#rsPet').value.trim();
    state.nextReply = $('#rsNext').value.trim();
    state.customReplies = $('#rsPool').value.split('\n').map((s) => s.trim()).filter(Boolean);
    save(); closeSheet(); refreshChat(); toast('设置好啦');
  };
  $('#rsDefault').onclick = () => { state.petName = ''; save(); $('#rsPet').value = ''; toast('昵称恢复自动生成'); };
}

/* ---------- 朋友圈 ---------- */
function renderMoments() {
  const posts = WX.parentView ? D.posts.filter((p) => p.who === 'me' && p.visibility === 'public') : D.posts;
  return `<div class="moments">
    <div class="mm-cover">
      <div class="mm-me"><span class="name">${esc(state.username || '小梦')}</span><span class="ava">${myAvatarHTML()}</span></div>
    </div>
    <div class="mm-parent-toggle">
      <span>以爸妈视角查看朋友圈</span>
      <button class="switch ${WX.parentView ? 'on' : ''}" id="parentToggle"></button>
    </div>
    ${WX.parentView ? `<div class="mm-note">${icon('eyeOff')}<span>爸妈看到的是这样的：岁月静好，女儿单身。<br>恋爱的那些，一条都没让他们看见。</span></div>` : ''}
    ${posts.map(momentPost).join('')}
    <div style="height:26px"></div>
  </div>`;
}
function momentPost(p) {
  const mine = p.who === 'me';
  const liked = (state.likedPosts || []).includes(p.id);
  return `<div class="mm-post" data-post="${p.id}">
    <div class="mm-head">
      <div class="mm-ava">${mine ? myAvatarHTML() : `<img src="assets/avatar.jpg" alt="">`}</div>
      <div style="flex:1;min-width:0">
        <div class="mm-name">${mine ? esc(state.username || '小梦') : '张泽禹'}</div>
        <div class="mm-text">${esc(p.text)}</div>
        <div class="mm-imgs ${p.imgs.length === 1 ? 'one' : ''}">${p.imgs.map((i) => `<img src="${i}" alt="" data-img="${i}">`).join('')}</div>
        <div class="mm-meta">
          <div class="mm-time">${esc(p.time)}${p.visibility === 'blocked' && !WX.parentView ? `<span class="mm-vis">${icon('eyeOff')}不给看：爸爸妈妈</span>` : ''}</div>
          <div class="mm-actions"><button class="mm-act ${liked ? 'liked' : ''}" data-like="${p.id}">${icon('heart')}</button><button class="mm-act" data-cmt="${p.id}">${icon('comment')}</button></div>
        </div>
        <div class="mm-social">
          <div class="mm-likes">${icon('heart')}${p.likes.join('、')}${liked ? '、我' : ''}</div>
          ${p.comments.map((c) => `<div class="mm-comment"><b>${esc(c.name)}：</b>${esc(c.text)}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="mm-sep"></div>
  </div>`;
}
function bindMoments() {
  const toggle = $('#parentToggle');
  if (toggle) toggle.onclick = () => { WX.parentView = !WX.parentView; renderWeChat(); };
  $$('[data-like]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.like;
      const arr = state.likedPosts || [];
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1); else arr.push(id);
      state.likedPosts = arr; save(); renderWeChat();
    };
  });
  $$('[data-cmt]').forEach((b) => {
    b.onclick = () => {
      const p = D.posts.find((x) => x.id === b.dataset.cmt);
      openSheet(sheet('评论', p ? p.text : '', `
        <div class="field"><textarea id="cmtText" placeholder="说点什么…"></textarea></div>
        <button class="btn btn-primary btn-block" id="cmtSend">发送</button>`));
      $('#cmtSend').onclick = () => {
        const t = $('#cmtText').value.trim();
        if (!t) return;
        if (p) p.comments.push({ name: state.username || '我', text: t });
        closeSheet(); renderWeChat(); ding('send');
      };
    };
  });
  $$('.mm-imgs [data-img]').forEach((img) => {
    img.onclick = () => openImageViewer(img.dataset.img);
  });
}

/* ---------- 收藏 ---------- */
function renderFavorites() {
  return `<div class="fav-wrap">
    <div class="fav-hero"><h2>收藏</h2><p>从暗恋，到表白。<br>我把每一句都留下来了。</p></div>
    <div class="fav-timeline">
      ${D.favorites.map((f) => `<div class="fav-item">
        <div class="fav-date"><span>${f.date}</span><span class="fav-stage">${f.stage}</span></div>
        <div class="fav-quote">「${esc(f.quote)}」</div>
        ${f.voice ? `<div class="fav-voice" data-favvoice><span>${icon('play')}</span><div class="wave">${'<i></i>'.repeat(18)}</div><span>00:13</span></div>` : ''}
        <div class="fav-from">${icon('heart')}${esc(f.from)}</div>
      </div>`).join('')}
      <div class="fav-item final">
        <div class="fav-date"><span>2026.05.01</span><span class="fav-stage">现在</span></div>
        <div class="fav-quote">「往后余生，请多指教呗。」</div>
        <div class="fav-from">他说得很轻，但我听见了。</div>
      </div>
      <div class="fav-letter">
        <h3>写给你的最后一页</h3>
        <p>以前喜欢一个人，是偷偷把他的名字写在草稿纸角落，然后赶紧擦掉。<br><br>后来他问我，愿不愿意。我说愿意。<br><br>再后来，手机密码变成了 0430，朋友圈分成了两组，爸妈那一组里，我永远是一个只顾着学习和吃饭的小孩。<br><br>可只有我知道，我心里住着一个人。</p>
        <div class="sign">—— 梦噫 · ${esc(state.username || '小梦')}</div>
      </div>
    </div>
    <div style="height:26px"></div>
  </div>`;
}
function bindFavorites() {
  $$('[data-favvoice]').forEach((el) => {
    el.onclick = () => {
      toast('播放语音：别笑我啊…');
      el.querySelector('.wave').style.opacity = '.4';
      setTimeout(() => { el.querySelector('.wave').style.opacity = '1'; toast('播放完了。他当时很紧张。'); }, 2000);
    };
  });
}

/* ---------- 我 / 设置 ---------- */
function openWxSettings() {
  openSheet(sheet('设置', '账号与朋友圈', `
    <div class="sheet-row" data-wxs="profile">${icon('user')}<span>我的微信名</span><em>${esc(state.username || '小梦')}</em></div>
    <div class="sheet-row" data-wxs="avatar">${icon('camera')}<span>我的头像</span><em>${state.myAvatar ? '已自定义' : '默认'}</em></div>
    <div class="sheet-row" data-wxs="pet">${icon('heart')}<span>他对我的称呼</span><em>${esc(petName())}</em></div>
    <div class="sheet-row" data-wxs="reply">${icon('edit')}<span>回复设置</span></div>
    <div class="sheet-row" data-wxs="privacy">${icon('eyeOff')}<span>朋友圈分组</span><em>屏蔽爸妈</em></div>
    <div class="sheet-row" data-wxs="clear">${icon('trash')}<span style="color:#c05e56">清空聊天记录</span></div>`));
  $$('#sheetRoot [data-wxs]').forEach((r) => {
    r.onclick = () => {
      const a = r.dataset.wxs;
      if (a === 'profile') { closeSheet(); editProfile(); }
      else if (a === 'avatar') { closeSheet(); pickAvatar(); }
      else if (a === 'pet') { closeSheet(); openReplySettings(); }
      else if (a === 'reply') { closeSheet(); openReplySettings(); }
      else if (a === 'privacy') toast('爸妈永远看不到你的恋爱分组');
      else if (a === 'clear') {
        state.chat = state.chat.filter((m) => m.type === 'stage' || m.type === 'date');
        save(); closeSheet(); refreshChat(); toast('聊天记录已清空');
      }
    };
  });
}
function editProfile() {
  openModal(`<h3>修改微信名</h3><div class="field" style="margin-top:14px"><input id="newName" value="${esc(state.username || '')}" placeholder="你的名字"></div><p style="font-size:9px;color:#a9b09f">他会根据这个名字，给你起一个专属昵称。</p><div class="modal-acts"><button class="btn btn-ghost" data-close-modal>取消</button><button class="btn btn-primary" id="saveName">保存</button></div>`);
  bindModalClosers();
  $('#saveName').onclick = () => {
    const v = $('#newName').value.trim();
    if (!v) { toast('总得有个名字呀'); return; }
    state.username = v;
    if (!state.petName) { /* 自动昵称随之变化 */ }
    save(); closeModal(); renderWeChat(); renderHome(); toast('改好了，他会换个方式叫你');
  };
}
function pickAvatar() {
  chooseImageFile((data) => {
    state.myAvatar = data; save();
    renderWeChat(); renderHome(); toast('头像换好啦');
  });
}
function chooseImageFile(cb) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 360;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d');
        const s = Math.max(size / img.width, size / img.height);
        const w = img.width * s, h = img.height * s;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        cb(c.toDataURL('image/jpeg', .85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  };
  inp.click();
}

/* ---------- 微信 App 注册 ---------- */
APP_DEFS.wechat = {
  darkUI: false,
  render() {
    WX.chatId = currentParams.chat || null;
    WX.view = currentParams.chat ? 'chats' : (WX.view || 'chats');
    return '<div id="wxPlaceholder"></div>';
  },
  mount() {
    if (currentParams.chat) { WX.chatId = currentParams.chat; state.unread[currentParams.chat] = 0; save(); }
    renderWeChat();
    if (WX.chatId) setTimeout(scrollChat, 50);
    bindMomentsExtras();
  },
  back() {
    if (WX.chatId) { closeChat(); return true; }
    if (WX.view !== 'chats') { WX.view = 'chats'; renderWeChat(); return true; }
    return false;
  },
  unmount() {
    WX.chatId = null; WX.tools = false;
  }
};
function bindMomentsExtras() {
  if (WX.view === 'moments') bindMoments();
  if (WX.view === 'favorites') bindFavorites();
}
WX.isChatting = () => currentApp === 'wechat' && WX.chatId === 'zeyu';
WX.onNewMessage = (msg) => {
  if (!WX.chatId) {
    if (currentApp === 'wechat') renderWeChat();
    return;
  }
  if (WX.chatId === 'zeyu') {
    state.unread.zeyu = 0;
    refreshChat();
  }
};
