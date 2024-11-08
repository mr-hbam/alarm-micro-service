import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwoFaJwtAuthGuard extends AuthGuard('jwt-2fa') {}
