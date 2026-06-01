import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong.' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal terdiri dari 6 karakter.' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama bisnis tidak boleh kosong.' })
  businessName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori bisnis tidak boleh kosong.' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp tidak boleh kosong.' })
  whatsappNumber!: string;
}
