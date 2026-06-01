import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Request() req: { user: { id: string; role: string } },
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.productsService.findAll(req.user, targetLandingPageId);
  }

  @Post()
  async create(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: CreateProductDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.productsService.create(req.user, dto, targetLandingPageId);
  }

  @Put(':id')
  async update(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.productsService.update(req.user, id, dto, targetLandingPageId);
  }

  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Query('landingPageId') targetLandingPageId?: string,
  ) {
    return this.productsService.remove(req.user, id, targetLandingPageId);
  }
}
