import { Role } from '@app/common/enums/roles.enum';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Role>('roles', [
            context.getHandler(),
        ]);
        const { user } = context.switchToHttp().getRequest();
        return requiredRole ? user?.role === requiredRole : true;
    }
}
