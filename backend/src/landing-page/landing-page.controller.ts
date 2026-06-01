import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // Public: View public landing page by slug
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.landingPageService.findBySlug(slug);
  }

  // Super Admin: Get all landing pages for overview
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('all')
  async getAll() {
    return this.landingPageService.findAll();
  }

  // Owner: Fetch own landing page structure
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async getMine(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.getMine(req.user, targetLandingPageId);
  }

  // Owner: Update Hero section
  @UseGuards(JwtAuthGuard)
  @Put('hero')
  async updateHero(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateHeroDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateHero(req.user, dto, targetLandingPageId);
  }

  // Owner: Update About section
  @UseGuards(JwtAuthGuard)
  @Put('about')
  async updateAbout(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateAboutDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateAbout(req.user, dto, targetLandingPageId);
  }

  // Owner: Update Theme color preset
  @UseGuards(JwtAuthGuard)
  @Put('theme')
  async updateTheme(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateThemeDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateTheme(req.user, dto.themeColor, targetLandingPageId);
  }

  // Owner: Toggle allowAdminEdit consent
  @UseGuards(JwtAuthGuard)
  @Put('allow-admin-edit')
  async updateAdminConsent(
    @Request() req: { user: { id: string } },
    @Body() dto: { allowAdminEdit: boolean },
  ) {
    return this.landingPageService.updateAdminConsent(req.user.id, dto.allowAdminEdit);
  }

  // Owner: Update custom navigation items
  @UseGuards(JwtAuthGuard)
  @Put('custom-nav')
  async updateCustomNav(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: { customNavItems: any[] },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateCustomNav(req.user, dto.customNavItems, targetLandingPageId);
  }

  // Owner: Update catalog layout (rows)
  @UseGuards(JwtAuthGuard)
  @Put('catalog-layout')
  async updateCatalogLayout(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: { catalogLayout: number },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateCatalogLayout(req.user, dto.catalogLayout, targetLandingPageId);
  }

  // Owner: Get all custom sections
  @UseGuards(JwtAuthGuard)
  @Get('sections')
  async getSections(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.getSections(req.user, targetLandingPageId);
  }

  // Owner: Create custom section
  @UseGuards(JwtAuthGuard)
  @Post('sections')
  async createSection(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: CreateSectionDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.createSection(req.user, dto, targetLandingPageId);
  }

  // Owner: Update custom section
  @UseGuards(JwtAuthGuard)
  @Put('sections/:id')
  async updateSection(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Body() dto: CreateSectionDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.updateSection(req.user, id, dto, targetLandingPageId);
  }

  // Owner: Delete custom section
  @UseGuards(JwtAuthGuard)
  @Delete('sections/:id')
  async deleteSection(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.landingPageService.deleteSection(req.user, id, targetLandingPageId);
  }
}

