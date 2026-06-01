import { IsEnum, IsNotEmpty } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus, { message: 'Status lead tidak valid. Pilih dari: NEW, CONTACTED, CONVERTED, REJECTED.' })
  @IsNotEmpty({ message: 'Status tidak boleh kosong.' })
  status!: LeadStatus;
}
