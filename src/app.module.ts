import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './Accounts/accounts.module';
import { SitesModule } from './sites/sites.module';


import GraphQLJSON from 'graphql-type-json';
import { PubSub } from 'graphql-subscriptions';



@Module({
  imports: [


    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,

      context: ({ req }) => ({ req }),
      typePaths: ['./*/**/*.graphql'],
      playground: true,
      resolvers: { JSON: GraphQLJSON },

    }),
    MongooseModule.forRoot('<mongodb uri>'),
    AccountsModule,
    SitesModule,

  ],
  providers: []

})
export class AppModule { }
