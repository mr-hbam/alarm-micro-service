import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { MongoCollections } from '../../adapters/secondary/common/mongodb/collections';
import INDEXES from '../mongodb/indexes';
import { getMongoDbConnectionString } from './mongodb.config';

@Injectable()
export class MongoDbClientProvider {
  private client: MongoClient | null = null;
  private collectionsName = [];

  constructor() {
    this.collectionsName = [
      MongoCollections.USER,
      MongoCollections.DEVICE,
      MongoCollections.HISTORY,
      MongoCollections.STOP,
      MongoCollections.OPERATOR_ASSIGNMENT,
      MongoCollections.ALARM,
    ];
  }

  async connect() {
    try {
      const mongoUri = getMongoDbConnectionString();
      this.client = await MongoClient.connect(mongoUri);
    } catch (e) {
      throw e;
    }

    await this.initIndexes();
  }

  async getCollection(collection: string) {
    const DB_NAME = process.env.DB_NAME;
    if (this.client === null) {
      await this.connect();
    }

    return this.client.db(DB_NAME).collection(collection);
  }

  async getClient() {
    if (this.client === null) {
      await this.connect();
    }

    return this.client;
  }

  async createSession() {
    if (this.client === null) {
      await this.connect();
    }
    return this.client.startSession();
  }

  //------ CONFIG ------//
  private async getListIndexes(collection: string) {
    const DB_NAME = process.env.DB_NAME;
    return this.client
      .db(DB_NAME)
      .collection(collection)
      .listIndexes()
      .toArray();
  }

  private async createIndex(
    collection: string,
    payload: {
      key: Record<string, any>;
      unique?: boolean;
      expireAfterSeconds?: number;
      name: string;
    }[],
  ) {
    const DB_NAME = process.env.DB_NAME;
    try {
      await this.client
        .db(DB_NAME)
        .collection(collection)
        .createIndexes(payload);
    } catch (e) {}
  }

  private async initIndexes() {
    for (const collection of this.collectionsName) {
      const indexes = INDEXES?.[collection];
      if (indexes) {
        await this.createIndex(collection, INDEXES[collection]);
      }
    }
  }
}
