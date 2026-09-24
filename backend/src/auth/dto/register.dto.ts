import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @Matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i, {
    message: 'Only trusted email addresses (Gmail, Outlook, Hotmail, Yahoo, iCloud) are allowed',
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
