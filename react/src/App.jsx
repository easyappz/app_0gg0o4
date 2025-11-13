import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import AdCreate from './components/AdCreate'
import AdEdit from './components/AdEdit'
import AdView from './components/AdView'
import MyAds from './components/MyAds'
import NotFound from './components/NotFound'
import Header from './components/Header'
import './App.css'

function RoutesReporter() {
  const location = useLocation()
  const routes = useMemo(() => [
    '/', '/register', '/login', '/profile', '/ads/new', '/ads/:id', '/ads/:id/edit', '/my-ads'
  ], [])
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(routes)
    }
  }, [routes, location])
  return null
}

function AppShell() {
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  return (
    <div data-easytag="id1-react/src/App.jsx" className="app-container">
      <Header token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null) }} />
      <div className="app-content">
        <RoutesReporter />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={(t)=>setToken(t)} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ads/new" element={<AdCreate />} />
          <Route path="/ads/:id" element={<AdView />} />
          <Route path="/ads/:id/edit" element={<AdEdit />} />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
