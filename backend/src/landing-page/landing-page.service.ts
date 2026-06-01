import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { Role } from '@prisma/client';

@Injectable()
export class LandingPageService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const landingPage = await this.prisma.landingPage.findUnique({
      where: { slug },
      include: {
        business: true,
        heroSection: true,
        aboutSection: true,
        products: {
          where: { isActive: true }, // Only public active products
        },
        galleryItems: true,
        testimonials: true,
        seoSetting: true,
        domainSetting: true,
        customSections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page dengan slug "${slug}" tidak ditemukan.`);
    }

    // Increment View Count asynchronously or directly
    await this.prisma.analytics.update({
      where: { landingPageId: landingPage.id },
      data: {
        views: {
          increment: 1,
        },
      },
    }).catch((err) => {
      console.error('Failed to increment view analytics', err);
    });

    return landingPage;
  }

  async findAll() {
    return this.prisma.landingPage.findMany({
      include: {
        business: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        analytics: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserId(userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { userId },
    });

    if (!business) {
      throw new NotFoundException('Data bisnis untuk user ini tidak ditemukan.');
    }

    const landingPage = await this.prisma.landingPage.findUnique({
      where: { businessId: business.id },
      include: {
        heroSection: true,
        aboutSection: true,
        seoSetting: true,
        domainSetting: true,
        analytics: true,
        customSections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!landingPage) {
      throw new NotFoundException('Landing page tidak ditemukan.');
    }

    return landingPage;
  }

  async getMine(user: { id: string; role: string }, targetLandingPageId?: string) {
    if (user.role === Role.SUPER_ADMIN && targetLandingPageId) {
      const landingPage = await this.prisma.landingPage.findUnique({
        where: { id: targetLandingPageId },
        include: {
          heroSection: true,
          aboutSection: true,
          seoSetting: true,
          domainSetting: true,
          analytics: true,
          customSections: {
            orderBy: { order: 'asc' },
          },
        },
      });
      if (!landingPage) {
        throw new NotFoundException('Landing page tidak ditemukan.');
      }
      if (!landingPage.allowAdminEdit) {
        throw new ForbiddenException('Akses ditolak: Bantuan akses admin belum diaktifkan oleh pemilik toko.');
      }
      return landingPage;
    }
    return this.findByUserId(user.id);
  }

  async getEditableLandingPage(user: { id: string; role: string }, targetLandingPageId?: string) {
    if (user.role === Role.SUPER_ADMIN && targetLandingPageId) {
      const landingPage = await this.prisma.landingPage.findUnique({
        where: { id: targetLandingPageId },
      });
      if (!landingPage) {
        throw new NotFoundException('Landing page tidak ditemukan.');
      }
      if (!landingPage.allowAdminEdit) {
        throw new ForbiddenException('Akses ditolak: Bantuan akses admin belum diaktifkan oleh pemilik toko.');
      }
      return landingPage;
    }
    return this.findByUserId(user.id);
  }

  async updateAdminConsent(userId: string, allowAdminEdit: boolean) {
    const business = await this.prisma.business.findUnique({
      where: { userId },
    });
    if (!business) {
      throw new NotFoundException('Data bisnis untuk user ini tidak ditemukan.');
    }
    return this.prisma.landingPage.update({
      where: { businessId: business.id },
      data: { allowAdminEdit },
    });
  }

  async updateHero(user: { id: string; role: string }, dto: UpdateHeroDto, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);

    return this.prisma.heroSection.upsert({
      where: { landingPageId: landingPage.id },
      update: {
        title: dto.title,
        subtitle: dto.subtitle,
        imageUrl: dto.imageUrl,
        ctaText: dto.ctaText,
        ctaLink: dto.ctaLink,
      },
      create: {
        landingPageId: landingPage.id,
        title: dto.title,
        subtitle: dto.subtitle,
        imageUrl: dto.imageUrl,
        ctaText: dto.ctaText,
        ctaLink: dto.ctaLink,
      },
    });
  }

  async updateAbout(user: { id: string; role: string }, dto: UpdateAboutDto, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);

    return this.prisma.aboutSection.upsert({
      where: { landingPageId: landingPage.id },
      update: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
      create: {
        landingPageId: landingPage.id,
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async updateTheme(user: { id: string; role: string }, themeColor: string, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);

    return this.prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { themeColor },
    });
  }

  async updateCustomNav(user: { id: string; role: string }, customNavItems: any[], targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    return this.prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { customNavItems },
    });
  }

  async updateCatalogLayout(user: { id: string; role: string }, catalogLayout: number, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    const rows = Math.max(1, Math.min(3, catalogLayout)); // Clamp 1-3
    return this.prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { catalogLayout: rows },
    });
  }

  async getSections(user: { id: string; role: string }, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    return this.prisma.customSection.findMany({
      where: { landingPageId: landingPage.id },
      orderBy: { order: 'asc' },
    });
  }

  async createSection(user: { id: string; role: string }, dto: CreateSectionDto, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    const count = await this.prisma.customSection.count({
      where: { landingPageId: landingPage.id },
    });
    return this.prisma.customSection.create({
      data: {
        landingPageId: landingPage.id,
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl || null,
        sectionId: dto.sectionId,
        order: dto.order !== undefined ? dto.order : count,
      },
    });
  }

  async updateSection(user: { id: string; role: string }, id: string, dto: CreateSectionDto, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    const section = await this.prisma.customSection.findFirst({
      where: { id, landingPageId: landingPage.id },
    });
    if (!section) {
      throw new NotFoundException('Seksi kustom tidak ditemukan.');
    }
    return this.prisma.customSection.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : section.imageUrl,
        sectionId: dto.sectionId,
        order: dto.order !== undefined ? dto.order : section.order,
      },
    });
  }

  async deleteSection(user: { id: string; role: string }, id: string, targetLandingPageId?: string) {
    const landingPage = await this.getEditableLandingPage(user, targetLandingPageId);
    const section = await this.prisma.customSection.findFirst({
      where: { id, landingPageId: landingPage.id },
    });
    if (!section) {
      throw new NotFoundException('Seksi kustom tidak ditemukan.');
    }
    return this.prisma.customSection.delete({
      where: { id },
    });
  }
}

