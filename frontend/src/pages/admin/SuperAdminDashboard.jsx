import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Users,
  FileText,
  Eye,
  ShieldAlert,
  Percent,
  Loader2,
  Ban,
  CheckCircle,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Globe,
  MessageSquare,
  Building,
  Mail,
  Phone,
  UserCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const location = useLocation();
  
  const handleStartCoManagement = (page) => {
    localStorage.setItem('coManageLandingPageId', page.id);
    localStorage.setItem('coManageBusinessName', page.business?.name || 'Toko');
    localStorage.setItem('coManageSlug', page.slug);
    window.location.href = '/co-manage';
  };

  const [platformStats, setPlatformStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [landingPages, setLandingPages] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const stats = await api.getPlatformStats();
      setPlatformStats(stats);

      const usersList = await api.getUsers();
      setUsers(usersList);

      const pagesList = await api.getAllLandingPages();
      setLandingPages(pagesList);

      const leadsList = await api.getAllLeads();
      setAllLeads(leadsList);
    } catch (err) {
      setError(err.message || 'Gagal memuat data Super Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (user) => {
    setError('');
    setUpdatingId(user.id);
    const nextStatus = !user.isActive;
    try {
      await api.toggleUserStatus(user.id, nextStatus);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u)));
      setSuccess(`Status user ${user.name} berhasil diubah!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah status keaktifan user.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENGHAPUS user "${user.name}" beserta seluruh data bisnis, produk, dan landing page miliknya? Tindakan ini permanen!`)) return;
    setError('');
    try {
      await api.deleteUser(user.id);
      setUsers(users.filter((u) => u.id !== user.id));
      
      // Refresh global stats after deletion
      const updatedStats = await api.getPlatformStats();
      setPlatformStats(updatedStats);

      const pagesList = await api.getAllLandingPages();
      setLandingPages(pagesList);

      setSuccess(`User ${user.name} beserta seluruh data bisnisnya berhasil dihapus.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus user.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Pemilik UMKM',
      value: platformStats?.totalOwners || 0,
      icon: Users,
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Landing Page Terdaftar',
      value: platformStats?.totalLandingPages || 0,
      icon: FileText,
      gradient: 'from-brand-600 to-emerald-600',
    },
    {
      title: 'Total Viewers Platform',
      value: platformStats?.totalViews || 0,
      icon: Eye,
      gradient: 'from-violet-600 to-fuchsia-600',
    },
    {
      title: 'Konsumen Terkumpul (Leads)',
      value: platformStats?.totalLeads || 0,
      icon: ShieldAlert,
      gradient: 'from-rose-600 to-orange-600',
    },
    {
      title: 'Rata-rata Konversi Platform',
      value: `${platformStats?.averageConversionRate || 0}%`,
      icon: Percent,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  // Helper to render sections depending on the path
  const renderContent = () => {
    switch (location.pathname) {
      case '/admin/users':
        return (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Kelola Akun Pemilik UMKM ({users.length})</h2>
              <p className="text-xs text-slate-400 mt-1">Mengaktifkan/menonaktifkan akun owner atau menghapus database user beserta seluruh datanya</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Identitas Pengguna</th>
                    <th className="py-4 px-6">Informasi Bisnis</th>
                    <th className="py-4 px-6">Domain & Link</th>
                    <th className="py-4 px-6">Status Akun</th>
                    <th className="py-4 px-6 text-center">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-white leading-none text-sm">{item.name}</div>
                        <span className="text-[10px] text-slate-500 font-medium">{item.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-200">{item.business?.name || 'BELUM DIISI'}</div>
                        <span className="text-[10px] text-slate-500">{item.business?.category || '-'}</span>
                      </td>
                      <td className="py-4 px-6">
                        {item.business?.landingPage?.slug ? (
                          <a
                            href={`/site/${item.business.landingPage.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 w-fit"
                          >
                            /site/{item.business.landingPage.slug}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                            item.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {item.isActive ? 'Aktif (Normal)' : 'Dinonaktifkan'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={updatingId === item.id}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
                              item.isActive
                                ? 'bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white'
                                : 'bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white'
                            }`}
                          >
                            {item.isActive ? (
                              <>
                                <Ban className="w-3.5 h-3.5" /> Ban User
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" /> Unban
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(item)}
                            className="p-2 rounded-xl bg-slate-950/60 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                            title="Hapus Pengguna Selamanya"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '/admin/sites':
        return (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Daftar Landing Page Aktif ({landingPages.length})</h2>
              <p className="text-xs text-slate-400 mt-1">Daftar website satu halaman UMKM terdaftar serta jumlah views pengunjung masing-masing</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Nama Bisnis & Kategori</th>
                    <th className="py-4 px-6">Link Landing Page Publik</th>
                    <th className="py-4 px-6">Pemilik Akun</th>
                    <th className="py-4 px-6 text-center">Total Kunjungan (Views)</th>
                    <th className="py-4 px-6 text-center">Akses Bantuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                  {landingPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-white text-sm">{page.business?.name}</div>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{page.business?.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`/site/${page.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 w-fit"
                        >
                          /site/{page.slug}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="text-slate-200 font-semibold">{page.business?.user?.name}</div>
                        <div className="text-[10px] text-slate-500">@{page.business?.user?.email}</div>
                      </td>
                      <td className="py-4 px-6 text-center text-sm font-bold text-white">
                        {page.analytics ? page.analytics.views : 0} Views
                      </td>
                      <td className="py-4 px-6 text-center">
                        {page.allowAdminEdit ? (
                          <button
                            onClick={() => handleStartCoManagement(page)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-bold flex items-center gap-1 transition mx-auto"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Bantu Kelola
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 justify-center select-none">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '/admin/leads':
        return (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Database Leads Global ({allLeads.length})</h2>
              <p className="text-xs text-slate-400 mt-1">Pantau seluruh leads masuk dari formulir kontak di seluruh landing page UMKM terdaftar</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Asal Landing Page</th>
                    <th className="py-4 px-6">Identitas Konsumen</th>
                    <th className="py-4 px-6">Isi Pesan</th>
                    <th className="py-4 px-6">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                  {allLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-white leading-none text-sm">{lead.landingPage?.business?.name}</div>
                        <span className="text-[10px] text-slate-500 font-medium">/site/{lead.landingPage?.slug}</span>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="font-bold text-slate-200">{lead.name}</div>
                        <div className="text-[10px] text-slate-500">+{lead.whatsappNumber}</div>
                      </td>
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <p className="text-slate-300 leading-relaxed truncate">{lead.message}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {new Date(lead.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '/admin':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shortcuts area */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight">Selamat Datang, Super Admin</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform UMKM Landing Builder berjalan dalam kondisi optimal. Gunakan shortcut cepat di bawah ini untuk mengelola akun owner UMKM, meninjau statistik database, dan melihat konversi global.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Link
                  to="/admin/users"
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 transition text-left flex items-start gap-3.5 group"
                >
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Kelola Pengguna</h3>
                    <p className="text-xs text-slate-400 mt-1">Ban/unban akun pemilik toko atau hapus database secara permanen.</p>
                  </div>
                </Link>

                <Link
                  to="/admin/sites"
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-950 transition text-left flex items-start gap-3.5 group"
                >
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">Daftar Landing Page</h3>
                    <p className="text-xs text-slate-400 mt-1">Tinjau seluruh link aktif beserta total kunjungan masing-masing.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Platform Health card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white tracking-tight">Kesehatan Platform SaaS</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Semua Sistem Berjalan Normal</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  PostgreSQL database terhubung via port custom 5433, server NestJS berjalan optimal di port 3000, dan SPA React front-end berjalan stabil.
                </p>
              </div>

              <Link
                to="/admin/leads"
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
              >
                Lihat Leads Platform Global
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Super Admin Platform Control</h1>
        <p className="text-slate-400 text-sm mt-1">Mengawasi kesehatan platform SaaS, memantau total kunjungan, dan kelola akun pemilik UMKM</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${card.gradient} text-white shadow-lg`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Path-based sub-panels */}
      {renderContent()}
    </div>
  );
}
