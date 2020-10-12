
import { Module } from '@nestjs/common';
import { Sites, SitesSchema } from './schema/sites.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesService } from './sites.service';
import { SitesResolver } from './sites.resolver';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';


@Module({
  imports: [
    MongooseModule.forFeature([{
      collection: Sites.name,
      name: Sites.name,
      schema: SitesSchema
    }]),
 ],
  providers: [
    SitesResolver,
    SitesService, {
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
    }],
})
export class SitesModule { }