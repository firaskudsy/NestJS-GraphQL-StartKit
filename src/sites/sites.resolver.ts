
import { SitesService } from './sites.service';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { User as CurrentUser } from 'src/Auth/user.decorator';
import { GqlAuthGuard } from 'src/Auth/auth.guard';




@Resolver('Sites')
export class SitesResolver {
    constructor(private sitesServices: SitesService,
        @Inject('PUB_SUB') private pubSub: PubSubEngine
    ) {
    }


    @Subscription()
    sitesAdded() {
        return this.pubSub.asyncIterator('sitesAdded');
    }

    @Subscription()
    sitesUpdated() {
        return this.pubSub.asyncIterator('sitesUpdated');
    }

    @Subscription()
    sitesDeleted() {
        return this.pubSub.asyncIterator('sitesDeleted');
    }


    @Query('sites')
    @UseGuards(GqlAuthGuard)
    async getAllSites(
        @Args('first', { type: () => Int }) first: number,
        @Args('skip', { type: () => Int }) skip: number,
        @Args('where', { type: () => JSON }) where: any,
        @Args('sort', { type: () => JSON }) sort: any,
        @Args('aggregation', { type: () => JSON }) aggregation: any,

        @CurrentUser() user
    ) {


        const _where = where ? JSON.parse(JSON.stringify(where).replace(/__/g, '$')) : null;
        const _sort = sort ? JSON.parse(JSON.stringify(sort).replace(/__/g, '$')) : null;
        const _aggregation = aggregation ? JSON.parse(JSON.stringify(aggregation).replace(/__/g, '$')) : null;


        return this.sitesServices.findAll(first, skip, _where, _sort, _aggregation);
    }

    @Mutation('sites_create')
    async createSite(@Args('data', { type: () => JSON }) data: any) {
        const site = await this.sitesServices.create(data);
        this.pubSub.publish('sitesAdded', { ['sitesAdded']: site });
        return site
    }


    @Mutation('sites_deleteOneById')
    @UseGuards(GqlAuthGuard)
    async sitesDeleteOneById(@Args('_id', { type: () => String }) _id: string) {

        const deleted = await this.sitesServices.deleteOneById(_id);

        this.pubSub.publish('sitesDeleted', { ['sitesDeleted']: deleted });
        return deleted
    }

    @Mutation('sites_deleteBySID')
    @UseGuards(GqlAuthGuard)
    async sitesDeleteBySID(@Args('sid', { type: () => String }) sid: string) {
        const deleted = await this.sitesServices.deleteBySID(sid);
        this.pubSub.publish('sitesDeleted', { ['sitesDeleted']: deleted });
        return deleted
    }

    @Mutation('sites_deleteByQuery')
    @UseGuards(GqlAuthGuard)
    async sitesDeleteByQuery(@Args('where', { type: () => JSON }) where: any) {
        const deleted = await this.sitesServices.deleteByQuery(where);
        this.pubSub.publish('sitesDeleted', { ['sitesDeleted']: deleted });
        return deleted
    }

    @Mutation('sites_updateOne')
    @UseGuards(GqlAuthGuard)
    async updateOne(
        @Args('where', { type: () => JSON }) where: any,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = await this.sitesServices.updateOne(where, data)

        this.pubSub.publish('sitesUpdated', { ['sitesUpdated']: _res });

        return _res;
    }

    @Mutation('sites_updateMany')
    @UseGuards(GqlAuthGuard)
    async updateMany(
        @Args('where', { type: () => JSON }) where: any,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = await this.sitesServices.updateMany(where, data)
        this.pubSub.publish('sitesUpdated', { ['sitesUpdated']: _res });

        return _res;
    }


    @Query('sites_queryOne')
    @UseGuards(GqlAuthGuard)
    async queryOne(
        @Args('query', { type: () => String }) query: string,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = await this.sitesServices.queryOne(query, data)
        return _res;
    }

    @Query('sites_queryMany')
    @UseGuards(GqlAuthGuard)
    async queryMany(
        @Args('query', { type: () => String }) query: string,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = await this.sitesServices.queryMany(query, data)
        return _res;
    }

    @Query('sites_aggregate')
    @UseGuards(GqlAuthGuard)
    async aggregate(
        @Args('query', { type: () => String }) query: string,
        @Args('data', { type: () => JSON }) data: any) {
        const _res = await this.sitesServices.aggregate(query, data)
        return _res;
        }

    @Query('sites_fineById')
    async getSites(@Args('_id', { type: () => String }) _id: string) {
        return this.sitesServices.find(_id);
    }

    // @ResolveField('_domain')
    // async getDomain(@Parent() sites) {
    //     const { _id } = sites;
    //     return this.domainsService.find(_id);
    // }

    // @ResolveField('_addons')
    // async getAddons(@Parent() sites) {
    //     const { _id } = sites;

    //     return this.addonsService.findBySID(_id);
    // }



}