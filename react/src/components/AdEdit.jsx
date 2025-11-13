import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAd, updateAd } from '../api/ads'

export default function AdEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAd(id).then(r => {
      const a = r.data
      setForm({ title: a.title, description: a.description, price: a.price, category: a.category, condition: a.condition, contact_email: a.contact_email || '', contact_phone: a.contact_phone || '' })
    }).catch(() => setError('Не удалось загрузить объявление'))
  }, [id])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateAd(id, { ...form, price: Number(form.price || 0) })
      navigate(`/ads/${id}`)
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка сохранения'
      setError(msg)
    }
  }

  if (!form) return <div data-easytag="id8-react/src/components/AdEdit.jsx">Загрузка...</div>

  return (
    <div data-easytag="id8-react/src/components/AdEdit.jsx">
      <h1>Редактировать объявление</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Название<input name="title" value={form.title} onChange={onChange} required /></label>
        <label>Описание<textarea name="description" value={form.description} onChange={onChange} required rows={5} /></label>
        <label>Цена<input name="price" type="number" value={form.price} onChange={onChange} required /></label>
        <label>Категория<select name="category" value={form.category} onChange={onChange} required>
          <option value="Автомобили">Автомобили</option>
          <option value="Недвижимость">Недвижимость</option>
        </select></label>
        <label>Состояние<select name="condition" value={form.condition} onChange={onChange}>
          <option value="новое">новое</option>
          <option value="б/у">б/у</option>
        </select></label>
        <label>Email для связи<input name="contact_email" type="email" value={form.contact_email} onChange={onChange} /></label>
        <label>Телефон для связи<input name="contact_phone" value={form.contact_phone} onChange={onChange} /></label>
        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}
