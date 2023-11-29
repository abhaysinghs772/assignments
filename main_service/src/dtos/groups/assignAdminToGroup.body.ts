import { IsNotEmpty, IsString } from "class-validator";

export class Assign_Admin_To_GroupBody {

    @IsNotEmpty()
    @IsString()
    group_admin: string; // id of group admin

    @IsNotEmpty()
    @IsString()
    group_id: string;
}