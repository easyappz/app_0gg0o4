import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMe } from '../api/members'

export default function Header({ token, onLogout }) {
  const [me, setMe] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      getMe().then(r => setMe(r.data)).catch(() => setMe(null))
    } else {
      setMe(null)
    }
  }, [token])
  return (
    <header data-easytag="id2-react/src/components/Header.jsx" className="header">
      <div className="header-inner">
        <Link to="/" className="brand">Доска объявлений</Link>
        <nav className="nav">
          <Link to="/">Главная</Link>
          {token && <Link to="/ads/new">Создать объявление</Link>}
          {token && <Link to="/my-ads">Мои объявления</Link>}
        </nav>
        <div className="auth">
          {token ? (
            <>
              <Link to="/profile">{me ? me.username : 'Профиль'}</Link>
              <button onClick={() => { onLogout(); navigate('/'); }}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
