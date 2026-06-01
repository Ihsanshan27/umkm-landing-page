import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Phone, Trash2, CheckCircle2, MessageSquare, Loader2, RefreshCw, Send, Download } from 'lucide-react';

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Searching & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      const leadsData = await api.getMyLeads();
      setLeads(leadsData);
      
      const bizData = await api.getBusiness();
      setBusinessName(bizData.name || 'toko kami');
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar leads masuk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setError('');
    setUpdatingId(id);
    try {
      const updated = await api.updateLeadStatus(id, status);
      setLeads(leads.map((l) => (l.id === id ? updated : l)));
      setSuccess('Status lead berhasil diubah!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah status lead.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data lead ini secara permanen?')) return;
    setError('');
    try {
      await api.deleteLead(id);
      setLeads(leads.filter((l) => l.id !== id));
      setSuccess('Data lead berhasil dihapus.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus lead.');
    }
  };

  const handleWhatsAppRedirect = (lead) => {
    const formattedWA = lead.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo ${lead.name}, terima kasih telah menghubungi ${businessName}. Kami menerima pesan Anda: "${lead.message}". Bagaimana kami bisa membantu Anda hari ini?`
    );
    window.open(`https://wa.me/${formattedWA}?text=${message}`, '_blank');
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Nama', 'WhatsApp', 'Email', 'Pesan', 'Status', 'Tanggal'];
      const rows = filteredLeads.map((l) => [
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.whatsappNumber}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${l.message.replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${new Date(l.createdAt).toLocaleDateString('id-ID')}"`
      ]);
      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${businessName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Leads berhasil diekspor ke CSV!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal mengekspor data ke CSV.');
    }
  };

  // Filter & Search Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsappNumber.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'CONTACTED':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'CONVERTED':
        return 'bg-brand-500/10 text-brand-400 border border-brand-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const filterTabs = [
    { label: 'Semua Leads', value: 'ALL' },
    { label: 'Baru (New)', value: 'NEW' },
    { label: 'Dihubungi', value: 'CONTACTED' },
    { label: 'Deal (Converted)', value: 'CONVERTED' },
    { label: 'Ditolak', value: 'REJECTED' },
  ];

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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Form Leads & Konsumen</h1>
          <p className="text-slate-400 text-sm mt-1">Daftar calon konsumen yang tertarik dan mengisi formulir kontak di landing page Anda</p>
        </div>
        {filteredLeads.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Ekspor ke CSV
          </button>
        )}
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

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5 no-scrollbar overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                statusFilter === tab.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama, no. WA, pesan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Leads Table Card */}
      {filteredLeads.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-slate-800/80 max-w-md mx-auto">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white tracking-tight">Leads Tidak Ditemukan</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Tidak ada calon konsumen yang mengisi formulir kontak untuk filter pencarian ini. Bagikan link landing page Anda ke pelanggan potensial!
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800/80 shadow-xl rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Informasi Kontak</th>
                  <th className="py-4 px-6">Isi Pesan Konsumen</th>
                  <th className="py-4 px-6">Status Lead</th>
                  <th className="py-4 px-6 text-center">Aksi Hubungi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                    {/* User profile info */}
                    <td className="py-4 px-6 space-y-1.5 max-w-[200px]">
                      <div className="font-bold text-white leading-none text-sm">{lead.name}</div>
                      <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" /> +{lead.whatsappNumber}
                        </span>
                        {lead.email && <span className="truncate">@{lead.email}</span>}
                      </div>
                    </td>

                    {/* Message details */}
                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {lead.message}
                      </p>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mt-2">
                        Masuk: {new Date(lead.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Status badges & update selector */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide w-fit ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>

                        <select
                          disabled={updatingId === lead.id}
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] text-slate-400 outline-none focus:border-brand-500 cursor-pointer appearance-none"
                        >
                          <option value="NEW">Set Baru (New)</option>
                          <option value="CONTACTED">Set Dihubungi</option>
                          <option value="CONVERTED">Set Deal (Converted)</option>
                          <option value="REJECTED">Set Ditolak</option>
                        </select>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleWhatsAppRedirect(lead)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[11px] font-bold shadow-lg shadow-emerald-500/5 transition duration-200 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Chat WA
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 rounded-xl bg-slate-950/60 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                          title="Hapus Lead"
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
      )}
    </div>
  );
}
