const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('umkm_token');
  const coManageLandingPageId = localStorage.getItem('coManageLandingPageId');
  
  let finalEndpoint = endpoint;
  if (coManageLandingPageId && !endpoint.includes('allow-admin-edit') && !endpoint.includes('/auth/') && !endpoint.includes('/analytics/platform') && !endpoint.includes('/users')) {
    const separator = endpoint.includes('?') ? '&' : '?';
    finalEndpoint = `${endpoint}${separator}landingPageId=${coManageLandingPageId}`;
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${finalEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan sistem.');
  }

  return data;
}

export const api = {
  // Upload Gambar
  uploadImage: async (file) => {
    const token = localStorage.getItem('umkm_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type di sini, biarkan browser isi multipart boundary otomatis
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengunggah gambar.');
    return data; // { url, filename, originalname, size }
  },

  // Auth
  register: (dto) => request('/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
  login: (dto) => request('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  getMe: () => request('/auth/me'),

  // Users (Super Admin)
  getUsers: () => request('/users'),
  toggleUserStatus: (id, isActive) => request(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Business Profile
  getBusiness: () => request('/business/mine'),
  updateBusiness: (dto) => request('/business/mine', { method: 'PUT', body: JSON.stringify(dto) }),

  // Landing Page
  getPublicSite: (slug) => request(`/landing-page/slug/${slug}`),
  getAllLandingPages: () => request('/landing-page/all'),
  getMyLandingPage: () => request('/landing-page/mine'),
  updateHero: (dto) => request('/landing-page/hero', { method: 'PUT', body: JSON.stringify(dto) }),
  updateAbout: (dto) => request('/landing-page/about', { method: 'PUT', body: JSON.stringify(dto) }),
  updateTheme: (dto) => request('/landing-page/theme', { method: 'PUT', body: JSON.stringify(dto) }),
  toggleAdminConsent: (allowAdminEdit) => request('/landing-page/allow-admin-edit', { method: 'PUT', body: JSON.stringify({ allowAdminEdit }) }),
  updateCustomNav: (customNavItems) => request('/landing-page/custom-nav', { method: 'PUT', body: JSON.stringify({ customNavItems }) }),
  updateCatalogLayout: (catalogLayout) => request('/landing-page/catalog-layout', { method: 'PUT', body: JSON.stringify({ catalogLayout }) }),

  // Custom Sections CRUD
  getCustomSections: () => request('/landing-page/sections'),
  createCustomSection: (dto) => request('/landing-page/sections', { method: 'POST', body: JSON.stringify(dto) }),
  updateCustomSection: (id, dto) => request(`/landing-page/sections/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  deleteCustomSection: (id) => request(`/landing-page/sections/${id}`, { method: 'DELETE' }),

  // Products & Services
  getProducts: () => request('/products'),
  createProduct: (dto) => request('/products', { method: 'POST', body: JSON.stringify(dto) }),
  updateProduct: (id, dto) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => request('/gallery'),
  createGalleryItem: (dto) => request('/gallery', { method: 'POST', body: JSON.stringify(dto) }),
  deleteGalleryItem: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => request('/testimonials'),
  createTestimonial: (dto) => request('/testimonials', { method: 'POST', body: JSON.stringify(dto) }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: 'DELETE' }),

  // Leads
  submitLead: (slug, dto) => request(`/leads/submit/${slug}`, { method: 'POST', body: JSON.stringify(dto) }),
  getMyLeads: () => request('/leads/mine'),
  getAllLeads: () => request('/leads/all'),
  updateLeadStatus: (id, status) => request(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),

  // SEO Settings
  getSeo: () => request('/seo/mine'),
  updateSeo: (dto) => request('/seo/mine', { method: 'PUT', body: JSON.stringify(dto) }),

  // Domain Settings
  getDomain: () => request('/domain/mine'),
  updateDomain: (dto) => request('/domain/mine', { method: 'PUT', body: JSON.stringify(dto) }),
  verifyDomain: (landingPageId, status) => request(`/domain/${landingPageId}/verify`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Analytics
  getAnalytics: () => request('/analytics/mine'),
  getPlatformStats: () => request('/analytics/platform'),
};
