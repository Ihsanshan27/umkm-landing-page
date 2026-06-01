import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  private async getBusinessEntity(user: { id: string; role: string }, targetLandingPageId?: string) {
    if (user.role === 'SUPER_ADMIN' && targetLandingPageId) {
      const landingPage = await this.prisma.landingPage.findUnique({
        where: { id: targetLandingPageId },
        include: { business: true },
      });
      if (!landingPage) {
        throw new NotFoundException('Landing page tidak ditemukan.');
      }
      if (!landingPage.allowAdminEdit) {
        throw new ForbiddenException('Akses ditolak: Bantuan akses admin belum diaktifkan oleh pemilik toko.');
      }
      return landingPage.business;
    }

    const business = await this.prisma.business.findUnique({
      where: { userId: user.id },
    });
    if (!business) {
      throw new NotFoundException('Data profil bisnis tidak ditemukan.');
    }
    return business;
  }

  async findByUserId(user: { id: string; role: string }, targetLandingPageId?: string) {
    const businessEntity = await this.getBusinessEntity(user, targetLandingPageId);
    
    const business = await this.prisma.business.findUnique({
      where: { id: businessEntity.id },
      include: {
        landingPage: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Data profil bisnis tidak ditemukan.');
    }

    return business;
  }

  async update(user: { id: string; role: string }, dto: UpdateBusinessDto, targetLandingPageId?: string) {
    const businessEntity = await this.getBusinessEntity(user, targetLandingPageId);

    return this.prisma.business.update({
      where: { id: businessEntity.id },
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        address: dto.address,
        googleMapsUrl: dto.googleMapsUrl,
        whatsappNumber: dto.whatsappNumber,
        email: dto.email,
        logo: dto.logo,
        openHours: dto.openHours,
        instagram: dto.instagram,
        tiktok: dto.tiktok,
        facebook: dto.facebook,
        whatsappTemplate: dto.whatsappTemplate,
        showWhatsAppOrder: dto.showWhatsAppOrder !== undefined ? dto.showWhatsAppOrder : true,
      },
    });
  }
}
