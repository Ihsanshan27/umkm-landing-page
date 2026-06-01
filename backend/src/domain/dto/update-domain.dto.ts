import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDomainDto {
  @IsString()
  @IsNotEmpty({ message: 'Domain kustom tidak boleh kosong.' })
  customDomain!: string;
}
