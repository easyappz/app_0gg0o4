import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAd } from '../api/ads'

export default function AdCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', condition: 'новое', contact_email: '', contact_phone: '' })
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, price: Number(form.price || 0) }
      const r = await createAd(payload)
      navigate(`/ads/${r.data.id}`)
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка создания'
      setError(msg)
    }
  }

  return (
    <div data-easytag="id7-react/src/components/AdCreate.jsx">
      <h1>Создать объявление</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Название<input name="title" value={form.title} onChange={onChange} required /></label>
        <label>Описание<textarea name="description" value={form.description} onChange={onChange} required rows={5} /></label>
        <label>Цена<input name="price" type="number" value={form.price} onChange={onChange} required /></label>
        <label>Категория<select name="category" value={form.category} onChange={onChange} required>
          <option value="">Выберите</option>
          <option value="Автомобили">Автомобили</option>
          <option value="Недвижимость">Недвижимость</option>
        </select></label>
        <label>Состояние<select name="condition" value={form.condition} onChange={onChange}>
          <option value="новое">новое</option>
          <option value="б/у">б/у</option>
        </select></label>
        <label>Email для связи<input name="contact_email" type="email" value={form.contact_email} onChange={onChange} /></label>
        <label>Телефон для связи<input name="contact_phone" value={form.contact_phone} onChange={onChange} /></label>
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  )
}
