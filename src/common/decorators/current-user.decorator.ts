import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/maintenance/user/types/user.types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
