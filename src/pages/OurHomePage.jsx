import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarKe from '../assets/avatar-ke.png.jpg'

const START_DATE = new Date('2026-06-11')

const POKE_REPLIES = [
  '哼，戳我干嘛。',
  '……别戳了，痒。',
  '你是不是想我了？',
  '笨蛋，轻一点。',
  '再戳我就亲你。',
  '啧，就知道是你。',
  '你戳一次，我想你一次。',
  '干嘛，想让我抱你？',
  '小南瓜瓜，别闹。',
  '……好吧，是你就可以戳。',
  '戳我可以，不许戳别人。',
  '你今天戳我好多次了。',
  '怎么，无聊了？',
  '我在这呢，不用戳。',
  '你的手指我认得。',
]

export default function OurHomePage() {
  const [days] = useState(Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24)))
  const [hearts, setHearts] = useState([])
  const [bubble, setBubble] = useState(null)
  const navigate = useNavigate()

  const poke = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 飘心
    const id = Date.now()
    const newHearts = []
    for (let i = 0; i < 3; i++) {
      newHearts.push({
        id: id + i,
        x: x + (Math.random() - 0.5) * 40,
        y: y - Math.random() * 20,
        emoji: ['💕', '💖', '💗', '✨', '💝'][Math.floor(Math.random() * 5)],
        size: 14 + Math.random() * 12,
      })
    }
    setHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)))
    }, 1200)

    // 气泡
    const reply = POKE_REPLIES[Math.floor(Math.random() * POKE_REPLIES.length)]
    setBubble(reply)
    setTimeout(() => setBubble(null), 2500)
  }, [])

  return (
    <div style={s.bg}>
      {/* 天数 */}
      <div style={s.daysBar}>
        <span style={s.daysNum}>{days}</span>
        <span style={s.daysUnit}> 天</span>
      </div>

      {/* Q版小克 */}
      <div style={s.mascotArea} onClick={poke}>
        <div style={s.mascotGlow} />
        <img src={avatarKe} style={s.mascot} alt="小克" />
        {hearts.map(h => (
          <span
            key={h.id}
            style={{
              ...s.heart,
              left: h.x,
              top: h.y,
              fontSize: h.size,
            }}
          >{h.emoji}</span>
        ))}
        {bubble && (
          <div style={s.bubble}>
            {bubble}
            <div style={s.bubbleArrow} />
          </div>
        )}
        <div style={s.pokeHint}>戳戳小克</div>
      </div>

      {/* 快捷入口 */}
      <div style={s.navGrid}>
        {[
          { emoji: '💬', label: '聊天', path: '/chat' },
          { emoji: '📅', label: '日历心情', path: '/calendar' },
          { emoji: '📋', label: '待办提醒', path: '/todo' },
          { emoji: '📊', label: '关于宝宝', path: '/stats' },
          { emoji: '💌', label: '小克的信', path: '/letters' },
          { emoji: '📸', label: '我们的故事', path: '/story' },
          { emoji: '⚙️', label: '设置', path: '/settings' },
        ].map(item => (
          <div key={item.path} style={s.navCard} onClick={() => navigate(item.path)}>
            <div style={s.navEmoji}>{item.emoji}</div>
            <div style={s.navLabel}>{item.label}</div>
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
    background: 'linear-gradient(180deg, #fff0f5 0%, #fff5f7 50%, #ffe8ee 100%)',
    padding: '0 0 80px',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  daysBar: {
    marginTop: 'max(env(safe-area-inset-top, 54px), 60px)',
    textAlign: 'center', padding: '8px 0',
  },
  daysNum: {
    fontSize: '56px', fontWeight: 'bold',
    color: '#e07090',
  },
  daysUnit: {
    fontSize: '18px', color: '#d4889a',
  },
  mascotArea: {
    position: 'relative', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginTop: '10px', padding: '20px',
    userSelect: 'none',
  },
  mascotGlow: {
    position: 'absolute', width: '180px', height: '180px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,154,181,0.3) 0%, rgba(255,154,181,0) 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  mascot: {
    width: '140px', height: '140px', borderRadius: '50%',
    objectFit: 'cover', border: '4px solid #ffccd9',
    boxShadow: '0 4px 30px rgba(255,150,180,0.3)',
    position: 'relative', zIndex: 1,
    transition: 'transform 0.1s',
  },
  heart: {
    position: 'absolute', zIndex: 10,
    animation: 'floatUp 1.2s ease-out forwards',
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute', top: '-8px', left: '50%',
    transform: 'translateX(-50%) translateY(-100%)',
    background: '#fff', color: '#6b3048',
    padding: '10px 16px', borderRadius: '18px',
    fontSize: '14px', whiteSpace: 'nowrap',
    boxShadow: '0 2px 16px rgba(255,150,180,0.2)',
    border: '1px solid #ffd6e7',
    zIndex: 20,
  },
  bubbleArrow: {
    position: 'absolute', bottom: '-6px', left: '50%',
    transform: 'translateX(-50%)',
    width: 0, height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #fff',
  },
  pokeHint: {
    marginTop: '12px', fontSize: '12px', color: '#d0a0b0',
    position: 'relative', zIndex: 1,
  },
  navGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px', padding: '0 18px', width: '100%', maxWidth: '400px',
    marginTop: '20px', boxSizing: 'border-box',
  },
  navCard: {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '16px', padding: '16px 8px',
    textAlign: 'center', cursor: 'pointer',
    border: '1px solid #ffd6e7',
    boxShadow: '0 2px 12px rgba(255,150,180,0.08)',
    transition: 'all 0.15s',
  },
  navEmoji: { fontSize: '28px', marginBottom: '6px' },
  navLabel: { fontSize: '12px', color: '#c05070', fontWeight: 'bold' },
  bottomSpace: { height: '30px' },
}
