import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserDec = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const contextType = ctx.getType();
    console.log("contextType:", contextType);
    if (contextType === 'http') {
      // For REST API
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    } else  {
      // For GraphQL
      const gqlContext = GqlExecutionContext.create(ctx);
      const request = gqlContext.getContext().req;
      //console.log("request:", request)
      return request.user;
    }
  },
);
