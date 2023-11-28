import { AdminService } from './admin.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginAdminBody } from '../dtos';
import * as bcrypt from 'bcrypt';


/**
 * all the business logic related to other Users [power users, users, support-desk]
 * will be kept here in order to seprate them from super admin or admins of the admin workspace
 * 
 * this service uses session based authentication 
 */
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

}
