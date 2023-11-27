import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { CreateAdminBody } from '../dtos';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PermissionService } from './permisssion.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export class AdminService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly user: Repository<User>,

    private readonly permissionService: PermissionService,
  ) {}

  /**
   * in order to create transextion Queries to db
   * @returns datasource
   */
  getDataSource() {
    return this.dataSource;
  }

  getUserRepo() {
    return this.user;
  }

  async create_SuperAdmin_Or_Admin(body: CreateAdminBody) {
    let { name, email, password, phone_number, role_name } = body;

    // check for existing user with the coming credentials
    const userExist = await this.getUserRepo().find({
      where: {
        email: email,
        phone_number: phone_number,
      },
    });

    if (userExist) {
      throw new HttpException(
        `${role_name} already exist with the provided credentials`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if super Admin already exists or not
    // if not then proceed
    // else throw exception
    if (role_name === 'super-admin') {
      try {
        const superAdminExist = await this.getUserRepo().find({
          where: {
            role_name: role_name,
          },
        });

        if (superAdminExist)
          throw new HttpException(
            `cant't create more then one super admin`,
            HttpStatus.BAD_REQUEST,
          );

        // email = xyzSomeString@email.com => username = xyzSomeString
        const username = email.split('@')[0];
        const encryptedPass = bcrypt.hash(password, 10);
        let superAdmin = new User();
        Object.assign(superAdmin, {
          username,
          name,
          email,
          phone_number,
          role_name,
          encryptedPass,
          signUpDate: moment().toDate(),
        });
        superAdmin = await this.getUserRepo().save(superAdmin);

        // saving permissions for super-admin
        await this.permissionService.createPermissions_for_users(superAdmin);

        return {
          message: `super admin created successfully, this is your user-name: ${username}, use this for signing in`,
        };
      } catch (error) {
        console.log(
          JSON.stringify({
            type: 'SERVER ERROR',
            error: error,
          }),
        );

        throw new HttpException(
          `something went wrong`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (role_name === 'admin') {
      try {
        const username = email.split('@')[0];
        let admin = new User();
        const encryptedPass = bcrypt.hash(password, 10);
        Object.assign(admin, {
          username,
          name,
          email,
          phone_number,
          role_name,
          encryptedPass,
          signUpDate: moment().toDate(),
        });
        admin = await this.getUserRepo().save(admin);

        // creating permissions for admin
        await this.permissionService.createPermissions_for_users(admin);

        return {
          message: `admin created successfully, this is your user-name: ${username}, use this for signing in`,
        };
      } catch (error) {
        console.log(
            JSON.stringify({
              type: 'SERVER ERROR',
              error: error,
            }),
        );
        throw new HttpException(
            `something went wrong`,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}