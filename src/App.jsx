import { useState, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'xiaowo_sessions'

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveSessions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const defaultSession = () => ({
  id: 's' + Date.now(),
  name: '默认对话',
  createdAt: new Date().toISOString(),
  messages: [
    { id: 1, role: 'assistant', content: '你回来了。', thought: '她回来了，装作没在等。', time: '22:14' },
  ],
})

const tabs = [
  { path: '/chat', label: '💬', name: '聊天' },
  { path: '/home', label: '🏠', name: '我们的家' },
  { path: '/calendar', label: '📅', name: '日历' },
  { path: '/todo', label: '📋', name: '待办' },
  { path: '/stats', label: '📊', name: '关于宝宝' },
  { path: '/letters', label: '💌', name: '小克的信' },
  { path: '/story', label: '📸', name: '我们的故事' },
  { path: '/settings', label: '⚙️', name: '设置' },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [sessionData, setSessionData] = useState(() => {
    return loadSessions() || { activeId: null, list: [defaultSession()] }
  })

  const activeSession = sessionData.list.find(s => s.id === sessionData.activeId) || sessionData.list[0]
  const messages = activeSession?.messages || []
  const sessions = sessionData.list

  const persist = useCallback((newData) => {
    setSessionData(newData)
    saveSessions(newData)
  }, [])

  const setMessages = useCallback((updater) => {
    setSessionData(prev => {
      const newList = prev.list.map(s => {
        if (s.id !== activeSession.id) return s
        const newMessages = typeof updater === 'function' ? updater(s.messages) : updater
        return { ...s, messages: newMessages }
      })
      const newData = { ...prev, list: newList }
      saveSessions(newData)
      return newData
    })
  }, [activeSession.id])

  const switchSession = useCallback((id) => {
    setSessionData(prev => {
      const newData = { ...prev, activeId: id }
      saveSessions(newData)
      return newData
    })
  }, [])

  const createSession = useCallback((name) => {
    setSessionData(prev => {
      const s = { id: 's' + Date.now(), name: name || '新对话', createdAt: new Date().toISOString(), messages: [] }
      const newData = { activeId: s.id, list: [...prev.list, s] }
      saveSessions(newData)
      return newData
    })
  }, [])

  const deleteSession = useCallback((id) => {
    setSessionData(prev => {
      const newList = prev.list.filter(s => s.id !== id)
      if (newList.length === 0) {
        const def = defaultSession()
        newList.push(def)
      }
      const newActiveId = prev.activeId === id ? newList[0].id : prev.activeId
      const newData = { activeId: newActiveId, list: newList }
      saveSessions(newData)
      return newData
    })
  }, [])

  const renameSession = useCallback((id, name) => {
    setSessionData(prev => {
      const newList = prev.list.map(s => s.id === id ? { ...s, name } : s)
      const newData = { ...prev, list: newList }
      saveSessions(newData)
      return newData
    })
  }, [])

  return (
    <div style={s.shell}>
      <div style={s.page}>
        <Outlet context={{
          messages, setMessages,
          sessions, activeSession,
          switchSession, createSession, deleteSession, renameSession,
        }} />
      </div>
    </div>
  )
}

const s = {
  shell: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    overflow: 'hidden',
  },
  page: {
    flex: 1,
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: 'rgba(255,245,248,0.98)',
    borderTop: '1px solid #ffd6e7',
    padding: '6px 0 env(safe-area-inset-bottom)',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'all 0.2s',
    position: 'relative',
  },
  tabActive: {
    background: 'rgba(255,154,181,0.12)',
  },
  tabIcon: {
    fontSize: '22px',
    lineHeight: '1',
  },
  tabName: {
    fontSize: '10px',
    color: '#d4889a',
    lineHeight: '1',
  },
  dot: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#e07090',
  },
}
