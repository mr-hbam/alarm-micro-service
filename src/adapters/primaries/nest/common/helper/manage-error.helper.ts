import { NotFoundError } from '../../../../../core/common/exceptions/not-found.exception';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotAuthorizedError } from '../../../../../core/common/exceptions/not-authorized.exception';

export function manageErrorHelper(err: unknown) {
  if (err instanceof NotFoundError) {
    throw new NotFoundException(err.message);
  } else if (err instanceof NotAuthorizedError) {
    throw new ForbiddenException(err.message);
  }
  throw new InternalServerErrorException();
}
