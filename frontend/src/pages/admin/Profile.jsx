import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Store, Phone, Mail, MapPin, Clock, Globe, Send, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [showWhatsAppOrder, setShowWhatsAppOrder] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await api.getBusiness();
      setName(data.name || '');
      setCategory(data.category || '');
      setDescription(data.description || '');
      setAddress(data.address || '');
      setGoogleMapsUrl(data.googleMapsUrl || '');
      setWhatsappNumber(data.whatsappNumber || '');
      setEmail(data.email || '');
      setLogo(data.logo || '');
      setOpenHours(data.openHours || '');
      setInstagram(data.instagram || '');
      setTiktok(data.tiktok || '');
      setFacebook(data.facebook || '');
      setWhatsappTemplate(data.whatsappTemplate || '');
      setShowWhatsAppOrder(data.showWhatsAppOrder !== undefined ? data.showWhatsAppOrder : true);
    } catch (err) {
      setError(err.message || 'Gagal memuat profil bisnis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Basic WhatsApp validation: numbers only
    let formattedWA = whatsappNumber.replace(/[^0-9]/g, '');
    if (formattedWA.startsWith('08')) {
      formattedWA = '628' + formattedWA.slice(2);
    }

    try {
      await api.updateBusiness({
        name,
        category,
        description,
        address,
        googleMapsUrl,
        whatsappNumber: formattedWA,
        email,
        logo,
        openHours,
        instagram,
        tiktok,
        facebook,
        whatsappTemplate,
        showWhatsAppOrder,
      });
      setSuccess('Profil bisnis Anda berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui profil bisnis.');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Profil Bisnis</h1>
        <p className="text-slate-400 text-sm mt-1">Atur informasi utama bisnis, detail kontak, logo dan media sosial</p>
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

      {/* Profile Form Card */}
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-md font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <Store className="w-4 h-4 text-brand-500" /> Informasi Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Business Name */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Bisnis / Toko</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Kategori Bisnis</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Deskripsi Bisnis</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tulis ringkasan mengenai toko atau layanan Anda..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
          ></textarea>
        </div>

        <h2 className="text-md font-bold text-white uppercase tracking-wider border-b border-slate-800 pt-4 pb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-500" /> Kontak & Jam Operasional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* WhatsApp */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">No. WhatsApp</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 text-sm font-semibold select-none">
                WA
              </span>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="62812345678"
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Bisnis</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* Open Hours */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Jam Operasional</label>
            <input
              type="text"
              value={openHours}
              onChange={(e) => setOpenHours(e.target.value)}
              placeholder="Contoh: 08:00 - 21:00"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <ImageUploader
              value={logo}
              onChange={setLogo}
              label="Logo Bisnis"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        {/* Toggle WhatsApp Order Button */}
        <div className="p-5 rounded-2xl bg-slate-950/20 border border-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-slate-800">
          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <label className="block text-white text-xs font-bold uppercase tracking-wider">Tombol Pemesanan WhatsApp</label>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                showWhatsAppOrder 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${showWhatsAppOrder ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                {showWhatsAppOrder ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-xl">
              Tampilkan tombol "Pesan via WhatsApp" di detail katalog produk pada halaman landing publik. Nonaktifkan jika Anda hanya ingin memamerkan produk saja (katalog/menu pasif).
            </p>
          </div>
          
          {/* Switch Toggle Container */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-950/40 p-2.5 px-4 rounded-xl border border-slate-900/60 self-start sm:self-center">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider transition-colors duration-200 select-none ${
              showWhatsAppOrder ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {showWhatsAppOrder ? 'Tombol Aktif' : 'Tombol Nonaktif'}
            </span>
            
            <button
              type="button"
              onClick={() => setShowWhatsAppOrder(!showWhatsAppOrder)}
              className={`relative inline-flex h-6.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showWhatsAppOrder ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showWhatsAppOrder ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* WhatsApp Template Customizer */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">Template Pesan Pemesanan WhatsApp</label>
            <span className="text-[10px] text-slate-500 font-bold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">OPSIONAL</span>
          </div>
          <textarea
            rows="3"
            value={whatsappTemplate}
            onChange={(e) => setWhatsappTemplate(e.target.value)}
            placeholder='Contoh: Halo {nama_toko}, saya tertarik pesan "{nama_produk}" seharga {harga_produk}. Apakah ready?'
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
          ></textarea>
          
          {/* Guide Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-[10px] text-slate-400">
            <div className="space-y-1">
              <span className="font-bold text-slate-300 block uppercase tracking-wider">Gunakan Placeholder Pintar:</span>
              <p className="leading-relaxed">Sistem akan otomatis mengganti kode berikut dengan data riil produk saat diklik oleh pembeli.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-slate-200 font-mono shrink-0">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-850"><code className="text-brand-400">{`{nama_toko}`}</code> : Nama Toko</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-850"><code className="text-brand-400">{`{nama_produk}`}</code> : Nama Produk</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-850"><code className="text-brand-400">{`{harga_produk}`}</code> : Harga Produk</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Alamat Toko</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jl. Senopati No. 12, Jakarta Selatan"
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
          />
        </div>

        {/* Google Maps Embed Link */}
        <div>
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Link Google Maps Embed (iframe src)</label>
          <input
            type="text"
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="Contoh: https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">Cara mendapatkan: Cari lokasi Anda di Google Maps &rarr; Bagikan &rarr; Sematkan Peta &rarr; Copy isi link di dalam tanda kutip <code>src="..."</code>.</span>
        </div>

        <h2 className="text-md font-bold text-white uppercase tracking-wider border-b border-slate-800 pt-4 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-violet-500" /> Tautan Media Sosial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Instagram */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Link Instagram</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/toko"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* TikTok */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Link TikTok</label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/@toko"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Link Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/toko"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>
        </div>

        {/* Action Button */}
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
                Simpan Profil Bisnis
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
