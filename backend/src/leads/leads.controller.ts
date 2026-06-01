import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Public: Submit lead form from public landing page
  @Post('submit/:slug')
  async submitLead(
    @Param('slug') slug: string,
    @Body() dto: CreateLeadDto,
  ) {
    return this.leadsService.submitLead(slug, dto);
  }

  // Owner: Get own incoming leads
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async getMine(@Request() req: { user: { id: string } }) {
    return this.leadsService.findAllMine(req.user.id);
  }

  // Super Admin: Get all leads on the platform
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('all')
  async getAllPlatform() {
    return this.leadsService.findAllPlatform();
  }

  // Owner: Update status of a lead
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(req.user.id, id, dto.status);
  }

  // Owner: Delete a lead
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.leadsService.remove(req.user.id, id);
  }
}
