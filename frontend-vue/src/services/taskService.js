
const API_URL = 'http://127.0.0.1:8000/api/tasks'

async function request(url, options = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    let detail = `HTTP ${response.status}`

    try {
      const errorData = await response.json()
      detail = typeof errorData.detail === 'string'
        ? errorData.detail
        : detail
    } catch {
      // JSON olmayan hata yanıtı
    }

    throw new Error(detail)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const taskService = {
  getAll() {
    return request(API_URL)
  },

  create(title) {
    return request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    })
  },

  toggle(id) {
    return request(`${API_URL}/${id}`, {
      method: 'PATCH'
    })
  },

  remove(id) {
    return request(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
  }
}
