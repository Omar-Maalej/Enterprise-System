import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getType() === 'http' ? context.switchToHttp().getRequest() : GqlExecutionContext.create(context).getContext().req;
    const request = ctx;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secretKey',
      });
      request['user'] = payload;
      //console.log(request.user);
      if (request.user.role === 'admin') {
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch {
      throw new ForbiddenException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization?.split(' ') ?? [];
    const [type, token] = authorizationHeader;
    return type === 'Bearer' ? token : undefined;
}
}
