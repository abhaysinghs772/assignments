import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from '../services';
import { CreateAdminBody , LoginAdminBody} from '../dtos';

@Controller('/api/v1/bhumio')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * this is s confedential route can only be shared to Super Admin
   * or Admin of the Application
   * @param body
   */
  @Post('/createAdmin-admin')
  async create_SuperAdmin_or_Admin(@Body() body: CreateAdminBody) {
    return this.adminService.create_SuperAdmin_Or_Admin(body);
  }

  /**
   * Only for Super Admin or Admin of the Application
   * @param body
   */
  @Post('/login')
  async login(@Body() body: LoginAdminBody) {
      return this.adminService.logIn_Admin_Or_SuperAdmin(body);
  }
}