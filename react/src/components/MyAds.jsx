import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyAds } from '../api/ads'

export default function MyAds() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMyAds().then(r => setItems(r.data.results || [])).catch(() => navigate('/login'))
  }, [navigate])

  return (
    <div data-easytag="id10-react/src/components/MyAds.jsx">
      <h1>Мои объявления</h1>
      {error && <div className="error">{error}</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(ad => (
          <div key={ad.id} className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{ad.title}</div>
                <div style={{ color: '#374151' }}>{ad.category} • {Number(ad.price).toLocaleString('ru-RU')} ₽</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/ads/${ad.id}`} className="btn">Открыть</Link>
                <Link to={`/ads/${ad.id}/edit`} className="btn">Редактировать</Link>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div>Нет объявлений</div>}
      </div>
    </div>
  )
}
