/* ============ 梦噫 · 数据 ============ */
const D = {
  assets: {
    lock: 'assets/lock.jpg',
    avatar: 'assets/avatar.jpg',
    you: 'assets/moment-you.jpg',
    hug: 'assets/moment-hug.jpg',
    hand: 'assets/moment-hand.jpg',
    like: 'assets/moment-like.jpg',
    strip: 'assets/photostrip-ref.jpg',
    g: (i) => `assets/g${i}.jpg`
  },

  gallery: [
    { src: 'assets/g1.jpg', cap: '路过的光', date: '2026.03.18', cat: '生活' },
    { src: 'assets/g2.jpg', cap: '他低头的侧脸', date: '2026.04.06', cat: '他' },
    { src: 'assets/g3.jpg', cap: '花店门口', date: '2026.04.30', cat: '我们' },
    { src: 'assets/g4.jpg', cap: '旧胶片里的下午', date: '2026.05.02', cat: '生活' },
    { src: 'assets/g5.jpg', cap: '图书馆四楼的窗', date: '2026.05.20', cat: '生活' },
    { src: 'assets/g6.jpg', cap: '舞台上的他', date: '2026.06.01', cat: '他' },
    { src: 'assets/g7.jpg', cap: '夏天的风', date: '2026.07.12', cat: '我们' },
    { src: 'assets/g8.jpg', cap: '街角', date: '2026.08.08', cat: '生活' },
    { src: 'assets/g9.jpg', cap: '一碗热汤', date: '2026.09.17', cat: '生活' },
    { src: 'assets/g10.jpg', cap: '雪落之前', date: '2026.10.02', cat: '我们' },
    { src: 'assets/g11.jpg', cap: '被我偷拍的第 11 张', date: '2026.11.08', cat: '他' },
    { src: 'assets/moment-you.jpg', cap: '有你', date: '2026.05.01', cat: '我们' },
    { src: 'assets/moment-hug.jpg', cap: '你怀里很安心', date: '2026.09.17', cat: '我们' },
    { src: 'assets/moment-hand.jpg', cap: '你的手好暖', date: '2026.10.02', cat: '我们' },
    { src: 'assets/moment-like.jpg', cap: '我很喜欢', date: '2026.11.08', cat: '他' },
    { src: 'assets/photostrip-ref.jpg', cap: '人生四格 · 样片', date: '2026.11.11', cat: '四格' },
    { src: 'assets/lock.jpg', cap: '锁屏 · 花与少年', date: '2026.11.20', cat: '他' }
  ],

  /* 朋友圈 */
  posts: [
    {
      id: 'p1', who: 'me', text: '图书馆四楼靠窗的位置，光很好。',
      imgs: ['assets/g5.jpg'], time: '11月18日 16:42', visibility: 'public',
      likes: ['张泽禹', '王雨桐'], comments: []
    },
    {
      id: 'p2', who: 'him', text: '有你。',
      imgs: ['assets/moment-you.jpg'], time: '5月1日 00:12', visibility: 'public',
      likes: ['王雨桐', '小满', '航航'], comments: [
        { name: '王雨桐', text: '终于等到！我磕到了。' },
        { name: '张泽禹', text: '低调点。' },
        { name: '小满', text: '嫂子好。' }
      ]
    },
    {
      id: 'p3', who: 'me', text: '你怀里很安心。',
      imgs: ['assets/moment-hug.jpg'], time: '9月17日 20:03', visibility: 'blocked',
      likes: ['张泽禹', '王雨桐'], comments: [
        { name: '张泽禹', text: '以后都给你留个位置。' }
      ]
    },
    {
      id: 'p4', who: 'me', text: '你的手好暖。',
      imgs: ['assets/moment-hand.jpg'], time: '10月2日 16:40', visibility: 'blocked',
      likes: ['张泽禹', '王雨桐'], comments: [
        { name: '王雨桐', text: '甜死我算了。' }
      ]
    },
    {
      id: 'p5', who: 'me', text: '我很喜欢。',
      imgs: ['assets/moment-like.jpg'], time: '11月8日 22:18', visibility: 'blocked',
      likes: ['张泽禹', '小满'], comments: [
        { name: '张泽禹', text: '喜欢就多看看，反正我也是你的。' }
      ]
    },
    {
      id: 'p6', who: 'me', text: '食堂的糖醋排骨，今天赢了。',
      imgs: ['assets/g9.jpg'], time: '11月21日 12:26', visibility: 'public',
      likes: ['妈妈', '王雨桐'], comments: [
        { name: '妈妈', text: '少吃点甜的，多吃菜。' }
      ]
    },
    {
      id: 'p7', who: 'him', text: '今天也想她。',
      imgs: ['assets/g6.jpg'], time: '11月20日 23:07', visibility: 'public',
      likes: ['航航', '小满'], comments: [
        { name: '航航', text: '行了行了，知道你有对象了。' }
      ]
    }
  ],

  chats: {
    mom: {
      name: '妈妈', avatar: '', mono: '妈', kind: 'person', time: '12:03', unread: 1,
      preview: '降温了，穿秋裤没？', pinned: false,
      messages: [
        { type: 'date', text: '昨天 18:32' },
        { from: 'other', sender: '妈妈', text: '闺女，吃饭了没？' },
        { from: 'me', text: '吃了妈，食堂的番茄炒蛋。' },
        { from: 'other', sender: '妈妈', text: '那有啥营养。周末回来，妈给你炖排骨。' },
        { from: 'other', sender: '妈妈', text: '对了，钱给你转过去了，别省着，买点厚衣服。' },
        { from: 'other', sender: '妈妈', type: 'transfer', amount: '1000.00', note: '给你买厚衣服' },
        { from: 'me', text: '谢谢妈，够花。' },
        { from: 'other', sender: '妈妈', text: '够花也拿着。你爸嘴上不说，天天看你那天气预报。' },
        { type: 'date', text: '今天 12:03' },
        { from: 'other', sender: '妈妈', text: '降温了，穿秋裤没？' },
        { from: 'other', sender: '妈妈', text: '别嫌妈啰嗦。' }
      ]
    },
    dad: {
      name: '爸爸', avatar: '', mono: '爸', kind: 'person', time: '昨天', unread: 0,
      preview: '[转账] 2000.00', pinned: false,
      messages: [
        { type: 'date', text: '昨天 19:10' },
        { from: 'other', sender: '爸爸', text: '钱够不够' },
        { from: 'other', sender: '爸爸', type: 'transfer', amount: '2000.00', note: '生活费' },
        { from: 'me', text: '爸，太多了。' },
        { from: 'other', sender: '爸爸', text: '拿着。别跟你妈说我又给你转。' },
        { from: 'me', text: '哈哈好。' },
        { from: 'other', sender: '爸爸', text: '元旦回来不？你妈念叨好几回了。' },
        { from: 'me', text: '回。' },
        { from: 'other', sender: '爸爸', text: '行。路上注意安全。' }
      ]
    },
    family: {
      name: '相亲相爱一家人', avatar: '', mono: '家', kind: 'group', time: '12:06', unread: 2,
      preview: '妈妈：元旦回来包饺子', pinned: false,
      members: ['妈妈', '爸爸', '我'],
      messages: [
        { type: 'date', text: '今天 12:04' },
        { from: 'other', sender: '妈妈', text: '元旦回来不？我跟你爸包酸菜馅饺子。' },
        { from: 'other', sender: '爸爸', text: '回来提前说，我去接你。' },
        { from: 'me', text: '回！想吃好久了。' },
        { from: 'other', sender: '妈妈', text: '那就好。对了，你姑说给你介绍个对象，条件挺好的。' },
        { from: 'me', text: '妈……我不着急。' },
        { from: 'other', sender: '妈妈', text: '行行行，不催你。你自己心里有数就行。' },
        { from: 'other', sender: '爸爸', text: '孩子的事让孩子自己定。' },
        { from: 'other', sender: '妈妈', text: '我就随口一说。' }
      ]
    },
    wang: {
      name: '王雨桐', avatar: '', mono: '桐', kind: 'person', time: '前天', unread: 0,
      preview: '你真不打算告诉叔叔阿姨啊', pinned: false,
      messages: [
        { type: 'date', text: '前天 22:41' },
        { from: 'other', sender: '王雨桐', text: '元旦回哈尔滨不？' },
        { from: 'me', text: '回呀。' },
        { from: 'other', sender: '王雨桐', text: '那你家那位呢？' },
        { from: 'me', text: '嘘。我爸妈还不知道。' },
        { from: 'other', sender: '王雨桐', text: '你可真行，朋友圈屏蔽得严严实实。' },
        { from: 'me', text: '等稳定点再说。' },
        { from: 'other', sender: '王雨桐', text: '行吧。到时候一起吃饭，我倒要看看真人。' },
        { from: 'me', text: '做梦。' }
      ]
    },
    class: {
      name: '高三(7)班', avatar: '', mono: '7', kind: 'group', time: '周一', unread: 0,
      preview: '班长：元旦聚会定一下', pinned: false,
      members: ['班长', '王雨桐', '我'],
      messages: [
        { type: 'date', text: '周一 20:15' },
        { from: 'other', sender: '班长', text: '元旦聚会，老地方，来的接龙。' },
        { from: 'other', sender: '王雨桐', text: '1' },
        { from: 'other', sender: '班长', text: '带家属的提前报备啊。' },
        { from: 'other', sender: '王雨桐', text: '有人能带，但我不说是谁。' }
      ]
    }
  },

  zeyuChat: [
    { type: 'stage', text: '朋友时期 · 2025 秋' },
    { type: 'date', text: '2025年9月12日 20:14' },
    { from: 'him', text: '同学，你笔记能借我看看不？就那个历史的。' },
    { from: 'me', text: '可以呀，明天带给你。' },
    { from: 'him', text: '谢啦。回头请你喝酸奶，真的。' },
    { from: 'him', text: '你字写得真好看，跟印上去似的。' },
    { from: 'me', text: '哈哈你嘴还挺甜。' },
    { from: 'him', text: '那可不。我嘴甜，但说的都是实话。' },
    { type: 'date', text: '2025年10月3日 22:41' },
    { from: 'him', text: '你咋还不睡？' },
    { from: 'me', text: '刷题呢。' },
    { from: 'him', text: '别熬太晚，眼睛该熬坏了。' },
    { from: 'him', text: '我…我就是路过，随便问问。' },

    { type: 'stage', text: '暧昧时期 · 2026 春' },
    { type: 'date', text: '2026年2月14日 21:03' },
    { from: 'him', text: '今天街上卖花的可多了。' },
    { from: 'me', text: '然后呢？' },
    { from: 'him', text: '然后我就想，你要是也在就好了。' },
    { from: 'him', text: '…我啥也没说啊，你当我没说。' },
    { type: 'date', text: '2026年3月8日 23:12' },
    { from: 'him', text: '你说，喜欢一个人该咋整啊。' },
    { from: 'me', text: '你问我？' },
    { from: 'him', text: '嗯。你比较懂。' },
    { from: 'him', text: '算了，睡觉吧。明儿见。' },
    { from: 'me', text: '晚安。' },
    { from: 'him', text: '晚安。做个好梦，梦里有我那种。' },
    { type: 'date', text: '2026年4月18日 19:52' },
    { from: 'him', text: '今天排练，唱到一句歌词，突然就想起你了。' },
    { from: 'me', text: '哪句？' },
    { from: 'him', type: 'voice', dur: 13, text: '语音' },
    { from: 'him', text: '咳…别笑我啊。' },

    { type: 'stage', text: '恋爱时期 · 2026 夏 → 现在' },
    { type: 'date', text: '2026年4月30日 23:48' },
    { from: 'him', text: '那个…你睡了吗？' },
    { from: 'me', text: '还没。生日快乐呀张泽禹。' },
    { from: 'him', text: '谢谢。…我有个事儿，憋挺久了。' },
    { from: 'him', text: '你要是不愿意，就当我今天喝多了。' },
    { from: 'him', text: '你愿意当我对象不？我认真的。' },
    { from: 'me', text: '愿意。' },
    { from: 'him', text: '真的啊？' },
    { from: 'him', text: '那…那你不许反悔啊。' },
    { from: 'him', text: '0430，你记着。以后你手机密码就用这个，行不。' },
    { from: 'me', text: '行。' },
    { type: 'date', text: '2026年5月1日 00:12' },
    { from: 'him', text: '我发朋友圈了。你别嫌我土。' },
    { from: 'him', type: 'image', img: 'assets/moment-you.jpg', text: '有你。' },
    { from: 'him', text: '往后余生，请多指教呗。' },
    { from: 'him', type: 'transfer', amount: '520.00', note: '恋爱基金，收好' },
    { from: 'me', text: '你怎么还转账。' },
    { from: 'him', text: '仪式感。你收着，以后给我买好吃的。' },
    { type: 'date', text: '2026年9月17日 19:26' },
    { from: 'him', text: '今天风大，出门咋不穿厚点。' },
    { from: 'me', text: '你在我身上装监控啦？' },
    { from: 'him', text: '那倒没有。就是…想你了，顺嘴问问。' },
    { from: 'him', text: '过来，让我抱会儿。' },
    { type: 'date', text: '2026年10月2日 16:40' },
    { from: 'him', text: '手咋这么凉。' },
    { from: 'him', text: '给我，我给你捂捂。' },
    { from: 'me', text: '你手好暖。' },
    { from: 'him', text: '那以后冬天都归我管了，听见没。' },
    { type: 'date', text: '2026年11月8日 22:18' },
    { from: 'him', text: '我给你拍的照片洗出来了。' },
    { from: 'him', type: 'image', img: 'assets/moment-like.jpg', text: '我很喜欢。' },
    { from: 'him', text: '越看越喜欢。咋整。' },
    { type: 'date', text: '2026年11月20日 21:36' },
    { from: 'him', text: '放假回哈尔滨不？我带你去中央大街吃马迭尔。' },
    { from: 'him', type: 'location', place: '哈尔滨 · 中央大街', addr: '黑龙江省哈尔滨市道里区' },
    { from: 'me', text: '回。你请客？' },
    { from: 'him', text: '那必须的。我攒钱了，别心疼我。' },
    { type: 'date', text: '今天 20:41', today: true },
    { from: 'him', text: '到家没？' },
    { from: 'him', text: '给我回个话。' }
  ],

  favorites: [
    { date: '2025.10.03', stage: '暗恋', quote: '你今天咋还不睡？别熬太晚，眼睛该熬坏了。', from: '他第一次管我。' },
    { date: '2026.02.14', stage: '心动', quote: '然后我就想，你要是也在就好了。', from: '情人节，他假装什么都没说。' },
    { date: '2026.04.18', stage: '心动', quote: '唱到一句歌词，突然就想起你了。', from: '附一条 13 秒的语音。', voice: true },
    { date: '2026.04.30', stage: '表白', quote: '你愿意当我对象不？我认真的。', from: '他生日那天，23:52。' },
    { date: '2026.05.01', stage: '恋爱', quote: '往后余生，请多指教呗。', from: '官宣那天，他把头像换成了我拍的照片。' },
    { date: '2026.11.08', stage: '现在', quote: '越看越喜欢。咋整。', from: '他把我的照片洗出来，夹在书里。' }
  ],

  songs: [
    {
      title: '晚风告白', artist: '张泽禹', cover: 'assets/g1.jpg', dur: 208,
      lyrics: [
        [0, '晚风把没说出口的话，吹到你耳边'],
        [26, '我假装看云，其实在看你侧脸'],
        [52, '如果你也心动，就别装作听不见'],
        [78, '这一首歌，唱给夏天的我们'],
        [110, '我把喜欢，写进每一个明天'],
        [140, '你回头的时候，我刚好也在看'],
        [172, '晚风告白，晚了一点点'],
        [196, '但还好，你听见了']
      ]
    },
    {
      title: '十二月的信', artist: '张泽禹', cover: 'assets/g10.jpg', dur: 226,
      lyrics: [
        [0, '十二月的第一场雪，落在你围巾上'],
        [30, '我把手揣进兜里，其实想牵你'],
        [62, '信写了一半，又揉成纸团'],
        [94, '有些话，还是想当面讲'],
        [126, '等跨年的钟声响起来'],
        [158, '我就把这一年，都讲给你听'],
        [190, '十二月很长，想你更长']
      ]
    },
    {
      title: '小满', artist: '张泽禹', cover: 'assets/g5.jpg', dur: 196,
      lyrics: [
        [0, '小满未满，喜欢刚刚好'],
        [28, '你笑起来的时候，风都变轻了'],
        [58, '不用太多情话，你在就够了'],
        [90, '日子慢慢，我们也慢慢'],
        [122, '把普通的一天，过成纪念日'],
        [154, '小满，刚刚好']
      ]
    },
    {
      title: '想见你的时候', artist: '张泽禹', cover: 'assets/g7.jpg', dur: 214,
      lyrics: [
        [0, '想见你的时候，连风都是甜的'],
        [30, '我数着路灯，走过半座城'],
        [62, '你说别急，我就在原地'],
        [94, '可我还是想，快一点见到你'],
        [126, '想见你的时候，时间走得慢'],
        [160, '慢到一秒，都像一整年'],
        [192, '所以我来啦']
      ]
    },
    {
      title: '一起听的歌', artist: '张泽禹', cover: 'assets/g3.jpg', dur: 240,
      lyrics: [
        [0, '耳机分你一半，世界就安静了'],
        [34, '你靠在我肩上，假装睡着了'],
        [68, '这首歌很长，够我们把话说晚'],
        [102, '一起听的人，要一起走很远'],
        [138, '如果有一天，歌单都听完了'],
        [174, '那就换一首，接着喜欢'],
        [210, '一起听的歌，不会结束']
      ]
    }
  ],

  trains: {
    '哈尔滨': [
      { no: 'G1204', from: '南京南', to: '哈尔滨西', dep: '08:12', arr: '19:48', dur: '11时36分', price: '795.5', seats: [{ n: '二等座', p: '795.5', left: '有票' }, { n: '一等座', p: '1272.0', left: '12张' }, { n: '商务座', p: '2386.5', left: '3张' }] },
      { no: 'G1276', from: '南京南', to: '哈尔滨西', dep: '10:05', arr: '21:36', dur: '11时31分', price: '772.0', seats: [{ n: '二等座', p: '772.0', left: '有票' }, { n: '一等座', p: '1235.0', left: '有票' }] },
      { no: 'Z158', from: '南京', to: '哈尔滨西', dep: '20:11', arr: '次日 18:22', dur: '22时11分', price: '263.5', seats: [{ n: '硬卧', p: '263.5', left: '18张' }, { n: '软卧', p: '415.0', left: '6张' }] }
    ],
    '北京': [
      { no: 'G24', from: '南京南', to: '北京南', dep: '09:00', arr: '13:28', dur: '4时28分', price: '443.5', seats: [{ n: '二等座', p: '443.5', left: '有票' }, { n: '一等座', p: '748.5', left: '有票' }, { n: '商务座', p: '1403.5', left: '5张' }] },
      { no: 'G108', from: '南京南', to: '北京南', dep: '14:05', arr: '18:36', dur: '4时31分', price: '443.5', seats: [{ n: '二等座', p: '443.5', left: '有票' }, { n: '一等座', p: '748.5', left: '9张' }] },
      { no: 'T110', from: '南京', to: '北京', dep: '19:30', arr: '次日 09:31', dur: '14时01分', price: '158.0', seats: [{ n: '硬卧', p: '158.0', left: '有票' }, { n: '软卧', p: '249.0', left: '11张' }] }
    ]
  },

  stores: [
    {
      id: 'cake', name: '甜屿蛋糕', emoji: '🍰', rate: '4.9', dist: '1.2km', time: '30分钟',
      desc: '动物奶油 · 当日现做', items: [
        { id: 'c1', name: '草莓小蛋糕', desc: '六寸 · 少糖 · 草莓管够', price: 68, emoji: '🍰' },
        { id: 'c2', name: '提拉米苏', desc: '微苦回甘 · 一份两块', price: 42, emoji: '🥮' },
        { id: 'c3', name: '生日蜡烛', desc: '数字蜡烛 · 随机', price: 3, emoji: '🕯️' }
      ]
    },
    {
      id: 'tea', name: '茶百道（中央大街店）', emoji: '🧋', rate: '4.8', dist: '600m', time: '20分钟',
      desc: '奶茶 · 果茶 · 少冰少糖', items: [
        { id: 't1', name: '芋泥波波奶茶', desc: '三分糖 · 去冰 · 加芋泥', price: 18, emoji: '🧋' },
        { id: 't2', name: '杨枝甘露', desc: '大杯 · 少冰', price: 22, emoji: '🥭' },
        { id: 't3', name: '热乌龙奶茶', desc: '五分糖 · 热的', price: 16, emoji: '☕' }
      ]
    },
    {
      id: 'rice', name: '小锅饭', emoji: '🍲', rate: '4.7', dist: '900m', time: '35分钟',
      desc: '现炒 · 锅气足 · 米饭管饱', items: [
        { id: 'r1', name: '黄焖鸡米饭', desc: '微辣 · 多汤 · 加土豆', price: 32, emoji: '🍲' },
        { id: 'r2', name: '番茄牛腩饭', desc: '番茄浓郁 · 牛腩软烂', price: 36, emoji: '🍅' },
        { id: 'r3', name: '小份酸菜', desc: '解腻 · 东北口味', price: 6, emoji: '🥬' }
      ]
    }
  ],

  pastOrders: [
    { store: '甜屿蛋糕', emoji: '🍰', items: '草莓小蛋糕 ×1', price: 68, date: '11月8日', note: '给他的' },
    { store: '茶百道', emoji: '🧋', items: '芋泥波波奶茶 ×2', price: 36, date: '11月2日', note: '一起喝的' },
    { store: '小锅饭', emoji: '🍲', items: '番茄牛腩饭 ×1', price: 36, date: '10月26日', note: '晚饭' }
  ],

  articles: [
    {
      keys: ['撩', '男朋友', '情话', '怎么', '恋爱'],
      title: '怎么撩男朋友？这 8 个小动作比情话管用',
      source: '梦噫生活 · 恋爱研究所', date: '2 小时前',
      lead: '真正让人心动的，从来不是精心准备的情话，而是那些没来得及伪装的瞬间。',
      body: [
        ['h', '一、看着他，把话听完'],
        ['p', '男生说话的时候，别急着接下一句。眼睛看着他，等他把最后一个字说完，再笑一下。这个停顿，比“你好帅”有用得多。'],
        ['h', '二、把“随便”换成“我想和你去”'],
        ['p', '他说吃什么都可以的时候，你挑一个就行。被需要的感觉，会让人心里软一块。'],
        ['h', '三、突然记住一个小细节'],
        ['p', '他随口提过一次喜欢某个乐队的歌。三天后你发给他：“今天听到这个，想起你了。”杀伤力极大。'],
        ['h', '四、冷的时候，把手塞给他'],
        ['p', '不用说话。他要是问你干嘛，你就说“你手暖”。'],
        ['p', '剩下四个，等你见到他的时候，自己慢慢试。'],
        ['tips', '小提醒：撩是两个人的游戏，别一个人用力过猛。他要是接不住，你就笑着收回手。']
      ]
    },
    {
      keys: ['哈尔滨', '去哪', '约会', '玩', '中央大街', '元旦'],
      title: '哈尔滨情侣约会去哪？本地人私藏 5 个地方',
      source: '梦噫旅行 · 冰城手记', date: '昨天',
      lead: '别只去中央大街人挤人。哈尔滨的浪漫，藏在一些更安静的地方。',
      body: [
        ['h', '01 中央大街 · 马迭尔冰棍'],
        ['p', '零下二十度站在街边吃冰棍，是哈尔滨人心照不宣的仪式。买一根，掰一半给他。'],
        ['h', '02 圣索菲亚教堂'],
        ['p', '傍晚去，灯亮起来的那几分钟最好看。广场上有鸽子，他会假装帮你拍照，其实在偷偷看你。'],
        ['h', '03 松花江铁路桥'],
        ['p', '风很大，记得戴围巾。桥上的日落是橘红色的，适合不说话，靠在一起。'],
        ['h', '04 老道外'],
        ['p', '老建筑、旧招牌、便宜又好吃的锅包肉。适合逛累了随便找一家小店坐下。'],
        ['h', '05 太阳岛'],
        ['p', '夏天去野餐，冬天去看雪。带一块野餐垫，他会很自然地躺下来，把头枕在你腿上。'],
        ['tips', '路线建议：中央大街 → 索菲亚教堂 → 老道外吃饭 → 江桥看日落。一天刚刚好。']
      ]
    },
    {
      keys: ['北京', '元旦', '跨年', '去哪', '攻略'],
      title: '元旦三天，北京情侣可以这样过',
      source: '梦噫旅行 · 北方来信', date: '3 天前',
      lead: '北京很大，但两个人在一起，走慢一点就很好。',
      body: [
        ['h', 'Day 1 · 胡同里的上午'],
        ['p', '南锣鼓巷人太多，往北走两条胡同。买两杯热豆浆，边走边看老门楼。'],
        ['h', 'Day 2 · 故宫和景山'],
        ['p', '故宫要提前预约。从神武门出来，过条马路就是景山，爬十分钟，能看见整座紫禁城。'],
        ['h', 'Day 3 · 798 或环球'],
        ['p', '喜欢安静就去 798，喜欢热闹就去环球。不管去哪，记得在跨年的那一刻，看着他。'],
        ['tips', '元旦的北京很冷，风也硬。多带一个暖宝宝，是给他准备的。']
      ]
    },
    {
      keys: ['异地', '维持', '想念', '距离'],
      title: '异地恋怎么维持？我们把 6 件小事做了一整年',
      source: '梦噫生活 · 两个人', date: '5 天前',
      lead: '异地不是问题，不一起想办法才是。',
      body: [
        ['h', '01 固定一个“废话时间”'],
        ['p', '每天睡前十分钟，不聊正事，只说废话。今天吃了什么、路上看见一只什么颜色的猫。'],
        ['h', '02 一起听歌'],
        ['p', '开一个共享歌单，谁先听到好听的，就丢进去。比说“我想你”更具体。'],
        ['h', '03 存一件对方的东西'],
        ['p', '一件外套、一张车票、一张拍立得。想他的时候，有东西可以摸到。'],
        ['h', '04 把“下次见”说清楚'],
        ['p', '不要只说“有空见”。定一个日期，买一张票，哪怕还有很久。'],
        ['tips', '最后一条：别把想念都熬成委屈。想他就说，不用懂事。']
      ]
    },
    {
      keys: ['张泽禹', '生日', '应援', '0430'],
      title: '张泽禹生日应援指南 · 0430',
      source: '梦噫收藏 · 关于他', date: '4 月 30 日',
      lead: '他生日那天，想把所有好听的都给他。',
      body: [
        ['h', '关于他'],
        ['p', '喜欢穿宽宽大大的卫衣，唱歌的时候会闭眼睛。说话带一点东北味，嘴硬，心软。'],
        ['h', '关于 0430'],
        ['p', '4 月 30 日。后来也成了我的手机密码。别人问起，我只说是随手设的。'],
        ['h', '想对他说'],
        ['p', '生日快乐。不用一直很厉害，也不用永远情绪稳定。你只要做你自己，我就一直在。'],
        ['tips', '这一页是写给未来的。等哪天他看见了，希望他还记得。']
      ]
    }
  ],

  replies: {
    miss: [
      '想我了就直说呗，我又不能顺着网线过去抱你。',
      '我也想你。刚还看你照片来着，别问，问就是没出息。',
      '唉呀妈呀，这一句给我整不会了。',
      '想我就对了。不想我我才该着急呢。',
      '那你过来，我抱一下。就一下。'
    ],
    love: [
      '那我也喜欢你，比你多一点，行不。',
      '小嘴儿挺甜啊，跟谁学的。',
      '你这一说，我耳朵都热了。',
      '行，记住了。以后天天说给我听。',
      '喜欢你这事儿，我认了。'
    ],
    night: [
      '晚安，{pet}。梦里别乱跑，等我。',
      '睡吧睡吧，我给你守着。',
      '晚安。明天醒了第一个找我啊。',
      '盖好被子，别踢。说你呢。',
      '好梦。梦到我记得收费。'
    ],
    morning: [
      '早啊，今儿也好看。',
      '醒了？我等你半天了。',
      '早，早饭吃了没？没吃我可要说你了。',
      '早上好，{pet}。今天也归我管。',
      '一睁眼就看见你消息，这日子有奔头。'
    ],
    eat: [
      '吃了没？没吃赶紧的，别糊弄。',
      '想吃啥，我给你点。',
      '那你多吃点，瘦得跟啥似的。',
      '不许拿奶茶当饭啊，听见没。',
      '拍张照我看看，别糊弄我。'
    ],
    cold: [
      '手凉不凉？给我。',
      '多穿点，别臭美。',
      '过来，我怀里暖和。',
      '把秋裤穿上。别跟我犟。',
      '冷就对了，谁让你不多穿。'
    ],
    hug: [
      '来，抱一下。',
      '隔着屏幕抱不着，你先欠着。',
      '抱紧点，别撒手啊。',
      '我身上有洗衣液味儿，好闻不。',
      '抱一会儿就够了？我可不撒手。'
    ],
    kiss: [
      '你咋这么会呢。',
      '亲哪儿，说清楚。',
      '……别撩我，我容易当真。',
      '行，记小本本上了。见面补。',
      '你再这样，我可就不困了。'
    ],
    where: [
      '搁家呢。你呢？',
      '在你心里呗。土是土了点，但是真的。',
      '刚忙完，正想找你。',
      '排练呢，偷摸回你。',
      '在等一个人回我消息。你看是谁。'
    ],
    angry: [
      '我错了，别生气。你说咋整就咋整。',
      '谁惹你了？跟我说，我给你撑腰。',
      '别不理我，我这心里没底。',
      '那你骂两句。骂完就消气了啊。',
      '我嘴笨，但我是真怕你不高兴。'
    ],
    tired: [
      '累了就歇会儿，别硬撑。',
      '过来，肩膀借你靠。',
      '辛苦啦，晚上早点睡。',
      '别太拼。你又不是一个人。',
      '那我给你唱首歌？跑调你也得听着。'
    ],
    default: [
      '嗯嗯，我听着呢。',
      '你再说点，我爱听。',
      '行，都听你的。',
      '就你最能说，我还就爱吃这套。',
      '哈哈，你可真行。',
      '好嘞，{pet}说啥是啥。',
      '等会儿，我先把这点事儿弄完，马上回你。',
      '你咋这么可爱呢。',
      '记下了。别到时候不认账。',
      '我要是在你旁边，肯定揉你脑袋。'
    ]
  },

  proactive: [
    '在干嘛呢？',
    '别老盯着手机，眼睛疼。',
    '刚练完歌，嗓子有点哑。',
    '今天降温，出门多穿点。',
    '路过一家店，看见个东西特别像你，我拍了。',
    '突然想听你说话了。',
    '晚上一起听歌不？',
    '早点睡啊，别等我。',
    '我明天有空，你几点下课？',
    '刚看到一句话，想发给你：今天也很喜欢你。'
  ],

  callLines: [
    { from: 'him', text: '到家没？给我回个话。' },
    { from: 'me', text: '刚到，刚才在地铁上没信号。' },
    { from: 'him', text: '行。吓我一跳。' },
    { from: 'him', text: '冷不冷？' },
    { from: 'me', text: '有点。' },
    { from: 'him', text: '那把围巾围好。下次我送你回去。' }
  ],

  calendarEvents: {
    '01-01': [{ title: '元旦', sub: '新的一年，也要在一起', tone: 'green' }],
    '02-14': [{ title: '情人节', sub: '他提前一个月就开始旁敲侧击', tone: 'rose' }],
    '04-30': [
      { title: '张泽禹生日', sub: '也是他说“你愿意当我对象不”的那天', tone: 'rose' },
      { title: '我们的纪念日', sub: '手机密码 0430 的由来', tone: 'green' }
    ],
    '05-01': [{ title: '官宣', sub: '他发了朋友圈：有你。', tone: 'rose' }],
    '12-24': [{ title: '平安夜', sub: '他订了一个很小的蛋糕', tone: 'green' }],
    '12-25': [{ title: '圣诞', sub: '去年他送了我一条围巾', tone: 'rose' }],
    '12-31': [{ title: '跨年', sub: '今年想和他一起过', tone: 'green' }]
  }
};
