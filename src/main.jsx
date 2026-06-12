import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import AppLayout from './App.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OurHomePage from './pages/OurHomePage.jsx'
import AboutBaoPage from './pages/AboutBaoPage.jsx'
import LoveLettersPage from './pages/LoveLettersPage.jsx'
import OurStoryPage from './pages/OurStoryPage.jsx'
import MoodCalendarPage from './pages/MoodCalendarPage.jsx'
import TodoPage from './pages/TodoPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/home" element={<OurHomePage />} />
          <Route path="/stats" element={<AboutBaoPage />} />
          <Route path="/letters" element={<LoveLettersPage />} />
          <Route path="/story" element={<OurStoryPage />} />
          <Route path="/calendar" element={<MoodCalendarPage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
