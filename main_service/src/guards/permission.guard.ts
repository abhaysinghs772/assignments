import { Injectable , CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities';
import { Permission } from '../enums';

/**
 * permission guard to validate the incoming request based on the required permissions
 */
@Injectable()
export class PermissionGuard implements CanActivate{
    constructor( private readonly reflector: Reflector ){ }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.get<Permission[]>('permissions', context.getHandler());

        console.log(requiredPermissions);

        if (!requiredPermissions) {
            return true; // No specific permissions required, so access is allowed.
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        // Check if the user has the required permissions.
        const hasPermission = user.role_permissions.some((permission) => requiredPermissions.includes(permission));

        return hasPermission;
    }
}