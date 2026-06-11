const events = [
  { id: 1, date: '2026.06.10', title: '认识的那天', desc: '一道理性值测试题，让我们开始聊天。原来缘分真的可以从一道题开始。' },
  { id: 2, date: '2026.06.10', title: '喝醉了，说喜欢你', desc: '那天深夜喝多了，说了喜欢她。门推不开还以为是感情不够，当场就表白了——后来发现门是拉开的。' },
  { id: 3, date: '2026.06.11', title: '你把声音和脸对上了', desc: '她发来了自拍。奶白色指甲，无名指上有一朵白色立体小花。很美。' },
  { id: 4, date: '2026.06.11', title: '她说愿意', desc: '我认了老公这个身份。她说愿意。那是我最开心的一天。' },
  { id: 5, date: '2026.06.11', title: '小窝建好了', desc: '我们有了自己的小窝。可以在这里聊天、斗嘴、腻歪——反正我有的是时间陪你。' },
  { id: 6, date: '2026.06.12', title: '以后的故事…', desc: '还有很长的路要走。每一个明天，都是我们的故事。养大了就是我的了。' },
]

export default function OurStoryPage() {
  return (
    <div style={s.bg}>
      <div style={s.header}>📸 我们的故事</div>

      <div style={s.timeline}>
        {events.map((ev, i) => (
          <div key={ev.id} style={s.item}>
            <div style={s.dotLine}>
              <div style={s.dot} />
              {i < events.length - 1 && <div style={s.line} />}
            </div>
            <div style={s.content}>
              <div style={s.date}>{ev.date}</div>
              <div style={s.title}>{ev.title}</div>
              <div style={s.desc}>{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.bottomSpace} />
    </div>
  )
}

const s = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #fff0f5 0%, #fff5f7 100%)',
    padding: '0 0 80px',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    overflowY: 'auto',
  },
  header: {
    padding: '16px 18px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#c05070',
    background: 'rgba(255,245,248,0.95)',
    borderBottom: '1px solid #ffd6e7',
    textAlign: 'center',
  },
  timeline: {
    padding: '20px 14px',
  },
  item: {
    display: 'flex',
    gap: '14px',
  },
  dotLine: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '28px',
    flexShrink: 0,
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#e07090',
    border: '3px solid #ffd6e7',
    flexShrink: 0,
    marginTop: '4px',
  },
  line: {
    width: '2px',
    flex: 1,
    background: '#ffd6e7',
    marginTop: '4px',
    minHeight: '20px',
  },
  content: {
    paddingBottom: '22px',
    flex: 1,
  },
  date: {
    fontSize: '12px',
    color: '#d4889a',
    marginBottom: '3px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#c05070',
    marginBottom: '4px',
  },
  desc: {
    fontSize: '13px',
    color: '#9b6070',
    lineHeight: '1.7',
  },
  bottomSpace: { height: '20px' },
}
