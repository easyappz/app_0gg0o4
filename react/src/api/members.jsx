import api from './axios'

export const getMe = () => api.get('/api/members/me')
export const updateMe = (data) => api.patch('/api/members/me', data)
