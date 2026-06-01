import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul About tidak boleh kosong.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong.' })
  description!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
