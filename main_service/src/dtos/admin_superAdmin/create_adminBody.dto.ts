import {IsString, IsEmail, IsOptional, IsNotEmpty, IsNumberString} from 'class-validator';

export class CreateAdminBody {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsNumberString()
    phone_number: string;
    
    @IsNotEmpty()
    @IsString()
    role_name: string; 

    @IsOptional()
    @IsString()
    group_id: string; 

    @IsOptional()
    @IsString()
    group_name: string;
}