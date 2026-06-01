import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { SeoService } from './seo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSeoDto } from './dto/update-seo.dto';

@Controller('seo')
@UseGuards(JwtAuthGuard)
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('mine')
  async findMine(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.seoService.findMine(req.user, targetLandingPageId);
  }

  @Put('mine')
  async update(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateSeoDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.seoService.update(req.user, dto, targetLandingPageId);
  }
}
