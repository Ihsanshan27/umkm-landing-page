import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
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

  async findAll(user: { id: string; role: string }, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    return this.prisma.galleryItem.findMany({
      where: { landingPageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: { id: string; role: string }, dto: CreateGalleryDto, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    return this.prisma.galleryItem.create({
      data: {
        landingPageId,
        imageUrl: dto.imageUrl,
        caption: dto.caption,
      },
    });
  }

  async remove(user: { id: string; role: string }, id: string, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    const item = await this.prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Gambar galeri tidak ditemukan.');
    }

    if (item.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke gambar ini.');
    }

    await this.prisma.galleryItem.delete({ where: { id } });
    return {
      message: 'Gambar galeri berhasil dihapus.',
    };
  }
}
