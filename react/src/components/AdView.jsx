import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAd, deleteAd } from '../api/ads'
import { getMe } from '../api/members'

export default function AdView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = useState(null)
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAd(id).then(r => setAd(r.data)).catch(() => setError('Объявление не найдено'))
    getMe().then(r => setMe(r.data)).catch(() => setMe(null))
  }, [id])

  const canEdit = ad && me && ad.owner && ad.owner.id === me.id

  const onDelete = async () => {
    try {
      await deleteAd(id)
      navigate('/my-ads')
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка удаления'
      setError(msg)
    }
  }

  if (!ad) return <div data-easytag="id9-react/src/components/AdView.jsx">Загрузка...</div>

  return (
    <div data-easytag="id9-react/src/components/AdView.jsx">
      {error && <div className="error">{error}</div>}
      <h1>{ad.title}</h1>
      <div style={{ color: '#374151' }}>{ad.category} • {ad.condition}</div>
      <div style={{ marginTop: 8, fontSize: 20, fontWeight: 600 }}>{Number(ad.price).toLocaleString('ru-RU')} ₽</div>
      <p style={{ marginTop: 12 }}>{ad.description}</p>

      <div style={{ marginTop: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Автор объявления</div>
        <div>Имя: {ad.owner?.username}</div>
        <div>Email: {ad.owner?.email}</div>
        <div>Телефон: {ad.owner?.phone || 'не указан'}</div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        {canEdit && <Link to={`/ads/${ad.id}/edit`} className="btn">Редактировать</Link>}
        {canEdit && <button onClick={onDelete}>Удалить</button>}
        <Link to="/">Назад к списку</Link>
      </div>
    </div>
  )
}
