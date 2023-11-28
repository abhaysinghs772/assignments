import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminBody {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string
}
