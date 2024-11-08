import { Provider } from '@nestjs/common';
import { MongoDbClientProvider } from '../../mongodb/mongodb-client';

export const MongoDbProvider = (
  mongodbClientProvider: MongoDbClientProvider,
): Provider => ({
  provide: MongoDbClientProvider,
  useValue: mongodbClientProvider,
});
