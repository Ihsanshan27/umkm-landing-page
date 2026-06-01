import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DomainController],
  providers: [DomainService, PrismaService],
})
export class DomainModule {}
