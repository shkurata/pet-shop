import { Ability } from '@casl/ability';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthAbility = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Ability => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.ability;
  }
);
