import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, FileImage, Type, HelpCircle, Loader2, ShieldCheck, Navigation, Plus, Trash2, GripVertical, Rows3, RotateCcw } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

export default function LandingPageEditor() {
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Brand Theme color state
  const [themeColor, setThemeColor] = useState('EMERALD');
  const [allowAdminEdit, setAllowAdminEdit] = useState(false);
  const [customColor, setCustomColor] = useState('#10b981');

  // Custom Nav state
  const [customNavItems, setCustomNavItems] = useState([]);
  const [savingNav, setSavingNav] = useState(false);

  // Catalog Layout (rows) state
  const [catalogLayout, setCatalogLayout] = useState(1);
  const [savingLayout, setSavingLayout] = useState(false);

  // Custom Sections state
  const [customSections, setCustomSections] = useState([]);
  const [savingSection, setSavingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null); // null if creating
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [sectionImageUrl, setSectionImageUrl] = useState('');
  const [sectionAnchorId, setSectionAnchorId] = useState('');

  const handleToggleConsent = async (checked) => {
    setError('');
    setSuccess('');
    try {
      await api.toggleAdminConsent(checked);
      setAllowAdminEdit(checked);
      setSuccess(
        checked
          ? 'Izin kelola admin berhasil diaktifkan. Tim admin sekarang dapat membantu Anda.'
          : 'Izin kelola admin berhasil dicabut. Tim admin tidak lagi memiliki akses edit.'
      );
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah persetujuan admin.');
    }
  };

  // Hero section form states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('Hubungi Kami');
  const [heroCtaLink, setHeroCtaLink] = useState('');

  // About section form states
  const [aboutTitle, setAboutTitle] = useState('Tentang Kami');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutImageUrl, setAboutImageUrl] = useState('');

  const fetchSections = async () => {
    try {
      const data = await api.getMyLandingPage();
      
      setThemeColor(data.themeColor || 'EMERALD');
      setAllowAdminEdit(data.allowAdminEdit || false);
      if (data.themeColor && data.themeColor.startsWith('#')) {
        setCustomColor(data.themeColor);
      }

      if (data.heroSection) {
        setHeroTitle(data.heroSection.title || '');
        setHeroSubtitle(data.heroSection.subtitle || '');
        setHeroImageUrl(data.heroSection.imageUrl || '');
        setHeroCtaText(data.heroSection.ctaText || 'Hubungi Kami');
        setHeroCtaLink(data.heroSection.ctaLink || '');
      }

      if (data.aboutSection) {
        setAboutTitle(data.aboutSection.title || 'Tentang Kami');
        setAboutDescription(data.aboutSection.description || '');
        setAboutImageUrl(data.aboutSection.imageUrl || '');
      }

      // Custom Nav
      setCustomNavItems(Array.isArray(data.customNavItems) ? data.customNavItems : []);
      // Catalog Layout
      setCatalogLayout(data.catalogLayout || 1);
      // Custom Sections
      setCustomSections(Array.isArray(data.customSections) ? data.customSections : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat konten landing page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingHero(true);
    try {
      await api.updateHero({
        title: heroTitle,
        subtitle: heroSubtitle,
        imageUrl: heroImageUrl,
        ctaText: heroCtaText,
        ctaLink: heroCtaLink || null, // null defaults to WhatsApp
      });
      setSuccess('Konten Hero Section berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui Hero Section.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingAbout(true);
    try {
      await api.updateAbout({
        title: aboutTitle,
        description: aboutDescription,
        imageUrl: aboutImageUrl,
      });
      setSuccess('Konten About Section berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui About Section.');
    } finally {
      setSavingAbout(false);
    }
  };

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingTheme(true);
    try {
      await api.updateTheme({ themeColor });
      setSuccess('Tema warna landing page berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui tema warna.');
    } finally {
      setSavingTheme(false);
    }
  };

  const handleResetNav = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua navigasi kustom dan kembali menggunakan navigasi otomatis bawaan?")) {
      setSavingNav(true);
      setError('');
      setSuccess('');
      try {
        await api.updateCustomNav([]);
        setCustomNavItems([]);
        setSuccess('Navigasi berhasil direset ke default otomatis!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Gagal meriset navigasi.');
      } finally {
        setSavingNav(false);
      }
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingSection(true);

    const payload = {
      title: sectionTitle,
      content: sectionContent,
      imageUrl: sectionImageUrl || null,
      sectionId: sectionAnchorId.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
    };

    try {
      if (editingSectionId) {
        await api.updateCustomSection(editingSectionId, payload);
        setSuccess('Seksi kustom berhasil diperbarui!');
      } else {
        await api.createCustomSection(payload);
        setSuccess('Seksi kustom berhasil ditambahkan!');
      }

      // Reset form states
      setEditingSectionId(null);
      setSectionTitle('');
      setSectionContent('');
      setSectionImageUrl('');
      setSectionAnchorId('');

      // Refresh list
      const data = await api.getMyLandingPage();
      setCustomSections(Array.isArray(data.customSections) ? data.customSections : []);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan seksi kustom.');
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seksi kustom ini?")) {
      setError('');
      setSuccess('');
      try {
        await api.deleteCustomSection(id);
        setSuccess('Seksi kustom berhasil dihapus!');
        
        // Refresh list
        const data = await api.getMyLandingPage();
        setCustomSections(Array.isArray(data.customSections) ? data.customSections : []);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Gagal menghapus seksi kustom.');
      }
    }
  };

  const handleEditSection = (section) => {
    setEditingSectionId(section.id);
    setSectionTitle(section.title);
    setSectionContent(section.content);
    setSectionImageUrl(section.imageUrl || '');
    setSectionAnchorId(section.sectionId);
    
    // Smooth scroll to section editor form
    const formElement = document.getElementById('custom-section-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConnectToNav = (anchorId, label) => {
    setError('');
    setSuccess('');
    
    // Check if already in custom nav list
    const exists = customNavItems.some(item => item.href === anchorId);
    if (exists) {
      setSuccess(`Menu navigasi untuk bagian "${label}" sudah terhubung!`);
      setTimeout(() => setSuccess(''), 3500);
      return;
    }

    // Add new nav item template copy to nav editor
    let newNavs = [...customNavItems];
    if (customNavItems.length === 0) {
      newNavs = [
        { label: 'Home', href: 'home', type: 'section' },
        { label: 'Tentang Kami', href: 'about', type: 'section' },
        { label: 'Katalog Produk', href: 'products', type: 'section' },
        { label: 'Galeri', href: 'gallery', type: 'section' },
        { label: 'Testimoni', href: 'testimonials', type: 'section' },
        { label: 'Kontak', href: 'contact', type: 'section' },
      ];
    }
    
    newNavs.push({ label, href: anchorId, type: 'section' });
    setCustomNavItems(newNavs);
    
    setSuccess(`Berhasil menyiapkan menu "${label}" di Navigasi Kustom! Silakan klik tombol "Simpan Navigasi" di bawah untuk mempublikasikannya.`);
    
    // Smooth scroll to dynamic nav builder
    const navElement = document.getElementById('custom-nav-builder');
    if (navElement) {
      navElement.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => setSuccess(''), 7000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Kustomisasi Halaman Landing</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola konten Hero Section dan Tentang Kami untuk menarik perhatian pelanggan</p>
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

      {/* Admin Consent Access Management Card */}
      {!localStorage.getItem('coManageLandingPageId') && (
        <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/5 space-y-4 transition-all duration-300 hover:border-slate-850">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Izin Akses Bantuan Administrator</h3>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                    allowAdminEdit 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${allowAdminEdit ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                    {allowAdminEdit ? 'Akses Terbuka' : 'Akses Terkunci'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Aktifkan fitur ini agar Administrator Platform dapat membantu mengelola/mengedit data produk, deskripsi profil, dan desain landing page Anda. Anda dapat mencabut izin ini secara instan kapan saja.
                </p>
              </div>
            </div>
            
            {/* Toggle Switch Container */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-950/40 p-2.5 px-4 rounded-xl border border-slate-900/60 self-start sm:self-center">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider transition-colors duration-200 select-none ${
                allowAdminEdit ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {allowAdminEdit ? 'Izin Diberikan' : 'Akses Terkunci'}
              </span>
              
              <button
                type="button"
                onClick={() => handleToggleConsent(!allowAdminEdit)}
                className={`relative inline-flex h-6.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowAdminEdit ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    allowAdminEdit ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Theme Preset Selection Form */}
      <form onSubmit={handleThemeSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 block"></span>
            Tema Warna Landing Page (Brand Presets)
          </h2>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">TEMA</span>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Pilih warna aksen identitas brand Anda. Warna ini akan otomatis diterapkan ke seluruh elemen tombol, link, floating widget, dan dekorasi pada landing page publik Anda.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { id: 'EMERALD', name: 'Emerald Green', bg: 'bg-emerald-500', border: 'border-emerald-500' },
              { id: 'BLUE', name: 'Ocean Blue', bg: 'bg-blue-500', border: 'border-blue-500' },
              { id: 'AMBER', name: 'Coffee Amber', bg: 'bg-amber-500', border: 'border-amber-500' },
              { id: 'VIOLET', name: 'Indigo Purple', bg: 'bg-violet-500', border: 'border-violet-500' },
              { id: 'ROSE', name: 'Rose Pink', bg: 'bg-rose-500', border: 'border-rose-500' },
              { id: 'TEAL', name: 'Teal Cyan', bg: 'bg-teal-500', border: 'border-teal-500' },
              { id: 'ORANGE', name: 'Sunset Orange', bg: 'bg-orange-500', border: 'border-orange-500' },
              { id: 'FUCHSIA', name: 'Fuchsia Magenta', bg: 'bg-fuchsia-500', border: 'border-fuchsia-500' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setThemeColor(preset.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-300 hover:scale-102 ${
                  themeColor === preset.id
                    ? `${preset.border} bg-slate-950 text-white shadow-lg shadow-slate-950/50`
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${preset.bg} block shrink-0`}></span>
                {preset.name}
              </button>
            ))}
          </div>

          {/* Custom Color Input Card */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="custom_color_radio"
                name="theme_selection"
                checked={themeColor.startsWith('#')}
                onChange={() => setThemeColor(customColor)}
                className="w-4 h-4 text-brand-600 bg-slate-950 border-slate-800 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <label htmlFor="custom_color_radio" className="text-xs font-bold text-slate-300 cursor-pointer">
                Pilih Warna Kustom Sendiri (Custom Brand Hex)
              </label>
            </div>
            
            {themeColor.startsWith('#') && (
              <div className="flex items-center gap-3.5 pl-6 animate-fade-in">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setThemeColor(e.target.value);
                  }}
                  className="w-10 h-10 p-0.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Kode Warna Hex</span>
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith('#')) val = '#' + val;
                      setCustomColor(val);
                      setThemeColor(val);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 focus:border-brand-500 text-xs text-slate-200 outline-none w-28 uppercase font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Theme */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingTheme}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {savingTheme ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Terapkan Tema Warna
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hero Section Form */}
      <form onSubmit={handleHeroSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4.5 h-4.5 text-brand-500" /> Bagian Hero (Utama)
          </h2>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">SECTION A</span>
        </div>

        <div className="space-y-4">
          {/* Hero Title */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Judul Utama Hero (Heading)</label>
            <input
              type="text"
              required
              placeholder="Contoh: Nikmati Secangkir Kopi Pilihan Terbaik"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* Hero Subtitle */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Sub-judul / Deskripsi Singkat</label>
            <textarea
              rows="3"
              placeholder="Tuliskan slogan menarik atau penjelasan singkat mengenai layanan utama Anda..."
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CTA Button Text */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Teks Tombol CTA</label>
              <input
                type="text"
                required
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
              />
            </div>

            {/* CTA Button Link */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">Tautan Tombol CTA</label>
                <div className="group relative">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-pointer" />
                  <div className="absolute right-0 bottom-full mb-1 w-52 p-2 rounded-lg bg-slate-950 text-[10px] text-slate-400 border border-slate-800 hidden group-hover:block z-30 shadow-lg">
                    Kosongkan kolom ini agar tombol otomatis mengarah ke chat WhatsApp Anda.
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Biarkan kosong untuk default WhatsApp"
                value={heroCtaLink}
                onChange={(e) => setHeroCtaLink(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
              />
            </div>
          </div>

          {/* Hero Image */}
          <ImageUploader
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            label="Foto Latar / Hero Image"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Submit Hero */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingHero}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {savingHero ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Simpan Hero Section
              </>
            )}
          </button>
        </div>
      </form>

      {/* About Section Form */}
      <form onSubmit={handleAboutSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileImage className="w-4.5 h-4.5 text-brand-500" /> Bagian Tentang Kami
          </h2>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">SECTION B</span>
        </div>

        <div className="space-y-4">
          {/* About Title */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Judul Bagian Tentang Kami</label>
            <input
              type="text"
              required
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            />
          </div>

          {/* About Description */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Cerita Toko / Deskripsi Bisnis Mendalam</label>
            <textarea
              rows="6"
              required
              placeholder="Tuliskan latar belakang toko, visi-misi, keunikan, serta komitmen Anda terhadap kualitas pelayanan..."
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            ></textarea>
          </div>

          {/* About Image URL */}
          <ImageUploader
            value={aboutImageUrl}
            onChange={setAboutImageUrl}
            label="Foto Pendukung About Section"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Submit About */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingAbout}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {savingAbout ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Simpan About Section
              </>
            )}
          </button>
        </div>
      </form>

      {/* ====== DYNAMIC CUSTOM SECTION BUILDER ====== */}
      <div id="custom-section-form" className="glass rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-[10px]">C</span>
            Seksi Halaman Kustom (Dynamic Section Builder)
          </h2>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">SEKSI BARU</span>
        </div>

        {/* Section Editor Form */}
        <form onSubmit={handleSectionSubmit} className="space-y-4 bg-slate-950/20 p-4 sm:p-6 rounded-2xl border border-slate-900">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {editingSectionId ? '⚡ Edit Seksi Kustom Halaman' : '➕ Tambah Seksi Kustom Baru'}
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Judul Seksi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Menu Spesial Kami / Fasilitas VIP"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
              />
            </div>

            {/* Anchor ID / Section URL Link */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                ID Bagian Tautan (Anchor ID)
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: vip / menu-spesial (huruf kecil & strip)"
                value={sectionAnchorId}
                onChange={(e) => setSectionAnchorId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition font-mono"
              />
              <span className="text-[9px] text-slate-500 mt-1 block">
                Digunakan sebagai ID target tautan navigasi (misal: mengarah ke <code>#{sectionAnchorId || 'id'}</code>).
              </span>
            </div>
          </div>

          {/* Section Content */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Isi Konten Seksi</label>
            <textarea
              rows="4"
              required
              placeholder="Tuliskan isi cerita, fasilitas, penawaran, atau syarat & ketentuan secara mendalam..."
              value={sectionContent}
              onChange={(e) => setSectionContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-brand-500 text-sm text-slate-200 outline-none transition"
            ></textarea>
          </div>

          {/* Section Support Image */}
          <div className="pt-2">
            <ImageUploader
              value={sectionImageUrl}
              onChange={setSectionImageUrl}
              label="Foto Pendukung Seksi (Opsional)"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {editingSectionId && (
              <button
                type="button"
                onClick={() => {
                  setEditingSectionId(null);
                  setSectionTitle('');
                  setSectionContent('');
                  setSectionImageUrl('');
                  setSectionAnchorId('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold transition"
              >
                Batal Edit
              </button>
            )}
            <button
              type="submit"
              disabled={savingSection}
              className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {savingSection ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4.5 h-4.5" />
                  {editingSectionId ? 'Simpan Perubahan' : 'Buat Seksi Kustom'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Custom Section Card List */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            Daftar Seksi Kustom Halaman Anda ({customSections.length})
          </span>
          
          {customSections.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-950/20 border border-slate-850/60 text-center py-8 text-slate-500 text-xs">
              Belum ada seksi halaman kustom. Silakan gunakan form di atas untuk membuat seksi konten kustom pertama Anda!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customSections.map((sec) => (
                <div key={sec.id} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 flex flex-col justify-between space-y-4 hover:border-slate-800 transition duration-300">
                  <div className="flex gap-3">
                    {sec.imageUrl && (
                      <img src={sec.imageUrl} alt={sec.title} className="w-14 h-14 rounded-xl object-cover border border-white/5 shrink-0" />
                    )}
                    <div className="space-y-1 text-left min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{sec.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{sec.content}</p>
                      <span className="inline-flex px-2 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-[9px] font-mono text-brand-400">
                        #{sec.sectionId}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-900 pt-3">
                    {/* Connect to navigation helper */}
                    <button
                      type="button"
                      onClick={() => handleConnectToNav(sec.sectionId, sec.title)}
                      className="px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-[10px] font-semibold transition mr-auto"
                    >
                      Hubungkan ke Navigasi
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleEditSection(sec)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition"
                    >
                      Edit
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-semibold transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== CUSTOM NAVIGATION EDITOR ====== */}
      <div id="custom-nav-builder" className="glass rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Navigasi Kustom</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Kelola menu navigasi landing page Anda sesuai kebutuhan.</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-950/40 px-2.5 py-1 rounded-full border border-slate-800/40">NAVIGASI</span>
        </div>

        {customNavItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-850 text-center space-y-4 py-8">
            <div className="inline-flex p-3.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/25">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi Otomatis (Bawaan) Aktif</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
                Landing page Anda saat ini menampilkan menu navigasi bawaan secara otomatis (Home, Tentang Kami, Katalog, Galeri, Testimoni, Kontak) sesuai dengan ketersediaan konten halaman Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCustomNavItems([
                  { label: 'Home', href: 'home', type: 'section' },
                  { label: 'Tentang Kami', href: 'about', type: 'section' },
                  { label: 'Katalog Produk', href: 'products', type: 'section' },
                  { label: 'Galeri', href: 'gallery', type: 'section' },
                  { label: 'Testimoni', href: 'testimonials', type: 'section' },
                  { label: 'Kontak', href: 'contact', type: 'section' },
                ]);
              }}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              Mulai Kustomisasi Menu Navigasi
            </button>
          </div>
        ) : (
          <>
            {/* List of custom nav items */}
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-12 gap-2 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <div className="col-span-4">Label Menu</div>
                <div className="col-span-3">Tipe Tautan</div>
                <div className="col-span-4">Target Tautan (ID / URL)</div>
                <div className="col-span-1 text-center">Aksi</div>
              </div>
              
              {customNavItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/20 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-900 sm:border-0">
                  <div className="flex items-center gap-2 flex-1">
                    <GripVertical className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />
                    
                    {/* Label Input */}
                    <input
                      type="text"
                      required
                      placeholder="Label (misal: Beranda)"
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...customNavItems];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setCustomNavItems(updated);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 outline-none focus:border-brand-500 transition"
                    />
                  </div>

                  {/* Type Select */}
                  <select
                    value={item.type || 'section'}
                    onChange={(e) => {
                      const updated = [...customNavItems];
                      const newType = e.target.value;
                      let newHref = item.href;
                      if (newType === 'section' && item.href.startsWith('http')) {
                        newHref = 'home';
                      } else if (newType === 'link' && !item.href.startsWith('http')) {
                        newHref = 'https://';
                      }
                      updated[idx] = { ...updated[idx], type: newType, href: newHref };
                      setCustomNavItems(updated);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="section">Bagian Halaman</option>
                    <option value="link">Link Eksternal</option>
                  </select>

                  {/* Target Href Input */}
                  <input
                    type="text"
                    required
                    placeholder={item.type === 'link' ? 'https://...' : 'ID bagian (misal: products)'}
                    value={item.href}
                    onChange={(e) => {
                      const updated = [...customNavItems];
                      updated[idx] = { ...updated[idx], href: e.target.value };
                      setCustomNavItems(updated);
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 outline-none focus:border-brand-500 transition font-mono"
                  />

                  {/* Delete Row Button */}
                  <button
                    type="button"
                    onClick={() => setCustomNavItems(customNavItems.filter((_, i) => i !== idx))}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition flex items-center justify-center shrink-0 border border-rose-500/10"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Tips Box (Premium Aesthetic Utility) */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-2 text-left">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">Tips: ID Bagian Halaman (Section ID)</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px] text-slate-400 font-medium">
                <div>• <code className="text-violet-400 font-mono">home</code> : Beranda / Hero</div>
                <div>• <code className="text-violet-400 font-mono">about</code> : Tentang Kami</div>
                <div>• <code className="text-violet-400 font-mono">products</code> : Katalog Produk</div>
                <div>• <code className="text-violet-400 font-mono">gallery</code> : Galeri Kegiatan</div>
                <div>• <code className="text-violet-400 font-mono">testimonials</code> : Testimoni</div>
                <div>• <code className="text-violet-400 font-mono">contact</code> : Kontak & Formulir</div>
              </div>
            </div>

            {/* Add & Save */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-900">
              <button
                type="button"
                onClick={() => setCustomNavItems([...customNavItems, { label: '', href: '', type: 'section' }])}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-450" /> Tambah Menu Baru
              </button>

              <button
                type="button"
                disabled={savingNav}
                onClick={handleResetNav}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 text-rose-450 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset ke Default
              </button>

              <button
                type="button"
                disabled={savingNav}
                onClick={async () => {
                  if (customNavItems.some(item => !item.label.trim() || !item.href.trim())) {
                    setError('Harap lengkapi semua kolom Label dan Target Tautan sebelum menyimpan.');
                    return;
                  }
                  setSavingNav(true);
                  setError('');
                  try {
                    await api.updateCustomNav(customNavItems);
                    setSuccess('Navigasi kustom berhasil disimpan!');
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (err) {
                    setError(err.message || 'Gagal menyimpan navigasi.');
                  } finally {
                    setSavingNav(false);
                  }
                }}
                className="ml-auto flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50"
              >
                {savingNav ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <><Save className="w-4.5 h-4.5" /> Simpan Navigasi</>}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ====== CATALOG LAYOUT (ROWS) ====== */}
      <div className="glass rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Rows3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Layout Katalog & Galeri</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Pilih berapa baris yang tampil di slide horizontal produk, galeri, dan testimoni.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCatalogLayout(n)}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${
                catalogLayout === n
                  ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-1">
                {[...Array(n)].map((_, i) => (
                  <div key={i} className="w-16 h-2 rounded-full bg-current opacity-60" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{n} Baris</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={savingLayout}
            onClick={async () => {
              setSavingLayout(true);
              setError('');
              try {
                await api.updateCatalogLayout(catalogLayout);
                setSuccess('Layout katalog berhasil disimpan!');
                setTimeout(() => setSuccess(''), 3000);
              } catch (err) {
                setError(err.message || 'Gagal menyimpan layout.');
              } finally {
                setSavingLayout(false);
              }
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {savingLayout ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Layout</>}
          </button>
        </div>
      </div>
    </div>
  );
}
