import { PrismaClient, Role, LeadStatus, DomainStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed: Starting database seeding...');

  // Clean old data (optional, but good for repeatable seeds)
  await prisma.lead.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.productService.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.aboutSection.deleteMany();
  await prisma.seoSetting.deleteMany();
  await prisma.domainSetting.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.landingPage.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // Create hashed passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const ownerPasswordHash = await bcrypt.hash('owner123', 10);

  // 1. Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@umkm.com',
      password: adminPasswordHash,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`Seed: Created Super Admin: ${superAdmin.email}`);

  // 2. Owner UMKM Demo
  const owner = await prisma.user.create({
    data: {
      email: 'owner@kopisenja.com',
      password: ownerPasswordHash,
      name: 'Budi Santoso',
      role: Role.OWNER,
      isActive: true,
    },
  });
  console.log(`Seed: Created Owner: ${owner.email}`);

  // 3. Business Demo Coffee Shop
  const business = await prisma.business.create({
    data: {
      userId: owner.id,
      name: 'Kopi Senja',
      category: 'Coffee Shop',
      description: 'Coffee Shop & Roastery premium dengan biji kopi pilihan nusantara.',
      address: 'Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan',
      whatsappNumber: '6281234567890',
      email: 'hello@kopisenja.com',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=200&auto=format&fit=crop',
      openHours: '08:00 - 22:00',
      instagram: 'https://instagram.com/kopisenja',
      tiktok: 'https://tiktok.com/@kopisenja',
      facebook: 'https://facebook.com/kopisenja',
    },
  });
  console.log(`Seed: Created Business: ${business.name}`);

  // 4. Landing Page
  const landingPage = await prisma.landingPage.create({
    data: {
      businessId: business.id,
      slug: 'kopi-senja',
      allowAdminEdit: true,
    },
  });
  console.log(`Seed: Created Landing Page with slug: ${landingPage.slug}`);

  // 5. Hero Section
  await prisma.heroSection.create({
    data: {
      landingPageId: landingPage.id,
      title: 'Nikmati Secangkir Ketenangan di Kopi Senja',
      subtitle: 'Dibuat dengan biji kopi pilihan dari petani lokal Indonesia, dipanggang dengan penuh ketelitian untuk menghasilkan cita rasa yang tak terlupakan.',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
      ctaText: 'Pesan Sekarang (WhatsApp)',
      ctaLink: null, // default to WhatsApp
    },
  });

  // 6. About Section
  await prisma.aboutSection.create({
    data: {
      landingPageId: landingPage.id,
      title: 'Cerita Kopi Senja',
      description: 'Dimulai dari sebuah garasi kecil di tahun 2022, Kopi Senja lahir dari kecintaan kami terhadap kopi nusantara. Kami berkomitmen untuk menyajikan kopi berkualitas tinggi sambil mendukung keberlangsungan hidup petani lokal Indonesia. Setiap cangkir yang kami seduh adalah cerita tentang dedikasi, kerja keras, dan kehangatan kebersamaan.',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    },
  });

  // 7. Products
  const products = [
    {
      name: 'Kopi Susu Gula Aren Senja',
      description: 'Espresso blend khas Senja dengan susu segar dan gula aren organik premium.',
      price: 22000,
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop',
      isActive: true,
    },
    {
      name: 'V60 Manual Brew',
      description: 'Single origin pilihan (Gayo, Toraja, Mandheling) yang diseduh dengan metode V60.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
      isActive: true,
    },
    {
      name: 'Croissant Butter',
      description: 'Pastry mentega khas Perancis yang renyah di luar dan lembut di dalam.',
      price: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop',
      isActive: true,
    },
    {
      name: 'Affogato',
      description: 'Satu scoop es krim vanilla premium yang disiram dengan double shot espresso panas.',
      price: 28000,
      imageUrl: 'https://images.unsplash.com/photo-1594911774802-8822a7079af1?q=80&w=400&auto=format&fit=crop',
      isActive: true,
    },
  ];

  for (const prod of products) {
    await prisma.productService.create({
      data: {
        landingPageId: landingPage.id,
        ...prod,
      },
    });
  }

  // 8. Gallery Items
  const galleryItems = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
      caption: 'Ruang komunal lantai dua yang cocok untuk WFH',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop',
      caption: 'Proses manual brewing oleh barista kami',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
      caption: 'Suasana hangat Kopi Senja di malam hari',
    },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: {
        landingPageId: landingPage.id,
        ...item,
      },
    });
  }

  // 9. Testimonials
  const testimonials = [
    {
      name: 'Rian Dwi',
      content: 'Kopi Susu Gula Arennya beneran nagih! Gak kemanisan, kopinya masih berasa banget. Tempatnya juga pw buat nugas.',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop',
      rating: 5,
    },
    {
      name: 'Siti Aminah',
      content: 'Pelayanannya super ramah, baristanya informatif pas ditanya soal single origin. V60 Gayo-nya juara!',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      rating: 5,
    },
  ];

  for (const test of testimonials) {
    await prisma.testimonial.create({
      data: {
        landingPageId: landingPage.id,
        ...test,
      },
    });
  }

  // 10. Leads
  const leads = [
    {
      name: 'Andi Pratama',
      whatsappNumber: '6282111222333',
      email: 'andi.pratama@gmail.com',
      message: 'Halo, apakah Kopi Senja menerima reservasi tempat untuk acara ulang tahun kapasitas 20 orang?',
      status: LeadStatus.NEW,
    },
    {
      name: 'Jessica Laura',
      whatsappNumber: '628999888777',
      email: 'jessica@outlook.com',
      message: 'Hi, mau tanya dong apa ada paket catering kopi untuk event kantor?',
      status: LeadStatus.CONTACTED,
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        landingPageId: landingPage.id,
        ...lead,
      },
    });
  }

  // 11. SEO Setting
  await prisma.seoSetting.create({
    data: {
      landingPageId: landingPage.id,
      metaTitle: 'Kopi Senja - Coffee Shop & Roastery Terbaik Jakarta Selatan',
      metaDescription: 'Nikmati kopi susu gula aren khas Senja dan kopi manual brew single origin berkualitas tinggi di Senopati Jakarta Selatan. Tempat coworking space asik.',
      metaKeywords: 'coffee shop jakarta, kopi gula aren senja, manual brew senopati, cafe cozy jakarta',
      ogImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    },
  });

  // 12. Domain Setting
  await prisma.domainSetting.create({
    data: {
      landingPageId: landingPage.id,
      customDomain: 'kopisenja.com',
      status: DomainStatus.PENDING,
    },
  });

  // 13. Analytics
  await prisma.analytics.create({
    data: {
      landingPageId: landingPage.id,
      views: 342,
    },
  });

  console.log('Seed: Database seeding completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('Seed: Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
