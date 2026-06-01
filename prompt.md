Saya ingin membuat aplikasi SaaS bernama **UMKM Landing Builder**.

Aplikasi ini bukan website builder kompleks seperti Wix atau WordPress. Fokus aplikasi adalah membuat **landing page satu tema** yang bisa diedit dari admin panel. Target pengguna adalah UMKM seperti coffee shop, perumahan, jasa travel, klinik, laundry, bengkel, dan brand clothing.

Buatkan sistem fullstack dengan stack berikut:

* Frontend: React + Vite
* Backend: NestJS
* Database: PostgreSQL
* ORM: Prisma
* Auth: JWT
* Styling: Tailwind CSS
* Role: Super Admin dan Owner UMKM

Konsep utama aplikasi:

Setiap user/owner UMKM bisa memiliki satu landing page. Landing page tersebut memiliki struktur tetap, tetapi kontennya bisa diedit melalui admin panel. Jadi user tidak perlu drag-and-drop builder yang rumit. User cukup mengubah teks, gambar, produk/layanan, testimoni, tombol WhatsApp, SEO, dan informasi bisnis.

Role aplikasi:

1. Super Admin

   * Login ke dashboard super admin
   * Melihat semua user/owner UMKM
   * Melihat semua landing page yang dibuat
   * Mengaktifkan atau menonaktifkan akun owner
   * Menghapus user/landing page jika diperlukan
   * Melihat statistik umum platform

2. Owner UMKM

   * Register dan login
   * Mengelola profil bisnis
   * Mengedit konten landing page
   * Mengelola produk/layanan
   * Mengelola galeri
   * Mengelola testimoni
   * Mengelola form leads yang masuk
   * Melihat analytics sederhana
   * Mengatur SEO basic
   * Mengatur tombol WhatsApp

Fitur utama:

1. Authentication

   * Register owner UMKM
   * Login
   * Logout
   * JWT authentication
   * Protected route berdasarkan role
   * Password harus di-hash menggunakan bcrypt

2. Dashboard Owner

   * Ringkasan data landing page
   * Jumlah leads masuk
   * Jumlah views landing page
   * Jumlah produk/layanan
   * Shortcut edit konten landing page

3. Business Profile
   Owner dapat mengatur:

   * Nama bisnis
   * Kategori bisnis
   * Deskripsi singkat
   * Alamat
   * Nomor WhatsApp
   * Email
   * Logo
   * Jam operasional
   * Link Instagram/TikTok/Facebook jika ada

4. Landing Page Content Management

   Owner dapat mengedit beberapa section berikut:

   A. Hero Section

   * Judul utama
   * Subtitle/deskripsi singkat
   * Gambar hero
   * Teks tombol CTA
   * Link tombol CTA, default ke WhatsApp

   B. About Section

   * Judul section
   * Deskripsi bisnis
   * Gambar pendukung

   C. Products/Services Section

   * Tambah produk/layanan
   * Edit produk/layanan
   * Hapus produk/layanan
   * Nama produk/layanan
   * Deskripsi
   * Harga opsional
   * Gambar
   * Status aktif/tidak aktif

   D. Gallery Section

   * Upload gambar galeri
   * Edit caption
   * Hapus gambar

   E. Testimonials Section

   * Nama customer
   * Isi testimoni
   * Foto customer opsional
   * Rating opsional

   F. Contact Section

   * Alamat
   * Nomor WhatsApp
   * Email
   * Link Google Maps
   * Jam operasional

5. Public Landing Page
   Setiap bisnis memiliki halaman publik dengan URL:
   `/site/:slug`

   Contoh:
   `/site/kopi-senja`
   `/site/laundry-bersih`
   `/site/rumah-griya-asri`

   Halaman publik harus menampilkan:

   * Hero section
   * About section
   * Produk/layanan
   * Galeri
   * Testimoni
   * Form leads
   * Tombol WhatsApp floating
   * Footer

   Landing page harus responsive untuk mobile dan desktop.

6. Form Leads
   Pengunjung landing page dapat mengisi form:

   * Nama
   * Nomor WhatsApp
   * Email opsional
   * Pesan

   Data leads masuk ke dashboard owner.

   Owner dapat:

   * Melihat daftar leads
   * Melihat detail lead
   * Mengubah status lead: New, Contacted, Converted, Rejected
   * Menghapus lead
   * Klik tombol untuk menghubungi lead via WhatsApp

7. WhatsApp Integration Basic
   Buat tombol WhatsApp floating di landing page.
   Ketika diklik, pengunjung diarahkan ke:
   `https://wa.me/{nomor}?text={pesan_default}`

   Owner bisa mengatur pesan default dari dashboard.

8. SEO Basic
   Owner dapat mengatur:

   * Meta title
   * Meta description
   * Meta keywords
   * Open Graph image

   Terapkan data SEO tersebut pada public landing page.

9. Analytics Sederhana
   Simpan jumlah views setiap landing page.
   Setiap kali halaman `/site/:slug` dibuka, sistem menambahkan view count.

   Dashboard owner menampilkan:

   * Total views
   * Total leads
   * Conversion rate sederhana: leads / views * 100
   * Produk/layanan aktif

10. Custom Domain Preparation
    Untuk tahap awal, tidak perlu benar-benar menghubungkan custom domain secara otomatis.
    Namun buat struktur database dan halaman setting agar owner bisa menyimpan:

* Custom domain
* Status domain: pending, active, failed

Nanti fitur ini bisa dikembangkan.

11. Admin Panel UI
    Buat admin panel yang clean, modern, dan mudah dipakai.
    Sidebar menu:

* Dashboard
* Business Profile
* Landing Page
* Products/Services
* Gallery
* Testimonials
* Leads
* Analytics
* SEO Settings
* Domain Settings
* Settings

12. Super Admin Panel
    Sidebar menu:

* Dashboard
* Users
* Landing Pages
* Leads Overview
* Platform Analytics

13. Database Design
    Buat schema Prisma minimal dengan model:

* User
* Business
* LandingPage
* HeroSection
* AboutSection
* ProductService
* GalleryItem
* Testimonial
* Lead
* SeoSetting
* Analytics
* DomainSetting

Relasi utama:

* User memiliki satu Business
* Business memiliki satu LandingPage
* LandingPage memiliki banyak ProductService
* LandingPage memiliki banyak GalleryItem
* LandingPage memiliki banyak Testimonial
* LandingPage memiliki banyak Lead
* LandingPage memiliki satu SeoSetting
* LandingPage memiliki satu DomainSetting
* LandingPage memiliki Analytics

14. Backend API
    Buat REST API dengan struktur modular NestJS:

* auth module
* users module
* business module
* landing-page module
* products module
* gallery module
* testimonials module
* leads module
* seo module
* analytics module
* domain module

Endpoint harus menggunakan validasi DTO.
Gunakan class-validator dan class-transformer.
Terapkan guard JWT dan role guard.

15. Frontend Pages
    Buat halaman frontend:

* Login
* Register
* Owner Dashboard
* Edit Business Profile
* Edit Landing Page Content
* Manage Products/Services
* Manage Gallery
* Manage Testimonials
* Manage Leads
* Analytics
* SEO Settings
* Domain Settings
* Super Admin Dashboard
* Public Landing Page `/site/:slug`

16. UI/UX Requirement

* Gunakan desain modern dan clean
* Gunakan Tailwind CSS
* Responsive mobile dan desktop
* Form mudah digunakan
* Table memiliki search dan filter sederhana
* Tambahkan loading state
* Tambahkan empty state
* Tambahkan toast notification untuk aksi berhasil/gagal
* Gunakan modal untuk create/edit data jika cocok

17. Data Awal / Seeder
    Buat seed data:

* 1 super admin
* 1 owner UMKM demo
* 1 business demo coffee shop
* beberapa produk
* beberapa galeri
* beberapa testimoni
* beberapa leads

18. Security dan Best Practice

* Password hash dengan bcrypt
* JWT disimpan dengan aman
* Validasi input backend
* Role-based access control
* Owner hanya bisa mengakses data miliknya sendiri
* Super admin bisa mengakses semua data
* Jangan hardcode secret key
* Gunakan environment variables

19. Output yang saya inginkan:

* Struktur folder frontend dan backend yang rapi
* Prisma schema lengkap
* API service lengkap
* DTO dan validation
* Auth dan RBAC
* UI dashboard owner
* UI super admin
* Public landing page
* Seeder database
* Instruksi menjalankan project
* Contoh file `.env.example`

Prioritaskan MVP yang solid, bukan fitur terlalu banyak tapi setengah jadi. Buat sistem yang benar-benar bisa dijalankan, rapi, mudah dikembangkan, dan cocok untuk dijadikan SaaS UMKM.
