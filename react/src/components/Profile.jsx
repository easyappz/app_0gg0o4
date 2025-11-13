import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, updateMe } from '../api/members'

export default function Profile() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getMe().then(r => setMe(r.data)).catch(() => navigate('/login'))
  }, [navigate])

  const onChange = (e) => setMe({ ...me, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      const res = await updateMe({ username: me.username, phone: me.phone })
      setMe(res.data)
      setSuccess('Профиль обновлён')
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка сохранения'
      setError(msg)
    }
  }

  if (!me) return <div data-easytag="id5-react/src/components/Profile.jsx">Загрузка...</div>

  return (
    <div data-easytag="id5-react/src/components/Profile.jsx">
      <h1>Профиль</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Имя пользователя<input name="username" value={me.username || ''} onChange={onChange} /></label>
        <label>Email<input value={me.email || ''} disabled /></label>
        <label>Телефон<input name="phone" value={me.phone || ''} onChange={onChange} /></label>
        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}
