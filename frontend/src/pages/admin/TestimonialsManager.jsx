import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, Star, MessageSquare, Loader2, X } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat testimoni pelanggan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setName('');
    setContent('');
    setAvatarUrl('');
    setRating(5);
    setError('');
    setModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !content) {
      setError('Harap lengkapi nama customer dan isi testimoni.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const created = await api.createTestimonial({ name, content, avatarUrl, rating: parseInt(rating) });
      setTestimonials([created, ...testimonials]);
      setSuccess('Testimoni baru berhasil ditambahkan!');
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan testimoni.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus testimoni customer ini dari public landing page?')) return;
    setError('');
    try {
      await api.deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setSuccess('Testimoni berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus testimoni.');
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Testimoni Customer</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola ulasan pembeli, ulasan kepuasan klien, rating bintang, dan feedback pelanggan</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" /> Tambah Ulasan
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
      {testimonials.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-slate-800/80 max-w-md mx-auto">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white tracking-tight">Belum Ada Testimoni</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Landing page Anda belum memiliki feedback ulasan dari customer. Tambahkan testimoni kepuasan pelanggan pertama Anda untuk meningkatkan kepercayaan calon pembeli baru!
          </p>
          <button
            onClick={openAddModal}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Mulai Tambah Testimoni
          </button>
        </div>
      ) : (
        /* Testimonials Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="glass rounded-3xl p-6 border border-slate-800/80 hover:border-slate-700 transition duration-300 flex flex-col justify-between relative group"
            >
              {/* Delete Button on Hover */}
              <button
                onClick={() => handleDelete(test.id)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white transition opacity-0 group-hover:opacity-100 duration-200"
                title="Hapus Testimoni"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (test.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Content review */}
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  "{test.content}"
                </p>
              </div>

              {/* Customer Info profile */}
              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-800/50">
                {test.avatarUrl ? (
                  <img
                    src={test.avatarUrl}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-800"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-400 font-bold flex items-center justify-center text-xs select-none">
                    {test.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{test.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">Pelanggan Terverifikasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
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
              Tambah Ulasan Pelanggan Baru
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  placeholder="Rian Dwi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Penilaian (Bintang)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition cursor-pointer appearance-none"
                >
                  <option value={5} className="bg-slate-900 text-slate-200">5 Bintang (Luar Biasa)</option>
                  <option value={4} className="bg-slate-900 text-slate-200">4 Bintang (Sangat Bagus)</option>
                  <option value={3} className="bg-slate-900 text-slate-200">3 Bintang (Cukup Bagus)</option>
                  <option value={2} className="bg-slate-900 text-slate-200">2 Bintang (Kurang)</option>
                  <option value={1} className="bg-slate-900 text-slate-200">1 Bintang (Sangat Kurang)</option>
                </select>
              </div>

              {/* Avatar Foto Pelanggan */}
              <ImageUploader
                value={avatarUrl}
                onChange={setAvatarUrl}
                label="Foto Avatar Pelanggan (Opsional)"
                placeholder="https://images.unsplash.com/..."
              />

              {/* Testimonial Content */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Ulasan / Isi Testimoni</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan pengalaman menyenangkan customer saat menikmati sajian atau layanan jasa Anda..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
                ></textarea>
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
                    'Simpan Testimoni'
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
