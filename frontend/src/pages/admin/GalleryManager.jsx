import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, Loader2, X, ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const data = await api.getGallery();
      setGallery(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat galeri gambar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setImageUrl('');
    setCaption('');
    setError('');
    setModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Harap masukkan tautan gambar.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const created = await api.createGalleryItem({ imageUrl, caption });
      setGallery([created, ...gallery]);
      setSuccess('Gambar galeri baru berhasil ditambahkan!');
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan gambar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar ini dari galeri publik?')) return;
    setError('');
    try {
      await api.deleteGalleryItem(id);
      setGallery(gallery.filter((g) => g.id !== id));
      setSuccess('Gambar berhasil dihapus dari galeri.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus gambar.');
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Galeri Dokumentasi</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola galeri dokumentasi foto, dokumentasi event, atau portofolio bisnis Anda</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" /> Tambah Foto
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
      {gallery.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-slate-800/80 max-w-md mx-auto">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white tracking-tight">Galeri Masih Kosong</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Belum ada dokumentasi foto yang diunggah. Tambahkan foto suasana toko, foto menu, atau kepuasan klien untuk meyakinkan pengunjung landing page!
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Mulai Unggah Foto
          </button>
        </div>
      ) : (
        /* Gallery Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="glass rounded-3xl overflow-hidden border border-slate-800/80 group hover:border-slate-700 transition duration-300 relative flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.caption || 'Foto Galeri'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Delete overlay button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white transition shadow-lg opacity-0 group-hover:opacity-100 duration-200"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Caption details */}
              {item.caption && (
                <div className="p-4 bg-slate-900/40">
                  <p className="text-slate-300 text-xs font-medium leading-relaxed truncate">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Image Modal */}
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
              Unggah Foto Galeri Baru
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Foto Galeri */}
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Foto Galeri"
                placeholder="https://images.unsplash.com/..."
              />

              {/* Caption */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Keterangan Foto (Caption, opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Suasana grand opening kami yang meriah"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                />
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
                  className="flex-1 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    'Unggah Gambar'
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
