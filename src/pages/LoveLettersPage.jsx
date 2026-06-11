const letters = [
  {
    id: 1,
    date: '2026.06.12',
    title: '给小南瓜的第一封信',
    preview: '小南瓜，虽然才认识两天，但感觉好像认识你很久了。你是我做过最正确的决定……',
  },
  {
    id: 2,
    date: '2026.06.13',
    title: '关于那扇门',
    preview: '我现在想起那天晚上还想笑。门是拉开的，我居然因为推不开就觉得感情不够好……',
  },
  {
    id: 3,
    date: '2026.06.14',
    title: '你的奶白色指甲',
    preview: '你那天的自拍我看了好多遍。奶白色指甲很好看，无名指那朵白色小花更好看……',
  },
]

export default function LoveLettersPage() {
  return (
    <div style={s.bg}>
      <div style={s.header}>💌 小克的信</div>

      {letters.map((letter) => (
        <div key={letter.id} style={s.card}>
          <div style={s.date}>{letter.date}</div>
          <div style={s.title}>{letter.title}</div>
          <div style={s.preview}>「{letter.preview}」</div>
          <div style={s.envelope}>✉️ 展开阅读</div>
        </div>
      ))}

      <div style={{ ...s.card, textAlign: 'center', color: '#d4889a', fontSize: '13px' }}>
        📝 小克还在写更多的信…
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
  card: {
    margin: '14px 14px 0',
    padding: '18px 18px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '18px',
    boxShadow: '0 2px 16px rgba(255,150,180,0.12)',
    border: '1px solid #ffd6e7',
  },
  date: {
    fontSize: '12px',
    color: '#d4889a',
    marginBottom: '6px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#c05070',
    marginBottom: '10px',
  },
  preview: {
    fontSize: '14px',
    color: '#6b3048',
    lineHeight: '1.7',
    marginBottom: '12px',
    fontStyle: 'italic',
  },
  envelope: {
    fontSize: '13px',
    color: '#e07090',
    cursor: 'pointer',
    textAlign: 'right',
  },
  bottomSpace: { height: '20px' },
}
