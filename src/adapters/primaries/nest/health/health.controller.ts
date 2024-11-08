import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MongoHealthIndicator } from './mongodb.health';

@Controller('healthz')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoHealthIndicator: MongoHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([() => this.mongoHealthIndicator.isHealthy()]);
  }
}
