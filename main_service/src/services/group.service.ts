import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { User, Group } from '../entities';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateGroupBody, Assign_Admin_To_GroupBody } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';

export class GroupService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Group)
    private readonly Group: Repository<Group>,

    @Inject('NOTIFICATION_SERVICE')
    private readonly NOTIFICATION_SERVICE: ClientProxy,
  ) {}

  getDatSource() {
    return this.dataSource;
  }

  getUserRepo() {
    return this.user;
  }

  getGroupRepo() {
    return this.Group;
  }

  async createGroup(triggerd_by: User, body: CreateGroupBody) {
    try {
      let { name, description } = body;

      let groupBody = new Group();
      Object.assign(groupBody, {
        name,
        description: description ? description : null,
        created_by: triggerd_by.id,
      });

      groupBody = await this.getGroupRepo().save(groupBody);

      return { message: `successfully created Group`, group: groupBody };
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

  async assignAdminToGroup(triggerd_by: User, body: Assign_Admin_To_GroupBody) {
    try {
      let created_by = triggerd_by.id;
      let { group_admin, group_id } = body;

      let isGroupExist = await this.getGroupRepo().findOne({
        where: {
          created_by: created_by as FindOptionsWhere<User>,
          id: group_id,
        },
      });

      if (!isGroupExist) {
        throw new HttpException(
          `group doesn't exist !`,
          HttpStatus.BAD_REQUEST,
        );
      }

      let updatedGroup = new Group(group_id);
      Object.assign(updatedGroup, {
        group_members: [group_admin],
      });

      updatedGroup = await this.getGroupRepo().save(updatedGroup);

      // trigger a mail to admin that he has been assigned to new group: groupDetails
      let admin = await this.getUserRepo().findOne({
        where: {
          id: group_admin
        }
      })
      let payload = {
        to: admin.email,
        subject: `[Assigned] [New Group]`,
        text: `you have been assined to a new group: ${updatedGroup.name}`
      };
      this.NOTIFICATION_SERVICE.emit('send-email', payload);

      return {
        message: `admin successfully assigned to  Group`,
        group: updatedGroup,
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
