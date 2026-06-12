import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(200)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    fetch(`${apiUrl}/api/settings`)
      .then(r => r.json())
      .then(d => {
        if (d.systemPrompt) setSystemPrompt(d.systemPrompt)
        if (d.temperature) setTemperature(d.temperature)
        if (d.maxTokens) setMaxTokens(d.maxTokens)
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    try {
      await fetch(`${apiUrl}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, temperature, maxTokens }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  return (
    <div style={s.bg}>
      <div style={s.header}>⚙️ 设置</div>

      <div style={s.card}>
        <div style={s.label}>🐾 系统提示词（定义小克的人设）</div>
        <textarea
          style={s.textarea}
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          rows={12}
        />
      </div>

      <div style={s.card}>
        <div style={s.label}>🌡️ 回复温度：{temperature}</div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={e => setTemperature(parseFloat(e.target.value))}
          style={s.slider}
        />
        <div style={s.hint}>低=稳定，高=更有创意</div>
      </div>

      <div style={s.card}>
        <div style={s.label}>📝 最大回复字数：{maxTokens}</div>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={maxTokens}
          onChange={e => setMaxTokens(parseInt(e.target.value))}
          style={s.slider}
        />
        <div style={s.hint}>每条约 {Math.round(maxTokens * 1.5)} 字上限</div>
      </div>

      <div style={s.saveWrap}>
        <button style={s.saveBtn} onClick={save}>
          {saved ? '✅ 已保存' : '💾 保存设置'}
        </button>
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
    fontSize: '18px', fontWeight: 'bold', color: '#c05070',
    background: 'rgba(255,245,248,0.95)', borderBottom: '1px solid #ffd6e7',
    textAlign: 'center',
  },
  card: {
    margin: '14px 14px 0', padding: '18px 18px',
    background: 'rgba(255,255,255,0.9)', borderRadius: '16px',
    border: '1px solid #ffd6e7',
  },
  label: {
    fontSize: '14px', fontWeight: 'bold', color: '#c05070', marginBottom: '12px',
  },
  textarea: {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    border: '1px solid #ffccd9', outline: 'none', fontSize: '13px',
    background: '#fff8fb', color: '#6b3048', fontFamily: 'inherit',
    resize: 'vertical', boxSizing: 'border-box',
  },
  slider: {
    width: '100%', accentColor: '#e07090',
  },
  hint: {
    fontSize: '11px', color: '#d0a0b0', marginTop: '4px',
  },
  saveWrap: {
    margin: '20px 14px 0', textAlign: 'center',
  },
  saveBtn: {
    padding: '14px 48px', borderRadius: '26px',
    border: 'none', background: 'linear-gradient(135deg, #ff9ab5, #ff7aa2)',
    color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
  },
  bottomSpace: { height: '30px' },
}
