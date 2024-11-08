import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { dependencies } from '../../../configurations/dependencies';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { Jwt2FaStrategy } from './auth/strategies/jwt-2fa.strategy';
import { NamespaceJwt2FaStrategy } from './auth/strategies/namespace-jwt-2fa.strategy';
import { CaslModule } from './casl/casl.module';
import { Jwt2faSuperAdminStrategy } from './auth/strategies/jwt-2fa-super-admin.strategy';
import { RolesGuard } from './auth/guards/roles.guard';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { MongoHealthIndicator } from './health/mongodb.health';
import { CacheModule } from '@nestjs/cache-manager';
import { BasicStrategy } from './auth/strategies/basic-auth.strategy';
import alarmDependencies from '../../../configurations/dependencies/alarm';
import { MongoDbClientProvider } from '../../../configurations/mongodb/mongodb-client';
import { AlarmTypesController } from './alarm/alarm.controller';
import { AlarmValidatorService } from './alarm/service/alarm-validator.service';

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
