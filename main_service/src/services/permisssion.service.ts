import { AdminService } from './admin.service';
import { User } from '../entities';
import { Permission } from '../enums';

export class PermissionService {
  constructor(private readonly adminService: AdminService) {}

  // a super admin must have all the permissions related to their admin workspace
  private readonly super_admin_role_permissions = [
    Permission.createAdmin,
    Permission.createUser,
    Permission.createSupportDesk,
    Permission.createPowerUser,
    Permission.removeAdmin,
    Permission.removeuser,
    Permission.removePoweruser,
    Permission.removeSupportDesk,

    // groups
    Permission.createGroup,
    Permission.editGroup,
    Permission.viewGroup,
    Permission.viewAllGroup,
    Permission.removeGroup,

    // trnasection
    Permission.createTransection,
    Permission.viewTransection,
    Permission.editTransection,
    Permission.removeTransection,
  ];

  private readonly admin_role_permissions = [
    Permission.createUser,
    Permission.createPowerUser,
    Permission.removeuser,
    Permission.removePoweruser,

    // groups
    Permission.viewGroup,

    // trnasection
    Permission.createTransection,
    Permission.viewTransection,
    Permission.editTransection,
    Permission.removeTransection,
  ];

  async createPermissions_for_users(user: User) {
    if (user.role_name === 'super-admin') {
      user.role_permissions = this.super_admin_role_permissions;
      
      // modified in order to prevent extra sql query transection
      return user;
    }

    if (user.role_name === 'admin') {
      user.role_permissions = this.admin_role_permissions;
      return user;
    }
  }
}
