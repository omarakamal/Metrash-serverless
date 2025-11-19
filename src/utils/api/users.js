import { api } from './client.js'

export async function createAdmin({ username, password }) {
  return api.post('/users/create', { username, password })
}

export async function listUsers() {
  return api.get('/users')
}
