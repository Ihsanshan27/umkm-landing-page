import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama bisnis tidak boleh kosong.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori bisnis tidak boleh kosong.' })
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  googleMapsUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp tidak boleh kosong.' })
  whatsappNumber!: string;

  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  openHours?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  tiktok?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  whatsappTemplate?: string;

  @IsOptional()
  showWhatsAppOrder?: boolean;
}
