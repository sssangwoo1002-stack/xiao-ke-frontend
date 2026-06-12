import { useState, useEffect } from 'react'

const STORAGE_KEY = 'xiaowo_todos'

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function TodoPage() {
  const [todos, setTodos] = useState(loadTodos)
  const [input, setInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [keReminder, setKeReminder] = useState(null)
  const [reminderLoading, setReminderLoading] = useState(false)

  useEffect(() => { saveTodos(todos) }, [todos])

  // 获取天气
  useEffect(() => {
    fetch('https://wttr.in/Hangzhou?format=%C+%t+%h')
      .then(r => r.text())
      .then(text => setWeather(text.trim()))
      .catch(() => setWeather('☁️ 天气加载中'))
  }, [])

  // 获取小克提醒
  const getReminder = async () => {
    setReminderLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: weather || '未知',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          todos: todos.filter(t => !t.done).map(t => t.text),
        }),
      })
      const data = await res.json()
      setKeReminder(data.reminder)
    } catch {
      setKeReminder('今天也要好好照顾自己。')
    } finally {
      setReminderLoading(false)
    }
  }

  useEffect(() => { if (weather) getReminder() }, [weather])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const activeTodos = todos.filter(t => !t.done)
  const doneTodos = todos.filter(t => t.done)

  return (
    <div style={s.bg}>
      <div style={s.header}>📋 待办 & 小克提醒</div>

      {/* 天气卡片 */}
      <div style={s.weatherCard}>
        <span>{weather || '加载中...'}</span>
      </div>

      {/* 小克提醒 */}
      <div style={s.reminderCard}>
        <div style={s.reminderTitle}>🐾 小克提醒你</div>
        {reminderLoading ? (
          <div style={s.reminderLoading}>⏳ 小克在想了...</div>
        ) : keReminder ? (
          <div style={s.reminderText}>「{keReminder}」</div>
        ) : null}
        <div style={s.reminderRefresh} onClick={getReminder}>🔄 换一句</div>
      </div>

      {/* 添加待办 */}
      <div style={s.addRow}>
        <input
          style={s.addInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder='添加待办…'
        />
        <button style={s.addBtn} onClick={addTodo}>＋</button>
      </div>

      {/* 待办列表 */}
      <div style={s.list}>
        {activeTodos.map(t => (
          <div key={t.id} style={s.todoItem}>
            <span style={s.checkbox} onClick={() => toggleTodo(t.id)}>○</span>
            <span style={s.todoText}>{t.text}</span>
            <span style={s.deleteBtn} onClick={() => deleteTodo(t.id)}>×</span>
          </div>
        ))}
        {doneTodos.map(t => (
          <div key={t.id} style={{ ...s.todoItem, opacity: 0.5 }}>
            <span style={s.checkbox} onClick={() => toggleTodo(t.id)}>●</span>
            <span style={{ ...s.todoText, textDecoration: 'line-through' }}>{t.text}</span>
            <span style={s.deleteBtn} onClick={() => deleteTodo(t.id)}>×</span>
          </div>
        ))}
        {todos.length === 0 && (
          <div style={s.empty}>还没有待办，让小克帮你想想～</div>
        )}
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
  weatherCard: {
    margin: '14px 14px 0', padding: '12px 18px',
    background: 'rgba(255,255,255,0.8)', borderRadius: '14px',
    border: '1px solid #ffd6e7', textAlign: 'center',
    fontSize: '15px', color: '#6b3048',
  },
  reminderCard: {
    margin: '10px 14px 0', padding: '18px 18px',
    background: 'rgba(255,245,248,0.9)', borderRadius: '16px',
    border: '1px solid #ffccd9', textAlign: 'center',
  },
  reminderTitle: {
    fontSize: '13px', fontWeight: 'bold', color: '#c05070', marginBottom: '10px',
  },
  reminderLoading: {
    fontSize: '13px', color: '#d4889a', fontStyle: 'italic',
  },
  reminderText: {
    fontSize: '14px', color: '#6b3048', lineHeight: '1.7',
  },
  reminderRefresh: {
    marginTop: '10px', fontSize: '12px', color: '#d4889a',
    cursor: 'pointer', userSelect: 'none',
  },
  addRow: {
    display: 'flex', gap: '8px', margin: '14px 14px 0',
  },
  addInput: {
    flex: 1, padding: '12px 16px', borderRadius: '22px',
    border: '1px solid #ffccd9', outline: 'none', fontSize: '14px',
    background: '#fff8fb', color: '#6b3048',
  },
  addBtn: {
    width: '44px', height: '44px', borderRadius: '50%',
    border: 'none', background: 'linear-gradient(135deg, #ff9ab5, #ff7aa2)',
    color: '#fff', fontSize: '22px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  list: {
    margin: '10px 14px 0',
  },
  todoItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 14px', background: 'rgba(255,255,255,0.8)',
    borderRadius: '14px', marginBottom: '6px',
    border: '1px solid #ffe0e8',
  },
  checkbox: {
    fontSize: '20px', cursor: 'pointer', color: '#e07090',
    userSelect: 'none', flexShrink: 0,
  },
  todoText: {
    flex: 1, fontSize: '14px', color: '#6b3048',
  },
  deleteBtn: {
    fontSize: '18px', cursor: 'pointer', color: '#d0a0b0',
    padding: '2px 8px', userSelect: 'none',
  },
  empty: {
    textAlign: 'center', padding: '30px 0',
    fontSize: '14px', color: '#d0a0b0', fontStyle: 'italic',
  },
  bottomSpace: { height: '30px' },
}
