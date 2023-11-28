import { Permission } from '../enums';
import { SetMetadata } from '@nestjs/common';

export const Permissions_customDecorator = (...permissions: Permission[]) => SetMetadata('permissions', permissions);