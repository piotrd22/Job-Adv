import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([this.user.deleteMany()]);
  }

  exclude<User, Key extends keyof User>(
    users: User[],
    keys: Key[],
  ): Omit<User[], Key> {
    for (let user of users) {
      for (let key of keys) {
        delete user[key];
      }
    }
    return users;
  }
}
