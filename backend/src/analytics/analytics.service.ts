import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
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

  // Owner: Get own detailed analytics
  async getMine(userId: string) {
    const landingPageId = await this.getLandingPageId(userId);

    const analyticsRecord = await this.prisma.analytics.findUnique({
      where: { landingPageId },
    });
    const totalViews = analyticsRecord ? analyticsRecord.views : 0;

    const totalLeads = await this.prisma.lead.count({
      where: { landingPageId },
    });

    const activeProducts = await this.prisma.productService.count({
      where: {
        landingPageId,
        isActive: true,
      },
    });

    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0.0;

    return {
      totalViews,
      totalLeads,
      activeProducts,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  }

  // Super Admin: Get platform wide analytics
  async getPlatformStats() {
    const totalOwners = await this.prisma.user.count({
      where: { role: 'OWNER' },
    });

    const totalLandingPages = await this.prisma.landingPage.count();

    const aggregateViews = await this.prisma.analytics.aggregate({
      _sum: {
        views: true,
      },
    });
    const totalViews = aggregateViews._sum.views || 0;

    const totalLeads = await this.prisma.lead.count();

    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0.0;

    return {
      totalOwners,
      totalLandingPages,
      totalViews,
      totalLeads,
      averageConversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  }
}
