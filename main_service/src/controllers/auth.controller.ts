import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from 'src/services';
import { LoginAdminBody } from '../dtos';

@Controller('/api/v1/bhumio')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}    
}