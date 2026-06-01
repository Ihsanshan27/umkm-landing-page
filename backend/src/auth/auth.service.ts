import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role, DomainStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar. Gunakan email lain.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const slug = this.slugify(dto.businessName);

    // Verify slug uniqueness, modify if conflict exists
    let uniqueSlug = slug;
    let counter = 1;
    while (await this.prisma.landingPage.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Run transaction to create User, Business, LandingPage, and all default sections!
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          password: hashedPassword,
          name: dto.name,
          role: Role.OWNER,
          isActive: true,
        },
      });

      const business = await tx.business.create({
        data: {
          userId: user.id,
          name: dto.businessName,
          category: dto.category,
          whatsappNumber: dto.whatsappNumber,
          description: `Selamat datang di ${dto.businessName}. Kami berkomitmen untuk memberikan pelayanan terbaik bagi pelanggan kami.`,
        },
      });

      const landingPage = await tx.landingPage.create({
        data: {
          businessId: business.id,
          slug: uniqueSlug,
        },
      });

      // Populate default sections
      await tx.heroSection.create({
        data: {
          landingPageId: landingPage.id,
          title: `Selamat Datang di ${dto.businessName}`,
          subtitle: `Kami menyediakan solusi ${dto.category} terbaik yang dirancang khusus untuk kenyamanan dan kepuasan Anda.`,
          ctaText: 'Hubungi Kami (WhatsApp)',
        },
      });

      await tx.aboutSection.create({
        data: {
          landingPageId: landingPage.id,
          title: `Tentang ${dto.businessName}`,
          description: `${dto.businessName} didirikan dengan komitmen tinggi untuk menghadirkan kualitas terbaik di industri ${dto.category}. Berbekal dedikasi dan keahlian mendalam, kami berupaya melampaui harapan setiap pelanggan kami.`,
        },
      });

      await tx.seoSetting.create({
        data: {
          landingPageId: landingPage.id,
          metaTitle: `${dto.businessName} - Penyedia Jasa ${dto.category} Terpercaya`,
          metaDescription: `Cari layanan ${dto.category} terbaik? Hubungi ${dto.businessName} untuk pelayanan profesional, terjangkau dan berkualitas tinggi.`,
          metaKeywords: `${dto.category.toLowerCase()}, jasa ${dto.businessName.toLowerCase()}`,
        },
      });

      await tx.domainSetting.create({
        data: {
          landingPageId: landingPage.id,
          customDomain: `${uniqueSlug}.com`,
          status: DomainStatus.PENDING,
        },
      });

      await tx.analytics.create({
        data: {
          landingPageId: landingPage.id,
          views: 0,
        },
      });

      return user;
    });

    return {
      message: 'Registrasi berhasil! Akun Anda telah siap digunakan.',
      userId: newUser.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial salah: Email atau password keliru.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun Anda telah dinonaktifkan oleh Super Admin.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial salah: Email atau password keliru.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: 'Login berhasil!',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        business: {
          include: {
            landingPage: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return user;
  }
}
