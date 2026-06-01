import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('mine')
  async getProfile(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.businessService.findByUserId(req.user, targetLandingPageId);
  }

  @Put('mine')
  async updateProfile(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateBusinessDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.businessService.update(req.user, dto, targetLandingPageId);
  }
}
