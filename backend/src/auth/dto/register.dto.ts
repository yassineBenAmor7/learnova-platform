import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide' })
  @Matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i, {
    message: 'Seules les adresses de confiance (Gmail, Outlook, Hotmail, Yahoo, iCloud) sont autorisées',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
