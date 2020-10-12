import { jwtConstants } from 'src/Auth/secret';
import { Module } from '@nestjs/common';
import { Accounts, AccountsSchema } from './schema/accounts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/Auth/local.strategy';
import { JwtStrategy } from 'src/Auth/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expire },
    }),

    MongooseModule.forFeature([{ collection: Accounts.name, name: Accounts.name, schema: AccountsSchema }])],
  providers: [AccountsService, AccountsResolver, {
    provide: 'PUB_SUB',
    useFactory: () => {
      return new RedisPubSub({
        publisher: new Redis({
          host: 'localhost',
          port: 6379
        }),
        subscriber: new Redis({
          host: 'localhost',
          port: 6379
        }),
      });
    },
  },
    LocalStrategy, JwtStrategy],
  exports: [AccountsService, PassportModule],
})
export class AccountsModule { }