import { useState, useEffect } from 'react'

const DAYS_OF_WEEK = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const BAO_MOODS = ['😊', '😢', '😤', '😴', '🥰', '😐']

const STORAGE_KEY = 'xiaowo_calendar'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function MoodCalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [data, setData] = useState(loadData)
  const [selected, setSelected] = useState(null)
  const [keThinking, setKeThinking] = useState(false)

  useEffect(() => { saveData(data) }, [data])

  const goMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m)
    setYear(y)
  }

  const key = (d) => {
    const m = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${year}-${m}-${dd}`
  }

  const todayKey = key(today.getDate())

  const updateDay = (k, updates) => {
    setData(prev => {
      const next = { ...prev }
      if (!next[k]) next[k] = {}
      next[k] = { ...next[k], ...updates }
      if (!next[k].baoMood && !next[k].period && !next[k].keComment) {
        delete next[k]
      }
      return next
    })
  }

  const setMood = async (k, mood) => {
    const currentMood = data[k]?.baoMood
    const newMood = currentMood === mood ? undefined : mood
    updateDay(k, { baoMood: newMood })
    if (!newMood) return

    // 让小克看到心情并留言
    setKeThinking(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/calendar-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: newMood }),
      })
      const d = await res.json()
      updateDay(k, { keComment: d.comment || '' })
    } catch {
      updateDay(k, { keComment: '……' })
    } finally {
      setKeThinking(false)
    }
  }

  const togglePeriod = (k) => {
    const current = data[k]?.period
    updateDay(k, { period: current ? undefined : '🔴' })
  }

  const currentData = selected ? (data[selected] || {}) : {}

  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)

  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  return (
    <div style={s.bg}>
      <div style={s.header}>📅 我们的日历</div>

      <div style={s.monthNav}>
        <span style={s.arrow} onClick={() => goMonth(-1)}>◀</span>
        <span style={s.monthLabel}>{year}年 {MONTHS[month]}</span>
        <span style={s.arrow} onClick={() => goMonth(1)}>▶</span>
      </div>

      <div style={s.legend}>
        <div style={s.legendRow}>
          <span style={s.legendLabel}>🎀 心情：</span>
          {BAO_MOODS.map(m => <span key={m} style={s.legendEmoji}>{m}</span>)}
        </div>
        <div style={s.legendRow}>
          <span style={s.legendLabel}>🔴 姨妈期</span>
        </div>
      </div>

      <div style={s.grid}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={s.dayHeader}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} style={s.dayCell} />
          const k = key(d)
          const dayData = data[k] || {}
          const isToday = k === todayKey
          return (
            <div
              key={k}
              style={{ ...s.dayCell, ...(isToday ? s.dayToday : {}), ...(dayData.period ? s.dayPeriod : {}) }}
              onClick={() => setSelected(k)}
            >
              <div style={s.dayNum}>{d}</div>
              {dayData.baoMood && <div style={s.moodBig}>{dayData.baoMood}</div>}
              {dayData.period && <div style={s.periodMark}>🔴</div>}
            </div>
          )
        })}
      </div>

      {selected && (
        <>
          <div style={s.overlay} onClick={() => setSelected(null)} />
          <div style={s.panel}>
            <div style={s.panelTitle}>{selected}</div>

            <div style={s.pickRow}>
              <div style={s.pickLabel}>🎀 我今天的心情</div>
              <div style={s.pickOptions}>
                {BAO_MOODS.map(m => (
                  <span
                    key={m}
                    style={{ ...s.pickEmoji, ...(currentData.baoMood === m ? s.pickActive : {}) }}
                    onClick={() => setMood(selected, m)}
                  >{m}</span>
                ))}
              </div>
            </div>

            <div style={s.pickRow}>
              <div style={s.pickLabel}>📌 姨妈标记</div>
              <div
                style={{ ...s.periodToggle, ...(currentData.period ? s.periodOn : {}) }}
                onClick={() => togglePeriod(selected)}
              >
                {currentData.period ? '🔴 姨妈期中' : '⚪ 未标记'}
              </div>
            </div>

            <div style={s.pickRow}>
              <div style={s.pickLabel}>🐾 小克说</div>
              {keThinking ? (
                <div style={s.keThinking}>⏳ 小克正在想...</div>
              ) : currentData.keComment ? (
                <div style={s.keComment}>「{currentData.keComment}」</div>
              ) : (
                <div style={s.keEmpty}>选一个心情，让小克知道～</div>
              )}
            </div>

            <div style={s.panelClose} onClick={() => setSelected(null)}>关闭</div>
          </div>
        </>
      )}

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
  monthNav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px 8px',
  },
  arrow: { fontSize: '18px', cursor: 'pointer', color: '#c05070', padding: '4px 8px', userSelect: 'none' },
  monthLabel: { fontSize: '16px', fontWeight: 'bold', color: '#c05070' },
  legend: {
    margin: '0 14px', padding: '12px 14px',
    background: 'rgba(255,255,255,0.8)', borderRadius: '14px',
    border: '1px solid #ffd6e7',
  },
  legendRow: {
    display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
    fontSize: '12px', color: '#9b6070', marginBottom: '4px',
  },
  legendLabel: { fontWeight: 'bold', minWidth: '60px' },
  legendEmoji: { fontSize: '16px' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
    margin: '10px 14px', gap: '2px',
  },
  dayHeader: {
    textAlign: 'center', fontSize: '12px', color: '#d4889a',
    padding: '6px 0', fontWeight: 'bold',
  },
  dayCell: {
    aspectRatio: '1', borderRadius: '10px',
    background: 'rgba(255,255,255,0.7)', border: '1px solid #ffe0e8',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer',
    padding: '2px', fontSize: '12px', color: '#9b6070',
    position: 'relative', minHeight: '52px',
  },
  dayToday: {
    border: '2px solid #e07090',
    background: 'rgba(255,154,181,0.08)',
  },
  dayPeriod: {
    background: 'rgba(255,100,100,0.06)',
  },
  dayNum: { fontSize: '12px', fontWeight: 'bold', color: '#6b3048' },
  moodBig: { fontSize: '18px', marginTop: '2px' },
  periodMark: { fontSize: '8px', position: 'absolute', bottom: '2px', right: '3px' },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.35)', zIndex: 100,
  },
  panel: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#fff5f7', zIndex: 101,
    borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
    padding: '20px 18px',
    paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
    boxShadow: '0 -4px 24px rgba(255,150,180,0.2)',
  },
  panelTitle: {
    fontSize: '16px', fontWeight: 'bold', color: '#c05070',
    textAlign: 'center', marginBottom: '18px',
  },
  pickRow: { marginBottom: '16px' },
  pickLabel: { fontSize: '13px', fontWeight: 'bold', color: '#c05070', marginBottom: '8px' },
  pickOptions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  pickEmoji: {
    fontSize: '30px', cursor: 'pointer', padding: '6px 10px',
    borderRadius: '12px', border: '2px solid transparent',
  },
  pickActive: {
    border: '2px solid #e07090',
    background: 'rgba(255,154,181,0.12)',
  },
  periodToggle: {
    display: 'inline-block', padding: '10px 20px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '14px', border: '1px solid #ffccd9',
    background: '#fff', color: '#d4889a',
  },
  periodOn: {
    background: 'rgba(255,100,100,0.08)', border: '1px solid #e07090',
    color: '#c05070', fontWeight: 'bold',
  },
  keThinking: {
    fontSize: '13px', color: '#d4889a', fontStyle: 'italic',
    padding: '10px 0',
  },
  keComment: {
    fontSize: '14px', color: '#6b3048', lineHeight: '1.7',
    background: 'rgba(255,255,255,0.7)', padding: '12px 14px',
    borderRadius: '14px', border: '1px solid #ffd6e7',
  },
  keEmpty: {
    fontSize: '13px', color: '#d0a0b0', fontStyle: 'italic',
    padding: '8px 0',
  },
  panelClose: {
    textAlign: 'center', fontSize: '14px', color: '#d4889a',
    cursor: 'pointer', padding: '14px 0 0', marginTop: '4px',
    borderTop: '1px solid #ffe0e8',
  },
  bottomSpace: { height: '20px' },
}
