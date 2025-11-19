import { api, setAuthToken, clearAuthToken } from './client.js'

export async function login(username, password) {
  return api.post('/auth/login', { username, password })
}

export async function getProfile() {
  return api.get('/auth/verify')
}

export { setAuthToken, clearAuthToken }
