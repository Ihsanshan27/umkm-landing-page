import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { Upload, Link, X, Loader2, CheckCircle, ImageIcon } from 'lucide-react';

/**
 * ImageUploader - Komponen reusable untuk upload gambar atau input URL.
 * 
 * Props:
 *   value       : string  – URL gambar saat ini (state dari parent)
 *   onChange    : fn      – dipanggil dengan URL baru (string) setelah upload/input
 *   label       : string  – label judul field (opsional)
 *   placeholder : string  – placeholder input URL (opsional)
 */
export default function ImageUploader({ value, onChange, label = 'Gambar', placeholder = 'https://...' }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploadError('');
    setUploadSuccess('');
    setUploading(true);
    try {
      const result = await api.uploadImage(file);
      onChange(result.url);
      setUploadSuccess(`Berhasil diunggah: ${result.originalname}`);
      setTimeout(() => setUploadSuccess(''), 4000);
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange('');
    setUploadSuccess('');
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Tab Toggle: Upload vs URL */}
      <div className="flex rounded-xl bg-slate-950/60 border border-slate-800 p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'upload'
              ? 'bg-brand-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'url'
              ? 'bg-brand-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          URL Gambar
        </button>
      </div>

      {/* Mode: Upload File */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-slate-700 bg-slate-950/40 hover:border-brand-600/60 hover:bg-slate-900/40'
          } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileInput}
          />

          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Mengunggah gambar...</p>
            </>
          ) : value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-40 object-contain rounded-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p className="text-[10px] text-slate-500">Klik atau drag untuk ganti gambar</p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-300">
                  Klik atau drag & drop gambar di sini
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  JPG, PNG, WebP, GIF — Maks. 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mode: URL Input */}
      {mode === 'url' && (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
        />
      )}

      {/* Status messages */}
      {uploadSuccess && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}
      {uploadError && (
        <p className="text-rose-400 text-xs">{uploadError}</p>
      )}

      {/* Preview URL + Clear button (tampil di kedua mode jika ada value) */}
      {value && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <img
            src={value}
            alt="preview"
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <p className="text-[10px] text-slate-400 flex-1 truncate">{value}</p>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition shrink-0"
            title="Hapus gambar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
