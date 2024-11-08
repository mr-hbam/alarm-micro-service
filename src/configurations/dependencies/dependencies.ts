import { MongoDbClientProvider } from '../mongodb/mongodb-client';
import { MongoDbProvider } from './providers/mongo.provider';

export const dependencies: any[] = [
  MongoDbProvider(new MongoDbClientProvider()),
];
