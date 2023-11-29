import { IsString, IsNotEmpty } from "class-validator";

export class CreateGroupBody {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}