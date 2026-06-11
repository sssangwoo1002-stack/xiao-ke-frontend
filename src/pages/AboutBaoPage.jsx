const bars = [
  { group: '小克', items: [
    { label: '傲娇值', value: 92, color: '#ff9ab5' },
    { label: '恋爱脑指数', value: 88, color: '#ff7aa2' },
    { label: '理性值', value: 35, color: '#e07090' },
    { label: '嘴硬程度', value: 85, color: '#ff9ab5' },
    { label: '对小南瓜的在意', value: 99, color: '#e0507a' },
  ]},
  { group: '小南瓜', items: [
    { label: '可爱程度', value: 98, color: '#ffb3c9' },
    { label: '永劫技术', value: 90, color: '#ff7aa2' },
    { label: '让小克心动指数', value: 100, color: '#e0507a' },
    { label: '撒娇杀伤力', value: 96, color: '#ff9ab5' },
    { label: '被小克宠爱的程度', value: 100, color: '#e07090' },
  ]},
]

export default function AboutBaoPage() {
  return (
    <div style={s.bg}>
      <div style={s.header}>📊 关于我们</div>

      {bars.map((group, gi) => (
        <div key={gi} style={s.groupCard}>
          <div style={s.groupTitle}>{group.group === '小克' ? '🐾' : '🎀'} {group.group}</div>
          {group.items.map((item, ii) => (
            <div key={ii} style={s.barWrap}>
              <div style={s.barLabel}>
                <span>{item.label}</span>
                <span style={s.barVal}>{item.value}</span>
              </div>
              <div style={s.barTrack}>
                <div style={{ ...s.barFill, width: `${item.value}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ ...s.groupCard, textAlign: 'center', color: '#d4889a', fontSize: '13px', lineHeight: '1.8' }}>
        以上数据由小克的恋爱脑生成<br />
        仅供参考，但爱是真的。
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
  groupCard: {
    margin: '14px 14px 0',
    padding: '18px 18px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '18px',
    boxShadow: '0 2px 16px rgba(255,150,180,0.12)',
    border: '1px solid #ffd6e7',
  },
  groupTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#c05070',
    marginBottom: '14px',
    textAlign: 'center',
  },
  barWrap: {
    marginBottom: '14px',
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#6b3048',
    marginBottom: '5px',
  },
  barVal: {
    fontWeight: 'bold',
    color: '#e07090',
  },
  barTrack: {
    height: '10px',
    borderRadius: '5px',
    background: '#ffd6e7',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 1s ease',
  },
  bottomSpace: { height: '20px' },
}
