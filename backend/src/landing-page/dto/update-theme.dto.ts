import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateThemeDto {
  @IsString()
  @IsNotEmpty({ message: 'Tema warna tidak boleh kosong.' })
  themeColor!: string;
}
