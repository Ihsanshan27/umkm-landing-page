import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp tidak boleh kosong.' })
  whatsappNumber!: string;

  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong.' })
  message!: string;
}
