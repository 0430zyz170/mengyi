/* ============ 微信 ============ */
'use strict';

const WX = { view: 'chats', chatId: null, tools: false, parentView: false, typing: false };
const CHAT_ORDER = ['zeyu', 'family', 'mom', 'dad', 'wang', 'class'];
const OTHER_META = {
  mom: { name: '妈妈', who: 'mom' },
  dad: { name: '爸爸', who: 'dad' },
  family: { name: '相亲相爱一家人', who: 'family' },
  wang: { name: '王雨桐', who: 'wang' },
  class: { name: '高三(7)班', who: 'class' }
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
    bar = `<div class="wx-bar"><div class="ab-title">微信</div><div class="ab-right"><button class="ab-btn" data-wxact="plus">${icon('plus')}</button></div></div>`;
    body = `<div class="wx-search">${icon('search')}<span>搜索</span></div><div class="wx-list">${CHAT_ORDER.map(chatCell).join('')}</div>`;
  } else if (view === 'contacts') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="backhome">${icon('back')}</button><div class="ab-title">通讯录</div><div class="ab-right"><button class="ab-btn" data-wxact="addfriend">${icon('plus')}</button></div></div>`;
    body = `<div class="wx-search">${icon('search')}<span>搜索联系人</span></div>
      <div class="wx-list">
        ${contactRow('zeyu', '张泽禹', 'Aaa.我最爱的宝宝', true)}
        ${contactRow('mom', '妈妈', '微信：妈妈', false)}
        ${contactRow('dad', '爸爸', '微信：爸爸', false)}
        ${contactRow('wang', '王雨桐', '高中同学', false)}
        ${contactRow('family', '相亲相爱一家人', '群聊 · 3人', false)}
        ${contactRow('class', '高三(7)班', '群聊 · 42人', false)}
      </div>`;
  } else if (view === 'discover') {
    bar = `<div class="wx-bar"><div class="ab-title">发现</div></div>`;
    body = `<div class="wx-menu">
        ${menuRow('moments', '朋友圈', 'mom', WX.parentView ? '爸妈视角' : '')}
        ${menuRow('favorites', '收藏', 'heart', D.favorites.length + ' 条')}
        ${menuRow('channels', '视频号', 'play', '')}
        ${menuRow('mini', '小程序', 'qr', '')}
        ${menuRow('scan', '扫一扫', 'search', '')}
      </div>`;
  } else if (view === 'me') {
    bar = '';
    body = `<div class="me-head">
        <div class="me-row">
          <div class="me-ava">${myAvatarHTML()}</div>
          <div class="me-info"><div class="me-name">${esc(state.username || '小梦')}</div><div class="me-id">微信号：mengyi_0430</div></div>
          <button class="ab-btn" data-wxact="qr" style="color:#9aa28f">${icon('qr')}</button>
        </div>
      </div>
      <div class="wx-menu">
        ${menuRow('favorites', '收藏', 'heart', '暗恋到表白')}
        ${menuRow('moments', '朋友圈', 'gallery', '')}
        ${menuRow('cards', '卡包', 'transfer', '')}
        ${menuRow('emoji', '表情', 'smile', '')}
        ${menuRow('wxsettings', '设置', 'settings', '')}
      </div>`;
  } else if (view === 'moments') {
    bar = '';
    body = renderMoments();
  } else if (view === 'favorites') {
    bar = `<div class="wx-bar"><button class="ab-btn" data-wxact="backdiscover">${icon('back')}</button><div class="ab-title">收藏</div></div>`;
    body = renderFavorites();
  }

  const tabbar = `<div class="wx-tabbar">
    ${wxTab('chats', '微信', 'wechat', view === 'chats')}
    ${wxTab('contacts', '通讯录', 'contact', view === 'contacts')}
    ${wxTab('discover', '发现', 'discover', view === 'discover')}
    ${wxTab('me', '我', 'me', view === 'me')}
  </div>`;

  $('#appContent').innerHTML = `<div class="app wx">
    ${bar}
    <div class="app-body" id="wxBody" style="padding-bottom:0">${body}</div>
    ${tabbar}
    ${WX.chatId ? renderChatScreen() : ''}
  </div>`;

  bindWeChat();
  if (WX.chatId) scrollChat();
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
    <div class="wx-avatar">${id === 'zeyu' ? '<img src="assets/avatar.jpg" alt="">' : id === 'family' || id === 'class' ? `<div class="mono" style="background:linear-gradient(135deg,#b7c9a1,#7d9a5f)">${id === 'family' ? '家' : '7'}</div>` : avatarInner(id)}</div>
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
      <div class="ab-right"><button class="ab-btn" data-wxact="chatmore">${icon('more')}</button></div>
    </div>
    <div class="chat-body" id="chatBody">${messagesHTML(msgs, other)}</div>
    ${isZeyu ? `<div class="chat-tools ${WX.tools ? '' : 'hidden'}" id="chatTools">
      ${toolBtn('gallery', 'image', '相册')}
      ${toolBtn('camera', 'camera', '拍摄')}
      ${toolBtn('location', 'location', '位置')}
      ${toolBtn('transfer', 'transfer', '转账')}
      ${toolBtn('fav', 'heart', '收藏')}
      ${toolBtn('voice', 'voice', '语音')}
      ${toolBtn('music', 'music', '一起听歌')}
      ${toolBtn('videocall', 'phone', '视频通话')}
    </div>` : ''}
    ${isZeyu ? `<div class="chat-input">
      <button class="ci-btn" data-wxact="voice">${icon('voice')}</button>
      <div class="ci-field"><textarea id="wxInput" rows="1" placeholder="说点什么…"></textarea></div>
      <button class="ci-btn" data-wxact="emoji">${icon('smile')}</button>
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
    const who = mine ? 'me' : (m.sender || (other.who === 'family' || other.who === 'class' ? 'family' : other.who));
    const ava = mine ? avatarOf('me')
      : m.sender === '妈妈' ? avatarOf('mom')
        : m.sender === '爸爸' ? avatarOf('dad')
          : m.sender === '王雨桐' ? avatarOf('wang')
            : (other.who === 'family' || other.who === 'class')
              ? `<div class="wx-avatar"><div class="mono" style="background:linear-gradient(135deg,#b7c9a1,#7d9a5f)">${other.who === 'family' ? '家' : '7'}</div></div>`
              : avatarOf('zeyu');
    let content = '';
    if (m.type === 'image') content = `<div class="bubble img" data-img="${m.img}"><img src="${m.img}" alt=""><div style="font-size:9px;color:#999;padding:4px 3px 2px">${esc(m.text || '')}</div></div>`;
    else if (m.type === 'transfer') content = `<div class="bubble transfer ${mine ? '' : 'receive'}">
        <div class="transfer-top"><span class="transfer-ico">${icon('transfer')}</span><div><div class="transfer-amt">¥${esc(m.amount)}</div><div class="transfer-desc">${esc(m.note || '转账')}</div></div></div>
        <div class="transfer-bottom"><span>微信转账</span><span>${mine ? '已转出' : '已收款'}</span></div></div>`;
    else if (m.type === 'location') content = `<div class="bubble location"><div class="loc-card"><div class="loc-map"></div><div class="loc-meta"><b>${esc(m.place)}</b><span>${esc(m.addr || '')}</span></div></div></div>`;
    else if (m.type === 'voice') content = `<div class="bubble voice" data-voice="${m.dur || 4}"><svg class="ico" viewBox="0 0 24 24"><path d="M8 9v6M11 6v12M14 8v8M17 10v4"/></svg><div class="voice-wave"><i></i><i></i><i></i><i></i><i></i></div><span class="voice-dur">${m.dur || 4}″</span></div>`;
    else if (m.type === 'music') content = `<div class="bubble music-card"><span class="mc-cover">${icon('music')}</span><div><b>${esc(m.title)}</b><small>张泽禹 · 一起听</small></div></div>`;
    else content = `<div class="bubble">${esc(m.text).replace(/\n/g, '<br>')}</div>`;
    const sender = (other.who === 'family' || other.who === 'class') && !mine ? `<div class="msg-name">${esc(m.sender || '')}</div>` : '';
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
    openSheet(sheet('发起聊天', '想找谁聊两句？', `
      <div class="sheet-row" data-wxact="newchat-zeyu">${icon('user')}<span>张泽禹</span><em>置顶</em></div>
      <div class="sheet-row" data-wxact="newchat-mom">${icon('user')}<span>妈妈</span></div>
      <div class="sheet-row" data-wxact="newchat-dad">${icon('user')}<span>爸爸</span></div>
      <div class="sheet-row" data-wxact="group">${icon('contact')}<span>发起群聊</span></div>`));
    $$('#sheetRoot .sheet-row').forEach((r) => {
      r.onclick = () => {
        const a = r.dataset.wxact;
        closeSheet();
        if (a === 'group') toast('群聊已经够热闹啦');
        else openChat(a.replace('newchat-', ''));
      };
    });
  } else if (act === 'backhome') { WX.view = 'chats'; renderWeChat(); }
  else if (act === 'addfriend') toast('暂无新的朋友申请');
  else if (act === 'moments') { WX.view = 'moments'; WX.chatId = null; renderWeChat(); }
  else if (act === 'favorites') { WX.view = 'favorites'; WX.chatId = null; renderWeChat(); }
  else if (act === 'backdiscover') { WX.view = 'discover'; renderWeChat(); }
  else if (act === 'channels') toast('视频号里没有内容，只有他');
  else if (act === 'mini') toast('小程序正在做梦');
  else if (act === 'scan') toast('镜头里没有二维码，只有你');
  else if (act === 'qr') { toast('微信号：mengyi_0430'); }
  else if (act === 'cards') toast('卡包里只有一张他的照片');
  else if (act === 'emoji') toast('表情包里全是他');
  else if (act === 'wxsettings') openWxSettings();
  else if (act === 'closechat') closeChat();
  else if (act === 'chatmore') openChatMore();
  else if (act === 'send') sendCurrentText();
  else if (act === 'emoji') insertEmoji();
  else if (act === 'voice') toast('按住说话…算了，还是打字吧');
  else if (act === 'backdiscover') { WX.view = 'discover'; renderWeChat(); }
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
  const map = [
    [/想你|想我|想见/, 'miss'], [/喜欢|爱你|爱你|爱不/, 'love'], [/晚安|睡了|睡觉|困/, 'night'],
    [/早安|早上|醒了|起床/, 'morning'], [/吃|饭|饿|奶茶|外卖/, 'eat'], [/冷|凉|冻|秋裤/, 'cold'],
    [/抱|怀里/, 'hug'], [/亲|mua|么么/, 'kiss'], [/在哪|干嘛|干什么|做什么/, 'where'],
    [/气|不理|哼|讨厌|烦/, 'angry'], [/累|辛苦|困/, 'tired']
  ];
  let key = 'default';
  for (const [re, k] of map) { if (re.test(text)) { key = k; break; } }
  const pool = (D.replies[key] || D.replies.default).slice();
  if (state.customReplies && state.customReplies.length && Math.random() < .42) {
    pool.push(...state.customReplies);
  }
  return pool[Math.floor(Math.random() * pool.length)].replace(/\{pet\}/g, petName());
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
  else if (kind === 'videocall') { toast('他接起了视频…然后把镜头对向天花板'); }
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
  const posts = WX.parentView ? D.posts.filter((p) => p.visibility === 'public') : D.posts;
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
