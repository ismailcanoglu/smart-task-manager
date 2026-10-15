
const API_URL = "http://127.0.0.1:8001/api/tasks";

async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API hatası (${response.status}): ${errorText}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const taskApi = {
  getAll() {
    return request();
  },

  create(title) {
    return request("", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  toggle(id) {
    return request(`/${id}`, {
      method: "PATCH",
    });
  },

  remove(id) {
    return request(`/${id}`, {
      method: "DELETE",
    });
  },
};
