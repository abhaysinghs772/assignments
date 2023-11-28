import {IsString, IsNotEmpty} from 'class-validator';

export class updatePermissionBody {
    
    @IsNotEmpty()
    @IsString()
    role_name: "super-admin" | "admin" | "power-user" | "user" | "support-desk"
}