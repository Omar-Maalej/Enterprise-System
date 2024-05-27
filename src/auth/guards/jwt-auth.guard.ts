import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //console.log("Hello", context.getType());
    const ctx = context.getType() === 'http' ? context.switchToHttp().getRequest() : GqlExecutionContext.create(context).getContext().req;
    const request = ctx;
    //console.log("Request Headers:", request.headers);

    const token = this.extractTokenFromHeader(request);
    //console.log("req", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secretKey',
      });
      //console.log("payload", payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization?.split(' ') ?? [];
    //console.log("authorizationHeader", authorizationHeader);
    const [type, token] = authorizationHeader
    return type === 'Bearer' ? token : undefined;
}
}
