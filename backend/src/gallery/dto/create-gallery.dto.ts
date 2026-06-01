import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty({ message: 'URL gambar tidak boleh kosong.' })
  imageUrl!: string;

  @IsString()
  @IsOptional()
  caption?: string;
}
