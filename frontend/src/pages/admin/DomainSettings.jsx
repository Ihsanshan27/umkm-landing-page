import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Globe, AlertCircle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function DomainSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [domainInfo, setDomainInfo] = useState(null);
  const [customDomain, setCustomDomain] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDomain = async () => {
    try {
      const data = await api.getDomain();
      setDomainInfo(data);
      if (data) {
        setCustomDomain(data.customDomain || '');
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat pengaturan domain kustom.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomain();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Basic domain validation
    const cleanDomain = customDomain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanDomain.includes('.')) {
      setError('Format domain tidak valid. Contoh: kopisenja.com');
      setSaving(false);
      return;
    }

    try {
      const updated = await api.updateDomain({ customDomain: cleanDomain });
      setDomainInfo(updated);
      setSuccess('Pengaturan domain kustom berhasil disimpan! Pengajuan akan ditinjau oleh tim teknis.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pengaturan domain.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBanner = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-3">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">Domain Kustom Aktif</h4>
              <p className="leading-relaxed text-slate-400">
                Selamat! Domain kustom Anda <strong>{domainInfo?.customDomain}</strong> sudah aktif dan sepenuhnya terhubung ke landing page Anda.
              </p>
            </div>
          </div>
        );
      case 'FAILED':
        return (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">Konfigurasi DNS Gagal</h4>
              <p className="leading-relaxed text-slate-400">
                Penyambungan domain gagal. Pastikan Anda telah mengarahkan CNAME record DNS domain Anda ke server kami: <strong>cname.umkmbuilder.com</strong>.
              </p>
            </div>
          </div>
        );
      case 'PENDING':
      default:
        return (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-start gap-3">
            <RefreshCw className="w-5 h-5 shrink-0 text-blue-500 animate-spin mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">Menunggu Verifikasi Tim Teknis</h4>
              <p className="leading-relaxed text-slate-400">
                Domain <strong>{domainInfo?.customDomain}</strong> sedang ditinjau. Proses propagasi dan verifikasi DNS memerlukan waktu maksimal 24 jam.
              </p>
            </div>
          </div>
        );
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Domain Kustom (Custom Domain)</h1>
        <p className="text-slate-400 text-sm mt-1">Sambungkan domain pribadi Anda (misal: www.kopisenja.com) agar landing page terlihat lebih profesional</p>
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

      {/* Domain Status Banner */}
      {domainInfo && domainInfo.customDomain && getStatusBanner(domainInfo.status)}

      {/* Domain Form Card */}
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-md font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-4.5 h-4.5 text-brand-500" /> Atur Domain Pribadi
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Alamat Domain Kustom</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 text-sm select-none">
                https://
              </span>
              <input
                type="text"
                required
                placeholder="kopisenja.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full pl-16 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 border border-slate-800/60 rounded-2xl text-[11px] text-slate-400 leading-relaxed space-y-2">
            <span className="font-bold text-white uppercase tracking-wider text-[9px] block">Instruksi Konfigurasi DNS:</span>
            <p>
              Agar domain kustom Anda dapat terhubung, silakan masuk ke dashboard provider domain Anda (misal: Niagahoster, Domainesia, Rumahweb) dan tambahkan catatan DNS berikut:
            </p>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/40 text-[10px]">
              <div>
                <span className="text-slate-500 font-semibold block uppercase">TIPE</span>
                <span className="font-bold text-white">CNAME</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">NAMA / HOST</span>
                <span className="font-bold text-white">@ atau www</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">NILAI / VALUE</span>
                <span className="font-bold text-white truncate block">cname.umkmbuilder.com</span>
              </div>
            </div>
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
                Hubungkan Domain
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
