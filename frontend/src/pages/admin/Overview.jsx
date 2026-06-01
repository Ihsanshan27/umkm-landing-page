import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Eye, Users, Percent, Coffee, ArrowUpRight, Plus, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deteksi sesi co-management untuk menentukan base path
  const isCoManage = !!localStorage.getItem('coManageLandingPageId');
  const basePath = isCoManage ? '/co-manage' : '/dashboard';

  const fetchStats = async () => {
    try {
      const data = await api.getAnalytics();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat statistik dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Kunjungan Halaman',
      value: stats?.totalViews || 0,
      icon: Eye,
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
    },
    {
      title: 'Total Form Leads Masuk',
      value: stats?.totalLeads || 0,
      icon: Users,
      gradient: 'from-brand-600 to-emerald-600',
      shadow: 'shadow-brand-500/10',
    },
    {
      title: 'Tingkat Konversi Lead',
      value: `${stats?.conversionRate || 0}%`,
      icon: Percent,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
    },
    {
      title: 'Produk/Layanan Aktif',
      value: stats?.activeProducts || 0,
      icon: Coffee,
      gradient: 'from-violet-600 to-fuchsia-600',
      shadow: 'shadow-violet-500/10',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ringkasan Bisnis</h1>
        <p className="text-slate-400 text-sm mt-1">Pantau perkembangan pengunjung dan calon pelanggan potensial Anda secara real-time</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl ${card.shadow} flex flex-col relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300`}
            >
              {/* Card background glowing effect on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-slate-800/20 blur-2xl group-hover:bg-brand-500/5 transition-all duration-300"></div>

              <div className="flex justify-between items-start mb-4">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Launchpad Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shortcut Column 1 */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight">Langkah Cepat & Kustomisasi</h2>
            <span className="text-slate-500 text-xs font-semibold">TIPS PRO</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`${basePath}/landing-page`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 text-left transition-all duration-300 group flex items-start gap-3.5"
            >
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">Edit Tampilan Halaman</h3>
                <p className="text-xs text-slate-400 mt-1">Ubah judul hero, deskripsi bisnis, gambar utama, dan tombol.</p>
              </div>
            </Link>

            <Link
              to={`${basePath}/products`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 text-left transition-all duration-300 group flex items-start gap-3.5"
            >
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Tambah Menu / Jasa</h3>
                <p className="text-xs text-slate-400 mt-1">Tambahkan produk, daftar harga, dan katalog layanan unggulan.</p>
              </div>
            </Link>

            <Link
              to={`${basePath}/leads`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 text-left transition-all duration-300 group flex items-start gap-3.5"
            >
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Periksa Form Leads</h3>
                <p className="text-xs text-slate-400 mt-1">Lihat calon pembeli yang mengirimkan formulir kontak landing page.</p>
              </div>
            </Link>

            <Link
              to={`${basePath}/seo`}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 text-left transition-all duration-300 group flex items-start gap-3.5"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Optimalkan Pencarian SEO</h3>
                <p className="text-xs text-slate-400 mt-1">Atur meta title, meta keywords dan deskripsi Google.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Column 2 */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">Kinerja Tingkat Konversi</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tingkat konversi (Conversion Rate) mengukur persentase pengunjung yang mengisi form leads dari total pengunjung landing page Anda. 
            </p>
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 flex items-center gap-3">
              <Percent className="w-8 h-8 text-brand-500 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 font-medium">Platform Rata-rata</span>
                <p className="text-sm font-bold text-white">Target konversi ideal: 5% - 15%</p>
              </div>
            </div>
          </div>

          <Link
            to={`${basePath}/leads`}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
          >
            Lihat Laporan Pelanggan
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
