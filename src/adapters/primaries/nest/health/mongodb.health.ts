import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { MongoDbClientProvider } from '../../../../configurations/mongodb/mongodb-client';

@Injectable()
export class MongoHealthIndicator extends HealthIndicator {
  constructor(private mongoProvider: MongoDbClientProvider) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const client = await this.mongoProvider.getClient();
    const adminDb = client.db('company').admin();
    const serverStatus = await adminDb.command({ ping: 1 });
    const isHealthy = serverStatus?.ok === 1;
    const result = this.getStatus('MONGODB', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('MONGODB failed', result);
  }
}
