import { Controller, Post, Query, Body , UseGuards } from '@nestjs/common';
import {Permissions_customDecorator} from '../decorators';
import { GroupService } from '../services';
import { PermissionGuard } from '../guards'; // fetch access-guard as well
import { Permission } from '../enums';

@Controller('api/v1/bhumio')
export class GroupsController {
    constructor( private readonly groupService: GroupService){ }


  /**
   * only super can create groups
   * aaply permission.guard here in order to check only a super admin can create groups
   * and assign admins to the group
   *
   */
  @Permissions_customDecorator(Permission.createGroup)
  @UseGuards(PermissionGuard)
  @Post('/create-group')
  async createGroup() {
    // return this.group
  }
}
