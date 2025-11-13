import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAds } from '../../api/ads'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(Number(params.get('page') || 1))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    search: params.get('search') || '',
    min_price: params.get('min_price') || '',
    max_price: params.get('max_price') || '',
  })

  const load = async (p = page, f = filters) => {
    setLoading(true); setError('')
    try {
      const query = { ...f, page: p }
      Object.keys(query).forEach(k => { if (query[k] === '' || query[k] === null) delete query[k] })
      const r = await getAds(query)
      setItems(r.data.results || [])
      setCount(r.data.count || 0)
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Ошибка загрузки'
      setError(msg)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const onFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })
  const apply = () => {
    setPage(1)
    const q = { ...filters, page: 1 }
    Object.keys(q).forEach(k => { if (!q[k]) delete q[k] })
    setParams(q)
    load(1, filters)
  }

  const pages = Math.ceil(count / 10)

  return (
    <div data-easytag="id6-react/src/components/Home/index.jsx">
      <h1>Объявления</h1>
      <div className="filters" style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 12 }}>
        <select name="category" value={filters.category} onChange={onFilterChange}>
          <option value="">Все категории</option>
          <option value="Автомобили">Автомобили</option>
          <option value="Недвижимость">Недвижимость</option>
        </select>
        <input name="search" placeholder="Поиск по названию/описанию" value={filters.search} onChange={onFilterChange} />
        <input name="min_price" type="number" placeholder="Цена от" value={filters.min_price} onChange={onFilterChange} />
        <input name="max_price" type="number" placeholder="Цена до" value={filters.max_price} onChange={onFilterChange} />
        <button onClick={apply}>Применить</button>
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Загрузка...</div> : (
        <div className="list" style={{ display: 'grid', gap: 12 }}>
          {items.map(ad => (
            <Link key={ad.id} to={`/ads/${ad.id}`} className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 600 }}>{ad.title}</div>
              <div style={{ color: '#374151' }}>{ad.category} • {ad.condition}</div>
              <div style={{ marginTop: 6, color: '#111827' }}>{Number(ad.price).toLocaleString('ru-RU')} ₽</div>
            </Link>
          ))}
          {items.length === 0 && <div>Нет объявлений</div>}
        </div>
      )}
      {pages > 1 && (
        <div className="pagination" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button disabled={page <= 1} onClick={() => { const np = page - 1; setPage(np); setParams({ ...Object.fromEntries(params.entries()), page: np }); load(np) }}>Назад</button>
          <div style={{ alignSelf: 'center' }}>{page} / {pages}</div>
          <button disabled={page >= pages} onClick={() => { const np = page + 1; setPage(np); setParams({ ...Object.fromEntries(params.entries()), page: np }); load(np) }}>Вперёд</button>
        </div>
      )}
    </div>
  )
}
