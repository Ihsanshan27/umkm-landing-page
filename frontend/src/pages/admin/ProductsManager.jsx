import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, AlertTriangle } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setIsActive(true);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price ? product.price.toString() : '');
    setImageUrl(product.imageUrl || '');
    setIsActive(product.isActive);
    setError('');
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const priceNum = price ? parseFloat(price) : undefined;

    try {
      if (editingProduct) {
        // Edit action
        const updated = await api.updateProduct(editingProduct.id, {
          name,
          description,
          price: priceNum,
          imageUrl,
          isActive,
        });
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
        setSuccess('Produk/layanan berhasil diperbarui!');
      } else {
        // Add action
        const created = await api.createProduct({
          name,
          description,
          price: priceNum,
          imageUrl,
          isActive,
        });
        setProducts([created, ...products]);
        setSuccess('Produk/layanan baru berhasil ditambahkan!');
      }

      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        name: product.name,
        isActive: !product.isActive,
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
      setSuccess(`Status produk diubah menjadi ${!product.isActive ? 'Aktif' : 'Tidak Aktif'}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah status produk.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk/layanan ini?')) return;
    setError('');
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setSuccess('Produk/layanan berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus produk.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Katalog Produk & Layanan</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola katalog produk, layanan jasa, daftar harga, dan gambar menu Anda</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" /> Tambah Produk
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-slate-800/80 max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white tracking-tight">Belum Ada Produk</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Katalog menu atau jasa Anda masih kosong. Mulai tambahkan produk unggulan Anda agar langsung tampil di public landing page!
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Mulai Tambah Sekarang
          </button>
        </div>
      ) : (
        /* Grid Products */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`glass rounded-3xl overflow-hidden border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700 transition duration-300 relative ${
                !product.isActive && 'opacity-65'
              }`}
            >
              {/* Product Thumbnail */}
              <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs bg-slate-900/60 font-semibold select-none">
                    TANPA FOTO
                  </div>
                )}
                {/* Active Indicator Badge */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-md ${
                    product.isActive
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {product.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {product.description || 'Tidak ada deskripsi singkat.'}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold text-slate-200">
                    {product.price !== null && product.price !== undefined
                      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)
                      : 'Hubungi Kami'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      title={product.isActive ? 'Sembunyikan dari Publik' : 'Tampilkan ke Publik'}
                      className="p-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                    >
                      {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      title="Edit Produk"
                      className="p-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      title="Hapus Produk"
                      className="p-1.5 rounded-lg bg-slate-950/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-md border border-slate-800 shadow-2xl p-6 relative animate-zoom-in">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-md font-bold text-white tracking-tight mb-5 border-b border-slate-800 pb-3 uppercase tracking-wider">
              {editingProduct ? 'Sunting Produk/Layanan' : 'Tambah Produk Baru'}
            </h2>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Produk/Jasa</label>
                <input
                  type="text"
                  required
                  placeholder="Kopi Susu Aren"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Harga (Rupiah, opsional)</label>
                <input
                  type="number"
                  placeholder="22000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                />
              </div>

              {/* Foto Produk */}
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Foto Produk"
                placeholder="https://images.unsplash.com/..."
              />

              {/* Description */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Deskripsi Singkat</label>
                <textarea
                  rows="3"
                  placeholder="Kombinasi espresso mantap dengan creamer gurih..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                ></textarea>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 py-1">
                <input
                  id="isActiveToggle"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 rounded border-slate-800 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-slate-300 text-xs font-semibold uppercase tracking-wider cursor-pointer">
                  Aktif & Tampilkan di Landing Page
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    'Simpan Produk'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
