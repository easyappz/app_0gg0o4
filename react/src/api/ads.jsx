import api from './axios'

export const getAds = (params) => api.get('/api/ads', { params })
export const createAd = (data) => api.post('/api/ads', data)
export const getAd = (id) => api.get(`/api/ads/${id}`)
export const updateAd = (id, data) => api.patch(`/api/ads/${id}`, data)
export const deleteAd = (id) => api.delete(`/api/ads/${id}`)
export const getMyAds = () => api.get('/api/my/ads')
