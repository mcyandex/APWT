import { Injectable, CanActivate, ExecutionContext } from
    '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class SessionAdminGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.session.user !== undefined && request.session.user.userType == 'admin';
    }
}
