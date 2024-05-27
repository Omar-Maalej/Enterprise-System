import { Injectable } from '@nestjs/common';
import { InjectRedisClient } from 'nestjs-ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedisClient() private readonly redisClient: Redis) {}

  async addConnection(userId: string, clientId: string): Promise<void> {
    await this.redisClient.sadd(`user:${userId}:sockets`, clientId);
  }

  async removeConnection(userId: string, clientId: string): Promise<void> {
    await this.redisClient.srem(`user:${userId}:sockets`, clientId);
  }

  async getConnections(userId: string): Promise<string[]> {
    return await this.redisClient.smembers(`user:${userId}:sockets`);
  }

  async getAllConnections(): Promise<string[]> {
    const userIds = await this.redisClient.keys('user:*:sockets');
    console.log('userIds', userIds);
    const allConnections: string[] = [];
    for (const userId of userIds) {
      const sockets = await this.redisClient.smembers(userId);
      allConnections.push(...sockets);
    }
    return allConnections;
  }


  async getUsersIds(): Promise<string[]> {
    // return await this.redisClient.keys('user:*:sockets');
    //i want only the ids
    const keys = await this.redisClient.keys('user:*:sockets');
    return keys.map(key => key.split(':')[1]);
  }
}