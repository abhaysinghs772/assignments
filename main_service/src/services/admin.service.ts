import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { CreateAdminBody } from '../dtos';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PermissionService } from './permisssion.service';
import { LoginAdminBody } from '../dtos';

import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';


/**
 * all the business logic admins and super-admin, will be kept here in order to seprate 
 * them from other Users [power users, users, support-desk] of the admin workspace.
 * 
 * this service uses token based authentication.
 */
export class AdminService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly user: Repository<User>,

    private readonly permissionService: PermissionService,
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

  async signUp_SuperAdmin_Or_Admin(body: CreateAdminBody) {
    let { name, email, password, phone_number, role_name } = body;

    // check for existing user with the coming credentials
    const userExist = await this.getUserRepo().findOne({
      // implementing or where clause here by giving each condition as an object
      where: [
            { email: email }, 
            { phone_number: phone_number }
        ],
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
        const superAdminExist = await this.getUserRepo().findOne({
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
        const encryptedPass = await bcrypt.hash(password, 10);
        let superAdmin = new User();
        Object.assign(superAdmin, {
          username,
          name,
          email,
          phone_number,
          role_name,
          password: encryptedPass,
          signUpDate: moment().toDate(),
        });
        // saving permissions for super-admin
        superAdmin =
          await this.permissionService.createPermissions_for_users(superAdmin);

        superAdmin = await this.getUserRepo().save(superAdmin);

        return {
          message: `super admin created successfully, this is your user-name: ${username}, use this for signing in`,
        };
      } catch (error) {
        console.log(
          JSON.stringify({
            type: 'SERVER ERROR',
            error: error.message,
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
        const encryptedPass = await bcrypt.hash(password, 10);
        Object.assign(admin, {
          username,
          name,
          email,
          phone_number,
          role_name,
          password: encryptedPass,
          signUpDate: moment().toDate(),
        });
        // creating permissions for admin
        admin = await this.permissionService.createPermissions_for_users(admin);
        
        admin = await this.getUserRepo().save(admin);

        return {
          message: `admin created successfully, this is your user-name: ${username}, use this for signing in`,
        };
      } catch (error) {
        console.log(
          JSON.stringify({
            type: 'SERVER ERROR',
            error: error.message,
          }),
        );
        throw new HttpException(
          `something went wrong`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async logIn_Admin_Or_SuperAdmin(body: LoginAdminBody) {
    try {
      let { username, password } = body;

      const user = await this.getUserRepo().findOne({
        where: {
          username: username,
        },
      });
      if (!user) {
        throw new HttpException('Invalid user-name', HttpStatus.BAD_REQUEST);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }

      // sign token
      const token = await jwt.sign(
        { user: { ...user } },
        'some-secret-encrypeted',
        {
          expiresIn: '10h',
        },
      );

      return { message: 'successfully logged in', token };
    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          error: error.message,
        }),
      );
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update_Permissions_Of_Admin_And_SuperAdmins(query){
    return this.permissionService.update_Permissions_Of_Admin_And_SuperAdmins(query);
  }

  async create_PowerUser_User(){
    
  }
}
