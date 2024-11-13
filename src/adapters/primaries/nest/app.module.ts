import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { dependencies } from '../../../configurations/dependencies';
import alarmDependencies from '../../../configurations/dependencies/alarm';
import { MongoDbClientProvider } from '../../../configurations/mongodb/mongodb-client';
import { AlarmTypesController } from './alarm/alarm.controller';
import { AlarmValidatorService } from './alarm/service/alarm-validator.service';
import { AppController } from './app.controller';
import { RolesGuard } from './auth/guards/roles.guard';
import { BasicStrategy } from './auth/strategies/basic-auth.strategy';
import { Jwt2faSuperAdminStrategy } from './auth/strategies/jwt-2fa-super-admin.strategy';
import { Jwt2FaStrategy } from './auth/strategies/jwt-2fa.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { NamespaceJwt2FaStrategy } from './auth/strategies/namespace-jwt-2fa.strategy';
import { CaslModule } from './casl/casl.module';
import { HealthController } from './health/health.controller';
import { MongoHealthIndicator } from './health/mongodb.health';

@Module({
  controllers: [AppController, AlarmTypesController, HealthController],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: '5m',
      },
    }),
    CaslModule,
    TerminusModule,
    CacheModule.register(),
  ],
  providers: [
    MongoDbClientProvider,
    ...dependencies,
    ...alarmDependencies,
    AlarmValidatorService,
    JwtStrategy,
    Jwt2FaStrategy,
    NamespaceJwt2FaStrategy,
    Jwt2faSuperAdminStrategy,
    RolesGuard,
    BasicStrategy,
    MongoHealthIndicator,
  ],
})
export class AppModule {}
