// Points to the live PHP backend hosted on InfinityFree.
const BASE_URL = 'https://veylor.gt.tc/backend'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'حصل خطأ، حاول تاني')
  }
  return data
}

export const api = {
  // auth
  register: (payload) => request('/api/auth/register.php', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login.php', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/api/auth/logout.php', { method: 'POST' }),
  me: () => request('/api/auth/me.php'),

  // products
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/products/list.php${qs ? `?${qs}` : ''}`)
  },
  getProduct: (slug) => request(`/api/products/get.php?slug=${encodeURIComponent(slug)}`),
  categories: () => request('/api/products/categories.php'),

  // orders
  createOrder: (payload) => request('/api/orders/create.php', { method: 'POST', body: JSON.stringify(payload) }),
  myOrders: () => request('/api/orders/my.php'),

  // admin
  createProduct: (payload) => request('/api/admin/products_create.php', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (payload) => request('/api/admin/products_update.php', { method: 'POST', body: JSON.stringify(payload) }),
  deleteProduct: (id) => request('/api/admin/products_delete.php', { method: 'POST', body: JSON.stringify({ id }) }),
  adminOrders: () => request('/api/admin/orders_list.php'),
  updateOrderStatus: (id, status) => request('/api/admin/orders_update_status.php', { method: 'POST', body: JSON.stringify({ id, status }) }),
}
