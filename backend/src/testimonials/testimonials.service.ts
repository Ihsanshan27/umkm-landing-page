import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Injectable()
export class TestimonialsService {
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
    return this.prisma.testimonial.findMany({
      where: { landingPageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: { id: string; role: string }, dto: CreateTestimonialDto, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    return this.prisma.testimonial.create({
      data: {
        landingPageId,
        name: dto.name,
        content: dto.content,
        avatarUrl: dto.avatarUrl,
        rating: dto.rating !== undefined ? dto.rating : 5,
      },
    });
  }

  async remove(user: { id: string; role: string }, id: string, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimoni tidak ditemukan.');
    }

    if (testimonial.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke testimoni ini.');
    }

    await this.prisma.testimonial.delete({ where: { id } });
    return {
      message: 'Testimoni berhasil dihapus.',
    };
  }
}
