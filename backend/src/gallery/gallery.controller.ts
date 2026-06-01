import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Controller('gallery')
@UseGuards(JwtAuthGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async findAll(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.galleryService.findAll(req.user, targetLandingPageId);
  }

  @Post()
  async create(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: CreateGalleryDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.galleryService.create(req.user, dto, targetLandingPageId);
  }

  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.galleryService.remove(req.user, id, targetLandingPageId);
  }
}
