import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong.' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal terdiri dari 6 karakter.' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong.' })
  password!: string;
}
