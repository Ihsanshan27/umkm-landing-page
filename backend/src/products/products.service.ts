import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
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
    return this.prisma.productService.findMany({
      where: { landingPageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: { id: string; role: string }, dto: CreateProductDto, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    return this.prisma.productService.create({
      data: {
        landingPageId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async update(user: { id: string; role: string }, id: string, dto: UpdateProductDto, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    const product = await this.prisma.productService.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk atau layanan tidak ditemukan.');
    }

    if (product.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke produk ini.');
    }

    return this.prisma.productService.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive !== undefined ? dto.isActive : product.isActive,
      },
    });
  }

  async remove(user: { id: string; role: string }, id: string, targetLandingPageId?: string) {
    const landingPageId = await this.getLandingPageId(user, targetLandingPageId);
    const product = await this.prisma.productService.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk atau layanan tidak ditemukan.');
    }

    if (product.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke produk ini.');
    }

    await this.prisma.productService.delete({ where: { id } });
    return {
      message: 'Produk/layanan berhasil dihapus.',
    };
  }
}
