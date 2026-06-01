import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Briefcase, Store, Loader2, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Coffee Shop');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Coffee Shop',
    'Laundry Shop',
    'Jasa Travel',
    'Bengkel Motor/Mobil',
    'Clothing Brand',
    'Klinik Kesehatan',
    'Perumahan / Real Estate',
    'Lainnya',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !businessName || !category || !whatsappNumber) {
      setError('Harap isi semua kolom input.');
      return;
    }

    // Format WhatsApp Number to ensure it starts with 62
    let formattedWA = whatsappNumber.trim().replace(/[^0-9]/g, '');
    if (formattedWA.startsWith('08')) {
      formattedWA = '628' + formattedWA.slice(2);
    } else if (formattedWA.startsWith('8')) {
      formattedWA = '628' + formattedWA.slice(1);
    }

    setLoading(true);
    try {
      const data = await register({
        name,
        email,
        password,
        businessName,
        category,
        whatsappNumber: formattedWA,
      });

      setSuccess(data.message || 'Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10 py-6">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 items-center justify-center font-extrabold text-2xl text-white shadow-xl shadow-brand-500/25 mb-4 select-none">
            L
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Buat Akun UMKM</h1>
          <p className="text-slate-400 text-sm mt-1.5">Miliki Landing Page profesional dalam hitungan menit</p>
        </div>

        {/* Card Panel */}
        <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl relative">
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner Fullname */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="name">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Owner Email */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="budi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="whatsapp">
                  No. WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="business">
                  Nama Bisnis / Toko
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Store className="w-4 h-4" />
                  </span>
                  <input
                    id="business"
                    type="text"
                    required
                    placeholder="Kopi Senja"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="category">
                  Kategori Bisnis
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 focus:border-brand-500/80 text-sm text-slate-200 outline-none transition cursor-pointer appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/20 hover:shadow-brand-500/25 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Redirection */}
          <div className="text-center mt-6 pt-5 border-t border-slate-800/50">
            <p className="text-slate-400 text-xs font-medium">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition">
                Masuk Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
