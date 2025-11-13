import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await loginApi(form)
      const token = res.data?.access_token
      if (token) {
        localStorage.setItem('token', token)
        if (typeof onLogin === 'function') onLogin(token)
        navigate('/profile')
      } else {
        setError('Токен не получен')
      }
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка авторизации'
      setError(msg)
    }
  }

  return (
    <div data-easytag="id4-react/src/components/Login.jsx">
      <h1>Вход</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Email<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
        <label>Пароль<input name="password" type="password" value={form.password} onChange={onChange} required /></label>
        <button type="submit">Войти</button>
      </form>
    </div>
  )
}
