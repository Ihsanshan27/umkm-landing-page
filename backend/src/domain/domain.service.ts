import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainStatus } from '@prisma/client';

@Injectable()
export class DomainService {
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

  async findMine(userId: string) {
    const landingPageId = await this.getLandingPageId(userId);
    return this.prisma.domainSetting.findUnique({
      where: { landingPageId },
    });
  }

  async update(userId: string, dto: UpdateDomainDto) {
    const landingPageId = await this.getLandingPageId(userId);

    return this.prisma.domainSetting.upsert({
      where: { landingPageId },
      update: {
        customDomain: dto.customDomain,
        status: DomainStatus.PENDING, // Resets to pending for admin verification
      },
      create: {
        landingPageId,
        customDomain: dto.customDomain,
        status: DomainStatus.PENDING,
      },
    });
  }

  // Super Admin: Update domain status
  async verifyDomain(landingPageId: string, status: DomainStatus) {
    const domain = await this.prisma.domainSetting.findUnique({
      where: { landingPageId },
    });

    if (!domain) {
      throw new NotFoundException('Pengaturan domain kustom tidak ditemukan.');
    }

    return this.prisma.domainSetting.update({
      where: { landingPageId },
      data: { status },
    });
  }
}
