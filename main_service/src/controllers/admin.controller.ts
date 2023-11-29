import { Controller, Post, Body, Put, Query, UseGuards, Req } from '@nestjs/common';
import { AdminService } from '../services';
import { CreateAdminBody, LoginAdminBody, updatePermissionBody } from '../dtos';
import { AccessGuard, PermissionGuard } from 'src/guards';
import { Permissions_customDecorator } from 'src/decorators';
import { Permission } from 'src/enums';

@Controller('/api/v1/bhumio')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * this is s confedential route can only be shared to Super Admin
   * or Admin of the Application
   * @param body
   */
  @Permissions_customDecorator(Permission.createAdmin)
  @Post('/createAdmin-superAdmin')
  async create_SuperAdmin_or_Admin(@Body() body: CreateAdminBody, @Req() req) {
    let { user: triggerd_by } = req;
    return this.adminService.signUp_SuperAdmin_Or_Admin(triggerd_by, body);
  }

  /**
   * as the application grows/scales further, there is high possibility that and admins or a
   * super admin's permissions may also can change, so use this endpoint to update all the required
   * permissions related to either admins or super admin
   *
   */
  @Put('update-permissions')
  async update_Permissions_Of_Admins_And_SuperAdmin(
    @Query() query: updatePermissionBody,
  ): Promise<void> {
    return this.adminService.update_Permissions_Of_Admin_And_SuperAdmins(query);
  }

  /**
   * Only for Super Admin or Admin of the Application
   * @param body
   */
  @Post('/login')
  async login(@Body() body: LoginAdminBody) {
    return this.adminService.logIn_Admin_Or_SuperAdmin(body);
  }

  // @AccessGuard()
  @Permissions_customDecorator(
    Permission.createPowerUser,
    Permission.createUser,
  )
  @UseGuards(PermissionGuard)
  @Post()
  async create_PowerUser_User(@Req() req, @Body() body) {
    let {user: triggerd_by} = req;
    return this.adminService.create_PowerUser_User(req, triggerd_by, body);
  }

  
}