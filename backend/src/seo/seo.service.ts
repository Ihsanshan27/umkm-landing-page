import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  private async getLandingPageId(user: { id: string; role: string }, targetLandingPageId?: string): Promise<string> {
    if (user.role === 'SUPER_ADMIN' && targetLandingPageId) {
      const landingPage = await this.prisma.landingPage.findUnique({
        where: { id: targetLandingPageId },
      });
      if (!landingPage) {
        throw new NotFoundException('Landing page tidak ditemukan.');
      }
      if (!landingPage.allowAdminEdit) {
        throw new ForbiddenException('Akses ditolak: Bantuan akses admin belum diaktifkan oleh pemilik toko.');
      }
      return landingPage.id;
    }

    const business = await this.prisma.business.findUnique({
      where: { userId: user.id },
    });
    if (!business) {
      throw new NotFoundException('Data bisnis untuk user ini tidak ditemukan.');
    }
    const landingPage = await this.prisma.landingPage.findUnique({
      where: { businessId: business.id },
    });
    if (!landingPage) {
      throw new NotFoundException('Landing page tidak ditemukan.');
    }
    return landingPage.id;
  }

  async findMine(user: { id: string; role: string }, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    return this.prisma.seoSetting.findUnique({
      where: { landingPageId },
    });
  }

  async update(user: { id: string; role: string }, dto: UpdateSeoDto, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);

    return this.prisma.seoSetting.upsert({
      where: { landingPageId },
      update: {
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        ogImage: dto.ogImage,
      },
      create: {
        landingPageId,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        ogImage: dto.ogImage,
      },
    });
  }
}
