import { CreateSitesDto } from './dto/sites.dto';
import { Injectable } from '@nestjs/common';
import { Sites } from './schema/sites.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SitesService {

    constructor(@InjectModel(Sites.name) private readonly sitesModel: Model<Sites>) { }

    async create(createSitesDto: CreateSitesDto): Promise<Sites> {

        const created = new this.sitesModel(createSitesDto);
        return created.save();
    }

    async deleteOneById(_id: string): Promise<any> {
        return this.sitesModel.findByIdAndRemove(_id);
    }

    async deleteBySID(sid: string): Promise<any> {
        return this.sitesModel.findAndRemove({ sid });
    }

    async deleteByQuery(where: any): Promise<any> {
        return this.sitesModel.findAndRemove(where);
    }



    async queryOne(query: string, data: any): Promise<Sites> {
        const moduleSpecifier = `./queries/${query}.query`
        const Query = await import(moduleSpecifier)
        const _schema = new Query.default(data).schema;
        const _query = _schema.query;
        return this.sitesModel.findOne(_query);
    }

    async queryMany(query: string, data: any): Promise<Sites[]> {
        const moduleSpecifier = `./queries/${query}.query`
        const Query = await import(moduleSpecifier)
        const _schema = new Query.default(data).schema;
        const _query = _schema.query;
        return this.sitesModel.find(_query);
    }

    async aggregate(query: string, data: any): Promise<Sites[]> {
        const moduleSpecifier = `./queries/${query}.query`
        const Query = await import(moduleSpecifier)
        const _schema = new Query.default(data).schema;
        const _query = _schema.query;
        return this.sitesModel.aggregate(_query);
    }



    async updateOne(where: any, updates: any): Promise<Sites> {
        return this.sitesModel.findOneAndUpdate(where, updates, { upsert: false });
    }

    async updateMany(where: any, updates: any): Promise<Sites> {

        return this.sitesModel.findManyAndUpdate(where, updates, { upsert: false });
    }



    async findAll(first?: number, skip?: number, where?: any, sort?: any, aggregation?: any): Promise<Sites[]> {
        if (aggregation) {
            return this.sitesModel.aggregate(aggregation).exec();

        } else {
            return this.sitesModel.find(where).limit(first).skip(skip).sort(sort).exec();

        }
    }

    async find(_id: string): Promise<Sites> {

        return this.sitesModel.findOne({ sid: _id }).exec();
    }


}