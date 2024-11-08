import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class NamespaceJwtAuthGuard extends AuthGuard('namespace-jwt-2fa') {}
