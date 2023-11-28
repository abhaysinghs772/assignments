import { AdminService } from './admin.service';
import { User } from '../entities';
import { Permission } from '../enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { updatePermissionBody } from '../dtos';
import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  /**
   * in order to create transection Queries to db
   * @returns datasource
   */
  getDataSource() {
    return this.dataSource;
  }

  getUserRepo() {
    return this.user;
  }

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
    Permission.assign_admin_to_group,

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

  private readonly powerUser_role_permissions = [
    // groups
    Permission.viewGroup,

    // trnasection
    Permission.viewTransection,
  ];

  private readonly user_role_permissions = [
    // trnasection
    Permission.createTransection,
    Permission.viewTransection,
    Permission.editTransection,
    Permission.removeTransection,
  ];

  private readonly supportDesk_role_permissions = [
    // trnasection
    Permission.viewTransection,
  ];

  /**
   * this method only updates the permissions related to single user either admin or super admin
   *
   * @param user
   * @returns A Promise that resolves with the user object after creating permissions.
   */
  async createPermissions_for_users(user: User): Promise<User> {
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


  /**
   * 
   * child method of update_Permissions_Of_Admin_And_SuperAdmins
   */
  async subMethod_Update_Permission(role_name: string, permissions){
    try {
      const userExist_with_role_name = await this.getUserRepo().findOne({
        where: {
          role_name: role_name,
        },
      });

      if ( !userExist_with_role_name ) {
        throw new HttpException(`user does not exist with the given role_name: ${role_name}`, HttpStatus.BAD_REQUEST);
      }

      const superAdmin_With_UpdatedPermissions = await this.getUserRepo().update(
        {
          role_name: 'super-admin',
        },
        {
          role_permissions: permissions,
        },
      );
      return {message: `${role_name}'s permissions updated successfully`};
    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          error: error.message,
        }),
      );

      throw new HttpException(`something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * please keep in mind before using this method
   * 1. update the permission.enum as well
   * 2. update the 2 private variables above as well
   *
   */
  async update_Permissions_Of_Admin_And_SuperAdmins(query: updatePermissionBody) {
    try {

      /**
       * for super admins only
       */
      if (query.role_name === 'super-admin'){
        await this.subMethod_Update_Permission(query.role_name, this.super_admin_role_permissions)
      }

      /**
       * for admins only
       */
      if (query.role_name === 'admin'){
        await this.subMethod_Update_Permission(query.role_name, this.admin_role_permissions)
      }

      /**
       * for power-Users only
       */
      if (query.role_name === 'power-user'){
        await this.subMethod_Update_Permission(query.role_name, this.powerUser_role_permissions)
      }

      /**
       * for users only
       */
      if (query.role_name === 'user'){
        await this.subMethod_Update_Permission(query.role_name, this.user_role_permissions)
      }

      /**
       * for support-desk only
       */
      if (query.role_name === 'support-desk'){
        await this.subMethod_Update_Permission(query.role_name, this.supportDesk_role_permissions)
      }

    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          error: error.message,
        }),
      );

      throw new HttpException(`something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
