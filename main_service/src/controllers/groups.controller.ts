import { Controller, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { Permissions_customDecorator } from '../decorators';
import { GroupService } from '../services';
import { PermissionGuard } from '../guards'; // fetch access-guard as well
import { Permission } from '../enums';
import {CreateGroupBody, Assign_Admin_To_GroupBody} from '../dtos';

@Controller('api/v1/bhumio')
export class GroupsController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * only super can create groups
   * aaply permission.guard here in order to check only a super admin can create groups
   * and assign admins to the group
   *
   */
  @Permissions_customDecorator(Permission.createGroup)
  @UseGuards(PermissionGuard)
  @Post('/create-group')
  async createGroup(@Req() req, @Body() body: CreateGroupBody) {
    const {user: triggerd_by} = req;
    return this.groupService.createGroup(triggerd_by, body);
  }

  @Permissions_customDecorator(
    Permission.createGroup,
    Permission.assign_admin_to_group,
  )
  @UseGuards(PermissionGuard)
  @Post('/assign-group')
  async assignAdminToGroup(@Req() req, @Body() body: Assign_Admin_To_GroupBody) {
    const {user: triggerd_by} = req;
    return this.groupService.assignAdminToGroup(triggerd_by, body);
  }
}
