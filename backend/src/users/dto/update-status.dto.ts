import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsBoolean({ message: 'Status aktif harus berupa true atau false.' })
  @IsNotEmpty({ message: 'Status aktif tidak boleh kosong.' })
  isActive!: boolean;
}
