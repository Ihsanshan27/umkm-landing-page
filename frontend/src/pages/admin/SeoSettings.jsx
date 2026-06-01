import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Search, Loader2 } from 'lucide-react';

export default function SeoSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');

  const fetchSeo = async () => {
    try {
      const data = await api.getSeo();
      if (data) {
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setMetaKeywords(data.metaKeywords || '');
        setOgImage(data.ogImage || '');
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat pengaturan SEO.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.updateSeo({
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
      });
      setSuccess('Pengaturan SEO berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui SEO.');
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pengaturan SEO (Google Search)</h1>
        <p className="text-slate-400 text-sm mt-1">Ubah kata kunci pencarian, judul penelusuran, dan preview media sosial untuk bisnis Anda</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold animate-pulse">
          {success}
        </div>
      )}

      {/* SEO Form */}
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-md font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <Search className="w-4.5 h-4.5 text-brand-500" /> Meta Tags Google
        </h2>

        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Meta Title (Judul Halaman)</label>
            <input
              type="text"
              placeholder="Contoh: Kopi Senja - Coffee Shop & Roastery Terbaik Jakarta Selatan"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Rekomendasi panjang: 50 - 60 karakter agar tampil optimal di hasil pencarian.</span>
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Meta Keywords (Kata Kunci Pencarian)</label>
            <input
              type="text"
              placeholder="Contoh: coffee shop jakarta, kopi gula aren, cafe nyaman senopati"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Pisahkan setiap kata kunci menggunakan tanda koma (,).</span>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Meta Description (Deskripsi Pencarian)</label>
            <textarea
              rows="4"
              placeholder="Contoh: Nikmati sajian kopi susu aren khas Senja dan single origin berkualitas tinggi di daerah Senopati, Jakarta Selatan. Tempat asik untuk WFH..."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            ></textarea>
            <span className="text-[10px] text-slate-500 mt-1 block">Rekomendasi panjang: 120 - 160 karakter untuk memberikan ringkasan penelusuran.</span>
          </div>

          {/* Open Graph Image */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Link Foto Review Medsos (Open Graph Image)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Foto ini akan otomatis muncul sebagai preview ketika link landing page Anda dibagikan ke WhatsApp, Telegram, atau Facebook.</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/20 hover:shadow-brand-500/25 transition-all flex items-center gap-2 group disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Simpan Konfigurasi SEO
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
