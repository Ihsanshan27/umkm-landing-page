import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama customer tidak boleh kosong.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Isi testimoni tidak boleh kosong.' })
  content!: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsNumber({}, { message: 'Rating harus berupa angka.' })
  @Min(1, { message: 'Rating minimal 1.' })
  @Max(5, { message: 'Rating maksimal 5.' })
  @IsOptional()
  rating?: number;
}
