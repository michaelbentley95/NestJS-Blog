import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MinLength(4)
    email: string;

    @IsString()
    @MinLength(4)
    password: string;
}

export class RegisterDTO extends LoginDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
}

export class UpdateUserDTO {

    @IsEmail()
    @IsString()
    @MinLength(4)
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    bio: string;

    @IsString()
    @IsOptional()
    image: string;
}

export interface AuthPayload {
    username: string;
}

