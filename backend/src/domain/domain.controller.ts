import { Controller, Get, Put, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DomainService } from './domain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, DomainStatus } from '@prisma/client';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Controller('domain')
@UseGuards(JwtAuthGuard)
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get('mine')
  async findMine(@Request() req: { user: { id: string } }) {
    return this.domainService.findMine(req.user.id);
  }

  @Put('mine')
  async update(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateDomainDto,
  ) {
    return this.domainService.update(req.user.id, dto);
  }

  // Super Admin: verify/change custom domain status
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':landingPageId/verify')
  async verifyDomain(
    @Param('landingPageId') landingPageId: string,
    @Body('status') status: DomainStatus,
  ) {
    return this.domainService.verifyDomain(landingPageId, status);
  }
}
