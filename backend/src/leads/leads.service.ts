import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadStatus } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  private async getLandingPageId(userId: string): Promise<string> {
    const business = await this.prisma.business.findUnique({
      where: { userId },
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

  // Public: Submit a new lead
  async submitLead(slug: string, dto: CreateLeadDto) {
    const landingPage = await this.prisma.landingPage.findUnique({
      where: { slug },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page dengan slug "${slug}" tidak ditemukan.`);
    }

    return this.prisma.lead.create({
      data: {
        landingPageId: landingPage.id,
        name: dto.name,
        whatsappNumber: dto.whatsappNumber,
        email: dto.email,
        message: dto.message,
        status: LeadStatus.NEW,
      },
    });
  }

  // Owner: Get own leads
  async findAllMine(userId: string) {
    const landingPageId = await this.getLandingPageId(userId);
    return this.prisma.lead.findMany({
      where: { landingPageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Super Admin: Get all platform leads
  async findAllPlatform() {
    return this.prisma.lead.findMany({
      include: {
        landingPage: {
          select: {
            slug: true,
            business: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Owner: Update lead status
  async updateStatus(userId: string, id: string, status: LeadStatus) {
    const landingPageId = await this.getLandingPageId(userId);
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead tidak ditemukan.');
    }

    if (lead.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke lead ini.');
    }

    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  // Owner: Remove lead
  async remove(userId: string, id: string) {
    const landingPageId = await this.getLandingPageId(userId);
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead tidak ditemukan.');
    }

    if (lead.landingPageId !== landingPageId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke lead ini.');
    }

    await this.prisma.lead.delete({ where: { id } });
    return {
      message: 'Data lead berhasil dihapus.',
    };
  }
}
