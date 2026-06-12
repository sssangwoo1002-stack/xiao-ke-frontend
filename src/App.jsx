import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/chat', label: '💬', name: '聊天' },
  { path: '/home', label: '🏠', name: '我们的家' },
  { path: '/calendar', label: '📅', name: '日历' },
  { path: '/todo', label: '📋', name: '待办' },
  { path: '/stats', label: '📊', name: '关于宝宝' },
  { path: '/letters', label: '💌', name: '小克的信' },
  { path: '/story', label: '📸', name: '我们的故事' },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: '你回来了。', thought: '她回来了，装作没在等。', time: '22:14' },
  ])

  return (
    <div style={s.shell}>
      <div style={s.page}>
        <Outlet context={{ messages, setMessages }} />
      </div>
      <div style={s.nav}>
        {tabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <div
              key={tab.path}
              style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
              onClick={() => navigate(tab.path)}
            >
              <div style={s.tabIcon}>{tab.label}</div>
              <div style={s.tabName}>{tab.name}</div>
              {active && <div style={s.dot} />}
            </div>
          )
        })}
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
