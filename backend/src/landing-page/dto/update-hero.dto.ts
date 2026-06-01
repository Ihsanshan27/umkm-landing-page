import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateHeroDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul Hero tidak boleh kosong.' })
  title!: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Teks CTA tidak boleh kosong.' })
  ctaText!: string;

  @IsString()
  @IsOptional()
  ctaLink?: string;
}
