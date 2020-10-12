import { AccountsService } from './accounts.service';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver('Accounts')
export class AccountsResolver {
    constructor(private accountsServices: AccountsService, @Inject('PUB_SUB') private pubSub: PubSubEngine) {
    }

    @Subscription()
    accountsAdded() {
        return this.pubSub.asyncIterator('accountsAdded');
    }

    @Subscription()
    accountsUpdated() {
        return this.pubSub.asyncIterator('accountsUpdated');
    }

    @Subscription()
    accountsDeleted() {
        return this.pubSub.asyncIterator('accountsDeleted');
    }

    @Mutation('accounts_create')
    async createSite(@Args('data', { type: () => JSON }) data: any) {
        const site = await this.accountsServices.create(data);
        this.pubSub.publish('accountsAdded', { ['accountsAdded']: site });
        return site
    }

    @Mutation('accounts_updateOne')
    async updateOne(
        @Args('where', { type: () => JSON }) where: any,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = this.accountsServices.updateOne(where, data)
        this.pubSub.publish('accountsUpdated', { ['accountsUpdated']: _res });
        return _res;
    }

    @Mutation('accounts_updateMany')
    async updateMany(
        @Args('where', { type: () => JSON }) where: any,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = this.accountsServices.updateMany(where, data)
        this.pubSub.publish('accountsUpdated', { ['accountsUpdated']: _res });
        return _res;
    }


    @Query('accounts')
    // @UseGuards(GqlAuthGuard)
    async getAllAccounts(
        @Args('first', { type: () => Int }) first: number,
        @Args('skip', { type: () => Int }) skip: number,
        @Args('where', { type: () => JSON }) where: any,
        @Args('sort', { type: () => JSON }) sort: any,
        @Args('aggregation', { type: () => JSON }) aggregation: any,
    ) {
        const _where = where ? JSON.parse(JSON.stringify(where).replace(/__/g, '$')) : null;
        const _sort = sort ? JSON.parse(JSON.stringify(sort).replace(/__/g, '$')) : null;
        const _aggregation = aggregation ? JSON.parse(JSON.stringify(aggregation).replace(/__/g, '$')) : null;

        return this.accountsServices.findAll(first, skip, _where, _sort, _aggregation);
    }

    @Query('login')
    // @UseGuards(GqlAuthGuard)
    async login(
        @Args('email', { type: () => String }) email: string,
        @Args('password', { type: () => String }) password: string,
        @Args('realm', { type: () => String }) realm: string,

    ) {
        const response = await this.accountsServices.login({ email, password, realm });
        return response
    }

    @Query('register')
    // @UseGuards(GqlAuthGuard)
    async register(
        @Args('email', { type: () => String }) email: string,
        @Args('password', { type: () => String }) password: string,
        @Args('realm', { type: () => String }) realm: string,
        @Args('firstname', { type: () => String }) firstname: string,
        @Args('lastname', { type: () => String }) lastname: string,
        @Args('phone', { type: () => String }) phone: string,

    ) {
        const response = await this.accountsServices.register({ email, password, realm, firstname, lastname, phone });
        return response
    }

    @Query('accounts_findById')
    async getAccounts(@Args('_id', { type: () => String }) _id: string) {
        return this.accountsServices.find(_id);
    }

    //@ResolveField('_domain')
    // @UseGuards(GqlAuthGuard)
    //async getDomain(@Parent() accounts) {
    //    const { _id } = accounts;
    //    return this.domainsService.find(_id);
    //}

}