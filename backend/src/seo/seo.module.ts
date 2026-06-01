import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SeoController],
  providers: [SeoService, PrismaService],
})
export class SeoModule {}
