import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from '../services';

@Controller('/api/v1/bhumio')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * this is s confedential route only share with Super Admin
   * or Admin of the Application
   * @param body
   */
  @Post('/createAdmin-admin')
  async create_SuperAdmin_or_Admin(@Body() body) {
    return this.adminService.create_SuperAdmin_Or_Admin(body);
  }
}
