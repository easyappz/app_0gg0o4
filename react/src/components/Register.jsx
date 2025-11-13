import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await registerApi(form)
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка регистрации'
      setError(msg)
    }
  }

  return (
    <div data-easytag="id3-react/src/components/Register.jsx">
      <h1>Регистрация</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Имя пользователя<input name="username" value={form.username} onChange={onChange} required /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
        <label>Телефон<input name="phone" value={form.phone} onChange={onChange} /></label>
        <label>Пароль<input name="password" type="password" value={form.password} onChange={onChange} required minLength={6} /></label>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  )
}
