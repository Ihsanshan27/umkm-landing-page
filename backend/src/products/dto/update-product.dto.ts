import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk/layanan tidak boleh kosong.' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Harga harus berupa angka.' })
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean({ message: 'Status keaktifan harus berupa true atau false.' })
  @IsOptional()
  isActive?: boolean;
}
