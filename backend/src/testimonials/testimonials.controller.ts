import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Controller('testimonials')
@UseGuards(JwtAuthGuard)
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async findAll(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.testimonialsService.findAll(req.user, targetLandingPageId);
  }

  @Post()
  async create(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: CreateTestimonialDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.testimonialsService.create(req.user, dto, targetLandingPageId);
  }

  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.testimonialsService.remove(req.user, id, targetLandingPageId);
  }
}
