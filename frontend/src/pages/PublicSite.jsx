import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import HorizontalCarousel from '../components/HorizontalCarousel';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Star,
  Loader2,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function PublicSite() {
  const { slug } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Product for Lightbox Detail Popup
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Light & Dark Mode state
  const [darkMode, setDarkMode] = useState(true);

  // Form lead states
  const [leadName, setLeadName] = useState('');
  const [leadWA, setLeadWA] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Custom premium smooth-scroll handler with offset
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80; // Height of the sticky glass header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const fetchSite = async () => {
    try {
      const data = await api.getPublicSite(slug);
      setSiteData(data);

      // Dynamically apply SEO settings in browser
      if (data.seoSetting) {
        document.title = data.seoSetting.metaTitle || `${data.business.name} - ${data.business.category}`;
        
        let descMeta = document.querySelector("meta[name='description']");
        if (!descMeta) {
          descMeta = document.createElement('meta');
          descMeta.setAttribute('name', 'description');
          document.head.appendChild(descMeta);
        }
        descMeta.setAttribute('content', data.seoSetting.metaDescription || '');

        let keyMeta = document.querySelector("meta[name='keywords']");
        if (!keyMeta) {
          keyMeta = document.createElement('meta');
          keyMeta.setAttribute('name', 'keywords');
          document.head.appendChild(keyMeta);
        }
        keyMeta.setAttribute('content', data.seoSetting.metaKeywords || '');
      }
    } catch (err) {
      setError(err.message || 'Halaman landing page tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite();
  }, [slug]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!leadName || !leadWA || !leadMessage) {
      setFormError('Harap lengkapi nama, nomor WhatsApp, dan isi pesan Anda.');
      return;
    }

    let formattedWA = leadWA.trim().replace(/[^0-9]/g, '');
    if (formattedWA.startsWith('08')) {
      formattedWA = '628' + formattedWA.slice(2);
    } else if (formattedWA.startsWith('8')) {
      formattedWA = '628' + formattedWA.slice(1);
    }

    setFormSubmitting(true);
    try {
      await api.submitLead(slug, {
        name: leadName,
        whatsappNumber: formattedWA,
        email: leadEmail || undefined,
        message: leadMessage,
      });

      setFormSuccess('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda melalui WhatsApp.');
      setLeadName('');
      setLeadWA('');
      setLeadEmail('');
      setLeadMessage('');
    } catch (err) {
      setFormError(err.message || 'Gagal mengirimkan pesan. Silakan coba kembali.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getWhatsAppFloatLink = () => {
    if (!siteData?.business?.whatsappNumber) return '#';
    const number = siteData.business.whatsappNumber;
    const defaultText = `Halo ${siteData.business.name}, saya tertarik dengan produk/layanan Anda.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(defaultText)}`;
  };

  const getProductWhatsAppLink = (product) => {
    if (!siteData?.business?.whatsappNumber) return '#';
    const number = siteData.business.whatsappNumber;
    
    // Global customizable template with replacements
    const template = siteData.business.whatsappTemplate || 'Halo {nama_toko}, saya tertarik untuk memesan "{nama_produk}" yang tertera di landing page Anda.';
    
    const businessName = siteData.business.name || '';
    const productName = product.name || '';
    const productPrice = product.price !== null && product.price !== undefined
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)
      : 'Hubungi Kami';

    const formattedText = template
      .replace(/{nama_toko}/g, businessName)
      .replace(/{nama_produk}/g, productName)
      .replace(/{harga_produk}/g, productPrice);

    return `https://wa.me/${number}?text=${encodeURIComponent(formattedText)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">404: Landing Page Tidak Ditemukan</h1>
        <p className="text-slate-400 text-sm max-w-md mt-2">
          Halaman yang Anda tuju tidak ditemukan atau telah dinonaktifkan oleh administrator.
        </p>
        <a href="/" className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold hover:bg-slate-700 transition">
          Kembali ke Platform
        </a>
      </div>
    );
  }

  const { business, heroSection, aboutSection, products, galleryItems, testimonials, customSections } = siteData;

  // Premium Theme Presets Configurer
  const themePresets = {
    EMERALD: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-500',
      text: 'text-emerald-400',
      textHover: 'hover:text-emerald-300',
      border: 'border-emerald-500/20',
      borderFocus: 'focus:border-emerald-500',
      bgLight: 'bg-emerald-500/10',
      accentBg: 'bg-emerald-500',
      shadow: 'shadow-emerald-500/20 shadow-lg',
      accentColor: '#10b981',
    },
    BLUE: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-500',
      text: 'text-blue-400',
      textHover: 'hover:text-blue-300',
      border: 'border-blue-500/20',
      borderFocus: 'focus:border-blue-500',
      bgLight: 'bg-blue-500/10',
      accentBg: 'bg-blue-500',
      shadow: 'shadow-blue-500/20 shadow-lg',
      accentColor: '#3b82f6',
    },
    AMBER: {
      primary: 'bg-amber-600',
      hover: 'hover:bg-amber-500',
      text: 'text-amber-400',
      textHover: 'hover:text-amber-300',
      border: 'border-amber-500/20',
      borderFocus: 'focus:border-amber-500',
      bgLight: 'bg-amber-500/10',
      accentBg: 'bg-amber-500',
      shadow: 'shadow-amber-500/20 shadow-lg',
      accentColor: '#f59e0b',
    },
    VIOLET: {
      primary: 'bg-violet-600',
      hover: 'hover:bg-violet-500',
      text: 'text-violet-400',
      textHover: 'hover:text-violet-300',
      border: 'border-violet-500/20',
      borderFocus: 'focus:border-violet-500',
      bgLight: 'bg-violet-500/10',
      accentBg: 'bg-violet-500',
      shadow: 'shadow-violet-500/20 shadow-lg',
      accentColor: '#8b5cf6',
    },
    ROSE: {
      primary: 'bg-rose-600',
      hover: 'hover:bg-rose-500',
      text: 'text-rose-400',
      textHover: 'hover:text-rose-300',
      border: 'border-rose-500/20',
      borderFocus: 'focus:border-rose-500',
      bgLight: 'bg-rose-500/10',
      accentBg: 'bg-rose-500',
      shadow: 'shadow-rose-500/20 shadow-lg',
      accentColor: '#f43f5e',
    },
    TEAL: {
      primary: 'bg-teal-600',
      hover: 'hover:bg-teal-500',
      text: 'text-teal-400',
      textHover: 'hover:text-teal-300',
      border: 'border-teal-500/20',
      borderFocus: 'focus:border-teal-500',
      bgLight: 'bg-teal-500/10',
      accentBg: 'bg-teal-500',
      shadow: 'shadow-teal-500/20 shadow-lg',
      accentColor: '#14b8a6',
    },
    ORANGE: {
      primary: 'bg-orange-600',
      hover: 'hover:bg-orange-500',
      text: 'text-orange-400',
      textHover: 'hover:text-orange-300',
      border: 'border-orange-500/20',
      borderFocus: 'focus:border-orange-500',
      bgLight: 'bg-orange-500/10',
      accentBg: 'bg-orange-500',
      shadow: 'shadow-orange-500/20 shadow-lg',
      accentColor: '#f97316',
    },
    FUCHSIA: {
      primary: 'bg-fuchsia-600',
      hover: 'hover:bg-fuchsia-500',
      text: 'text-fuchsia-400',
      textHover: 'hover:text-fuchsia-300',
      border: 'border-fuchsia-500/20',
      borderFocus: 'focus:border-fuchsia-500',
      bgLight: 'bg-fuchsia-500/10',
      accentBg: 'bg-fuchsia-500',
      shadow: 'shadow-fuchsia-500/20 shadow-lg',
      accentColor: '#d946ef',
    },
  };

  let activeTheme = themePresets[siteData.themeColor] || themePresets.EMERALD;

  // Custom hex brand color dynamic builder
  if (siteData.themeColor && siteData.themeColor.startsWith('#')) {
    const customHex = siteData.themeColor;
    activeTheme = {
      primary: 'bg-[var(--brand-primary)]',
      hover: 'brightness-110',
      text: 'text-[var(--brand-primary)]',
      textHover: 'brightness-110',
      border: 'border-[var(--brand-primary)]/20',
      borderFocus: 'focus:border-[var(--brand-primary)]',
      bgLight: 'bg-[var(--brand-primary)]/10',
      accentBg: 'bg-[var(--brand-primary)]',
      shadow: 'shadow-[var(--brand-primary)]/20 shadow-lg',
      accentColor: customHex,
    };
  }

  const catalogRows = siteData.catalogLayout || 1;

  // Default nav links
  const defaultNavLinks = [
    { label: 'Home', href: 'home' },
    { label: 'Tentang Kami', href: 'about' },
    ...(products?.length > 0 ? [{ label: 'Katalog Produk', href: 'products' }] : []),
    ...(galleryItems?.length > 0 ? [{ label: 'Galeri', href: 'gallery' }] : []),
    ...(testimonials?.length > 0 ? [{ label: 'Testimoni', href: 'testimonials' }] : []),
    { label: 'Kontak', href: 'contact' },
  ];

  // Merge custom nav: jika ada custom nav dari owner, ganti default
  const rawCustomNav = Array.isArray(siteData.customNavItems) ? siteData.customNavItems : [];
  const navLinks = rawCustomNav.length > 0
    ? rawCustomNav.map(item => ({ label: item.label, href: item.href, isExternal: item.type === 'link' }))
    : defaultNavLinks;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans relative ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      style={siteData.themeColor && siteData.themeColor.startsWith('#') ? { '--brand-primary': siteData.themeColor } : {}}
    >
      {/* 1. Sticky Header Navbar with Navigation Menu */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode ? 'bg-slate-950/85 border-white/5 text-white' : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="flex items-center gap-3.5 hover:opacity-90 transition">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className={`w-9 h-9 rounded-xl ${activeTheme.bgLight} border ${activeTheme.border} flex items-center justify-center font-extrabold text-[var(--brand-primary)] text-md shadow-md`}>
                <span style={siteData.themeColor && siteData.themeColor.startsWith('#') ? { color: siteData.themeColor } : {}}>
                  {business.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
            <div className="text-left">
              <span className={`font-extrabold text-sm md:text-md leading-none block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{business.name}</span>
              <span className="text-[9px] font-bold text-slate-400/80 tracking-widest uppercase">{business.category}</span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isExternal
                ? <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    {link.label}
                  </a>
                : <a key={link.label} href={`#${link.href}`}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    {link.label}
                  </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Light/Dark Mode Switcher Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition duration-300 border flex items-center justify-center ${
                darkMode
                  ? 'bg-slate-900 border-white/5 hover:bg-slate-800 text-amber-400'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-violet-600 shadow-sm'
              }`}
              title={darkMode ? 'Nyalakan Mode Terang' : 'Nyalakan Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className={`px-4 py-2 rounded-xl ${activeTheme.primary} ${activeTheme.hover} text-white text-xs font-bold transition shadow-lg ${activeTheme.shadow}`}
            >
              Hubungi Kontak
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (Home Anchor) */}
      <section id="home" className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-12 md:py-24 transition-colors duration-500">
        {/* Latar Belakang Gambar Blur */}
        <div className="absolute inset-0 z-0">
          {heroSection?.imageUrl ? (
            <>
              <img src={heroSection.imageUrl} alt="Latar Belakang Hero" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-500 ${
                darkMode ? 'bg-slate-950/85' : 'bg-slate-50/80'
              }`}></div>
            </>
          ) : (
            <div className={`w-full h-full transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-slate-500/10 blur-[80px]"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-slate-500/5 blur-[80px]"></div>
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center z-10 space-y-6">
          <h1 className={`text-3xl md:text-5xl font-extrabold tracking-tight leading-tight uppercase transition-colors duration-500 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {heroSection?.title}
          </h1>
          {heroSection?.subtitle && (
            <p className={`text-sm md:text-md max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {heroSection.subtitle}
            </p>
          )}

          <div className="pt-4">
            <a
              href={heroSection?.ctaLink || getWhatsAppFloatLink()}
              target={heroSection?.ctaLink ? '_self' : '_blank'}
              rel="noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r ${
                darkMode ? 'from-slate-900 to-slate-950' : 'from-white to-slate-100 text-slate-800'
              } border ${darkMode ? 'border-white/10 hover:border-white/20' : 'border-slate-300 hover:border-slate-400'} text-xs font-extrabold tracking-wider uppercase shadow-xl hover:scale-103 transition-all duration-300`}
            >
              <Phone className={`w-4 h-4 fill-current ${activeTheme.text}`} />
              {heroSection?.ctaText || 'Hubungi Kami'}
            </a>
          </div>
        </div>
      </section>

      {/* 3. About Section (About Anchor) */}
      {aboutSection && aboutSection.description && (
        <section id="about" className={`py-16 border-y transition-colors duration-500 scroll-mt-14 ${
          darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-100/50 border-slate-200'
        }`}>
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Story text */}
              <div className="space-y-4 text-left">
                <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>SIAPA KAMI</span>
                <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {aboutSection.title || 'Cerita Toko Kami'}
                </h2>
                <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-500 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {aboutSection.description}
                </p>
              </div>

              {/* Photo Frame */}
              {aboutSection.imageUrl && (
                <div className={`rounded-3xl overflow-hidden border aspect-[4/3] shadow-2xl relative group ${
                  darkMode ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'
                }`}>
                  <img src={aboutSection.imageUrl} alt="Pendukung Kisah Kami" className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Custom Dynamic Sections (Section C) */}
      {customSections && customSections.length > 0 && customSections.map((sec, index) => (
        <section
          id={sec.sectionId}
          key={sec.id}
          className={`py-16 border-y transition-colors duration-500 scroll-mt-14 ${
            index % 2 === 0
              ? (darkMode ? 'bg-slate-950/20 border-white/5' : 'bg-slate-50/30 border-slate-200/50')
              : (darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-100/50 border-slate-200')
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Alternate Columns Layout based on Index */}
              <div className={`space-y-4 text-left ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>INFORMASI TAMBAHAN</span>
                <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {sec.title}
                </h2>
                <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-500 ${
                  darkMode ? 'text-slate-300' : 'text-slate-650'
                }`}>
                  {sec.content}
                </p>
              </div>

              {sec.imageUrl && (
                <div className={`rounded-3xl overflow-hidden border aspect-[4/3] shadow-2xl relative group ${
                  darkMode ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'
                }`}>
                  <img src={sec.imageUrl} alt={sec.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* 4. Products Section (Products Anchor) */}
      {products && products.length > 0 && (
        <section id="products" className="py-16 scroll-mt-14 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 md:px-8 text-center space-y-12">
            <div className="space-y-2">
              <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>Katalog Layanan</span>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>Produk & Jasa Unggulan</h2>
              <p className={`text-xs max-w-md mx-auto transition-colors duration-500 ${
                darkMode ? 'text-slate-400' : 'text-slate-550'
              }`}>Kami menghadirkan kualitas penawaran terbaik yang dirancang khusus untuk memenuhi kepuasan Anda</p>
            </div>

            {/* Products Carousel */}
            <HorizontalCarousel
              items={products}
              rows={catalogRows}
              itemWidth="260px"
              renderItem={(prod) => (
                <div
                  onClick={() => setSelectedProduct(prod)}
                  className={`rounded-3xl overflow-hidden border flex flex-col justify-between hover:-translate-y-1 transition duration-300 cursor-pointer group ${
                    darkMode
                      ? 'bg-slate-900/40 border-white/5 hover:border-white/10 text-white'
                      : 'bg-white border-slate-200 hover:border-slate-300/85 hover:shadow-lg text-slate-900'
                  }`}
                >
                  <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden shrink-0">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 bg-slate-900/60 font-semibold uppercase tracking-wider">Foto Produk</div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className={`text-xs font-bold leading-tight line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{prod.name}</h3>
                      <p className={`text-[11px] line-clamp-2 leading-relaxed mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{prod.description || '-'}</p>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className={`text-xs font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {prod.price !== null && prod.price !== undefined
                          ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(prod.price)
                          : 'Hubungi Kami'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-xl ${activeTheme.primary} text-white text-[10px] font-bold shadow-md`}>Detail</span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </section>
      )}

      {/* 5. Gallery Section (Gallery Anchor) */}
      {galleryItems && galleryItems.length > 0 && (
        <section id="gallery" className={`py-16 border-y transition-colors duration-500 scroll-mt-14 ${
          darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-100/50 border-slate-200'
        }`}>
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center space-y-12">
            <div className="space-y-2">
              <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>DOKUMENTASI KAMI</span>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>Galeri Kegiatan & Portofolio</h2>
            </div>

            {/* Gallery Carousel */}
            <HorizontalCarousel
              items={galleryItems}
              rows={catalogRows}
              itemWidth="260px"
              renderItem={(item) => (
                <div
                  className={`rounded-3xl overflow-hidden aspect-[4/3] border transition duration-300 relative shadow-lg ${
                    darkMode ? 'bg-slate-950 border-white/5 hover:border-white/10' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={item.imageUrl} alt={item.caption || 'Galeri'} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  {item.caption && (
                    <div className={`absolute inset-x-0 bottom-0 p-3 text-left border-t ${
                      darkMode ? 'bg-slate-950/80 border-white/5' : 'bg-white/90 border-slate-100'
                    }`}>
                      <p className={`text-[10px] font-semibold truncate leading-none ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>{item.caption}</p>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </section>
      )}

      {/* 6. Testimonials Section (Testimonials Anchor) */}
      {testimonials && testimonials.length > 0 && (
        <section id="testimonials" className="py-16 scroll-mt-14 transition-colors duration-500">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center space-y-12">
            <div className="space-y-2">
              <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>TANGGAPAN KONSUMEN</span>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>Apa Kata Pelanggan Kami?</h2>
            </div>

            {/* Testimonials Carousel */}
            <HorizontalCarousel
              items={testimonials}
              rows={catalogRows}
              itemWidth="320px"
              renderItem={(test) => (
                <div
                  className={`rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                    darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200/80 shadow-md text-slate-900'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (test.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <p className={`text-xs italic leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{test.content}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
                    {test.avatarUrl ? (
                      <img src={test.avatarUrl} alt={test.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${darkMode ? 'bg-slate-800 text-white border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {test.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className={`text-xs font-bold leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{test.name}</h4>
                      <span className="text-[10px] text-slate-500">Pelanggan Terverifikasi</span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </section>
      )}

      {/* 7. Form Leads & Contact Section (Contact Anchor) */}
      <section id="contact" className={`py-16 border-t transition-colors duration-500 scroll-mt-14 ${
        darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-100/60 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start text-left">
            {/* Business Contact Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className={`text-[10px] ${activeTheme.text} font-extrabold uppercase tracking-widest`}>INFORMASI HUBUNGI</span>
                <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>Hubungi Kami Langsung</h2>
                <p className={`text-xs leading-relaxed transition-colors duration-500 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Harap isi formulir atau gunakan kontak detail untuk mengajukan penawaran dan reservasi.</p>
              </div>

              <div className="space-y-4 text-xs">
                {business.address && (
                  <div className="flex gap-3">
                    <MapPin className={`w-4 h-4 ${activeTheme.text} shrink-0 mt-0.5`} />
                    <div>
                      <span className={`font-bold block mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alamat Lengkap</span>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{business.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Phone className={`w-4 h-4 ${activeTheme.text} shrink-0 mt-0.5`} />
                  <div>
                    <span className={`font-bold block mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>WhatsApp Chat</span>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>+{business.whatsappNumber}</p>
                  </div>
                </div>

                {business.email && (
                  <div className="flex gap-3">
                    <Mail className={`w-4 h-4 ${activeTheme.text} shrink-0 mt-0.5`} />
                    <div>
                      <span className={`font-bold block mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Email Bisnis</span>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{business.email}</p>
                    </div>
                  </div>
                )}

                {business.openHours && (
                  <div className="flex gap-3">
                    <Clock className={`w-4 h-4 ${activeTheme.text} shrink-0 mt-0.5`} />
                    <div>
                      <span className={`font-bold block mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Jam Operasional</span>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{business.openHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Leads submit Form */}
            <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
              darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-100'
            } lg:col-span-3 space-y-6`}>
              <div>
                <h3 className={`text-md font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>Kirimkan Formulir Pesan</h3>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kami akan merespons pesan Anda secepatnya.</p>
              </div>

              {formSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {formSuccess}
                </div>
              )}

              {formError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition ${
                        darkMode
                          ? 'bg-slate-950/60 border-white/5 text-slate-200 focus:border-brand-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>

                  {/* WA */}
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789"
                      value={leadWA}
                      onChange={(e) => setLeadWA(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition ${
                        darkMode
                          ? 'bg-slate-950/60 border-white/5 text-slate-200 focus:border-brand-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="budi@example.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition ${
                      darkMode
                        ? 'bg-slate-950/60 border-white/5 text-slate-200 focus:border-brand-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
                    }`}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Isi Pesan Anda</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tuliskan detail pesanan, pertanyaan reservasi, atau layanan kustom yang Anda butuhkan..."
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition ${
                      darkMode
                        ? 'bg-slate-950/60 border-white/5 text-slate-200 focus:border-brand-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
                    }`}
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className={`w-full py-3 rounded-2xl ${activeTheme.primary} ${activeTheme.hover} text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50`}
                >
                  {formSubmitting ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <>
                      Kirim Formulir Pesan <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Interactive Google Maps Section (Added Premium Feature) */}
          {business.googleMapsUrl && (
            <div className={`mt-12 rounded-3xl overflow-hidden border shadow-2xl h-80 w-full relative ${
              darkMode ? 'border-white/5' : 'border-slate-200'
            }`}>
              <iframe
                title={`Peta Lokasi ${business.name}`}
                src={business.googleMapsUrl}
                width="100%"
                height="100%"
                style={darkMode ? { border: 0, filter: 'invert(90%) hue-rotate(180deg)' } : { border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </section>

      {/* 8. Footer layout */}
      <footer className={`py-12 border-t text-center text-xs transition-colors duration-500 ${
        darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1 md:text-left">
            <span className="font-extrabold text-white text-sm block">{business.name}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Terbantu Oleh UMKM Landing Page Builder Platform</span>
          </div>

          {/* Social media links */}
          <div className="flex items-center justify-center gap-3.5">
            {business.instagram && (
              <a href={business.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.666-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            )}
            {business.facebook && (
              <a href={business.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
            )}
          </div>

          <div className="md:text-right">
            <span>&copy; {new Date().getFullYear()} {business.name}. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </footer>

      {/* 9. Sticky Floating WhatsApp Button */}
      <a
        href={getWhatsAppFloatLink()}
        target="_blank"
        rel="noreferrer"
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full ${activeTheme.accentBg} text-white shadow-2xl hover:scale-110 ${activeTheme.shadow} transition-all duration-300 group flex items-center justify-center`}
        title="Chat on WhatsApp"
      >
        <Phone className="w-6 h-6 fill-current text-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300">
          WhatsApp Kami
        </span>
      </a>

      {/* 10. PRODUCT DETAILS LIGHTBOX MODAL (Premium Added Feature) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl w-full max-w-lg border shadow-2xl overflow-hidden relative animate-zoom-in max-h-[90vh] flex flex-col justify-between ${
            darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950/80 hover:bg-white/10 text-slate-400 hover:text-white transition duration-200 z-10"
              title="Tutup Detail"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto">
              {/* Product Photo */}
              <div className="aspect-[16/10] bg-slate-950 relative overflow-hidden shrink-0">
                {selectedProduct.imageUrl ? (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-semibold uppercase tracking-wider text-xs bg-slate-900/40">Foto Produk</div>
                )}
              </div>

              {/* Product Details Info */}
              <div className="p-6 md:p-8 space-y-4 text-left">
                <div className="space-y-1">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${activeTheme.text}`}>Rincian Katalog</span>
                  <h3 className={`text-lg md:text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProduct.name}</h3>
                  <span className={`text-md font-extrabold block pt-1 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                    {selectedProduct.price !== null && selectedProduct.price !== undefined
                      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.price)
                      : 'Hubungi Kami'}
                  </span>
                </div>

                <div className={`pt-2 border-t space-y-2 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Deskripsi Lengkap</span>
                  <p className={`text-xs leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedProduct.description || 'Tidak ada deskripsi lengkap untuk produk/layanan ini.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className={`p-4 border-t flex gap-3 ${darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <button
                onClick={() => setSelectedProduct(null)}
                className={`py-2.5 rounded-2xl text-xs font-semibold transition ${
                  darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                } ${business.showWhatsAppOrder === false ? 'w-full flex-none' : 'flex-1'}`}
              >
                Kembali
              </button>
              {business.showWhatsAppOrder !== false && (
                <a
                  href={getProductWhatsAppLink(selectedProduct)}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 py-2.5 rounded-2xl ${activeTheme.primary} ${activeTheme.hover} text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-lg ${activeTheme.shadow}`}
                >
                  <Phone className="w-4 h-4 fill-current text-white" />
                  Pesan via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
