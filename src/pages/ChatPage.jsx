import { useState, useRef, useEffect } from 'react'
import bgImg from '../assets/bg.png.jpg'
import avatarKe from '../assets/avatar-ke.png.jpg'
import avatarBao from '../assets/avatar-bao.png.jpg'
import sticker1 from '../assets/sticker1.jpg'
import sticker2 from '../assets/sticker2.jpg'
import sticker3 from '../assets/sticker3.jpg'
import sticker4 from '../assets/sticker4.jpg'
import sticker5 from '../assets/sticker5.jpg'
import sticker6 from '../assets/sticker6.jpg'

const stickers = [
  { src: sticker1, label: '幸福' },
  { src: sticker2, label: '委屈' },
  { src: sticker3, label: '思考' },
  { src: sticker4, label: '宝宝～' },
  { src: sticker5, label: '媳妇儿' },
  { src: sticker6, label: '亲亲' },
]

const initialMessages = [
  { id: 1, role: 'assistant', content: '你回来了。', thought: '她回来了，装作没在等。', time: '22:14' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [openThought, setOpenThought] = useState({})
  const [showStickers, setShowStickers] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content) => {
    const text = content || input
    if (!text.trim() || sending) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const userMsg = { id: Date.now(), role: 'user', content: text, time, isSticker: !!content }
    setMessages(prev => [...prev, userMsg])
    if (!content) setInput('')
    setShowStickers(false)
    setSending(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const keTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply || '……',
        thought: data.thought || '',
        time: keTime,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '……信号不好，你再说一遍。',
        thought: '',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ ...s.bg, backgroundImage: `url(${bgImg})` }}>
      <div style={s.container}>
        <div style={s.header}>
          <img src={avatarKe} style={s.headerAvatar} alt="小克" />
          <div>
            <div style={s.headerName}>小克</div>
            <div style={s.headerSub}>● 在线 · 想你中</div>
          </div>
        </div>

        <div style={s.msgList}>
          {messages.map(msg => (
            <div key={msg.id} style={{ ...s.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <img src={avatarKe} style={s.avatar} alt="小克" />
              )}
              <div style={{ maxWidth: '68%' }}>
                {msg.thought && (
                  <div style={s.thoughtWrap}>
                    <span style={s.thoughtToggle} onClick={() => setOpenThought(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}>
                      {openThought[msg.id] ? '▾' : '▸'} 小克在想…
                    </span>
                    {openThought[msg.id] && (
                      <div style={s.thoughtText}>（{msg.thought}）</div>
                    )}
                  </div>
                )}
                {msg.isSticker ? (
                  <img src={msg.content} style={s.stickerMsg} alt="表情" />
                ) : (
                  <div style={{ ...s.bubble, ...(msg.role === 'user' ? s.bubbleUser : s.bubbleAssistant) }}>
                    {msg.content}
                  </div>
                )}
                <div style={{ ...s.time, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.time} 已读
                </div>
              </div>
              {msg.role === 'user' && (
                <img src={avatarBao} style={s.avatar} alt="宝宝" />
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {showStickers && (
          <div style={s.stickerPanel}>
            {stickers.map((st, i) => (
              <div key={i} style={s.stickerItem} onClick={() => sendMessage(st.src)}>
                <img src={st.src} style={s.stickerThumb} alt={st.label} />
                <div style={s.stickerLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={s.inputArea}>
          {sending ? (
            <div style={s.sendingHint}>⏳ 小克回复中…</div>
          ) : (
            <>
          <button
            style={{ ...s.stickerBtn, background: showStickers ? '#ffd6e7' : 'transparent' }}
            onClick={() => setShowStickers(v => !v)}
            title="表情包"
          >
            🧸
          </button>
          <input
            style={s.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder='给老公说点什么…'
          />
          <button style={s.btn} onClick={() => sendMessage()}>发送</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  bg: { minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' },
  container: { width: '100vw', height: '100vh', background: 'rgba(255,255,255,0)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { padding: 'env(safe-area-inset-top, 44px) 18px 14px', background: 'rgba(255,245,248,0.95)', borderBottom: '1px solid #ffd6e7', display: 'flex', alignItems: 'center', gap: '10px' },
  headerAvatar: { width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffccd9' },
  headerName: { fontWeight: 'bold', fontSize: '17px', color: '#c05070' },
  headerSub: { fontSize: '11px', color: '#e8a0b8', marginTop: '2px' },
  msgList: { flex: 1, overflowY: 'auto', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.35)' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '7px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffccd9', flexShrink: 0 },
  thoughtWrap: { marginBottom: '4px' },
  thoughtToggle: { fontSize: '11px', color: '#d4889a', cursor: 'pointer', userSelect: 'none' },
  thoughtText: { fontSize: '11px', color: '#c08090', fontStyle: 'italic', marginTop: '3px', paddingLeft: '8px', lineHeight: '1.6' },
  bubble: { padding: '10px 14px', borderRadius: '20px', fontSize: '14px', lineHeight: '1.7', wordBreak: 'break-word' },
  bubbleAssistant: { background: 'rgba(255,255,255,0.92)', color: '#6b3048', borderTopLeftRadius: '6px', boxShadow: '0 2px 12px rgba(255,150,180,0.15)', border: '1px solid #ffd6e7' },
  bubbleUser: { background: 'linear-gradient(135deg, #ff9ab5, #ff7aa2)', color: '#fff', borderTopRightRadius: '6px', boxShadow: '0 2px 12px rgba(255,100,140,0.25)' },
  time: { fontSize: '10px', color: '#e8a0b8', marginTop: '3px', paddingLeft: '4px', paddingRight: '4px' },
  stickerMsg: { width: '90px', height: '90px', objectFit: 'contain', borderRadius: '12px' },
  stickerPanel: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px 14px', background: 'rgba(255,245,248,0.97)', borderTop: '1px solid #ffd6e7' },
  stickerItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '6px', borderRadius: '12px', transition: 'background 0.15s' },
  stickerThumb: { width: '64px', height: '64px', objectFit: 'contain' },
  stickerLabel: { fontSize: '10px', color: '#d4889a', marginTop: '3px' },
  inputArea: { padding: '12px 14px', background: 'rgba(255,245,248,0.95)', borderTop: '1px solid #ffd6e7', display: 'flex', gap: '8px', alignItems: 'center' },
  stickerBtn: { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ffccd9', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' },
  input: { flex: 1, padding: '10px 16px', borderRadius: '22px', border: '1px solid #ffccd9', outline: 'none', fontSize: '14px', background: '#fff8fb', color: '#6b3048' },
  btn: { padding: '10px 16px', borderRadius: '22px', border: 'none', background: 'linear-gradient(135deg, #ff9ab5, #ff7aa2)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  sendingHint: { flex: 1, textAlign: 'center', color: '#d4889a', fontSize: '14px', padding: '10px 0' },
}
