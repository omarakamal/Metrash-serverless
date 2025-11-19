const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let authToken = null
export function setAuthToken(token) { authToken = token }
export function clearAuthToken() { authToken = null }

async function request(path, { method='GET', headers={}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let errText = 'Request failed'
    try { const data = await res.json(); errText = data.error || data.err || JSON.stringify(data) } catch {}
    throw new Error(errText)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: b }),
  put: (p, b) => request(p, { method: 'PUT', body: b }),
  delete: (p) => request(p, { method: 'DELETE' }),
}
export { BASE_URL }
