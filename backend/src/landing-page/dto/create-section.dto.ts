import { IsString, IsNotEmpty, IsOptional, IsInt, Matches } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Anchor ID hanya boleh berupa huruf kecil, angka, dan tanda hubung (-)' })
  sectionId: string;
}
