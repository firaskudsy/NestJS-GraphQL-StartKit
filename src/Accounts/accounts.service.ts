import { CreateAccountsDto } from './dto/accounts.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Accounts } from './schema/accounts.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AccountsService {

    constructor(
        @InjectModel(Accounts.name) private readonly accountsModel: Model<Accounts>
        , private readonly jwtService: JwtService,
    ) { }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async validateUser({ email, password, realm }: any): Promise<any> {
        const user = await this.accountsModel.findOne({ email, realm });
        if (user && await this.compareHash(password, user.password)) {
            const { password, ...result } = user;
            return user;
        }
        return null;
    }

    async validateRegisterUser({ email, realm }: any): Promise<any> {
        return !(await this.accountsModel.findOne({ email, realm }));
    }


    async register({ email, password, realm, firstname, lastname, phone }: any) {
        try {
            if (await this.validateRegisterUser({ email, realm })) {
                const _user = { email, password: await bcrypt.hash(password, 10), realm, firstname, lastname, phone };
                const cuser = await this.accountsModel.create(_user);
                const payload = { email: cuser.email, sub: cuser._id };
                const token = this.jwtService.sign(payload);
                const decoded = this.jwtService.decode(token);
                return {
                    _id: token,
                    ttl: (Number(decoded['exp']) * 1000).toString(),
                    created: cuser.register_date,
                    userId: cuser._id,
                };
            } else {
                return new HttpException({
                    status: HttpStatus.EXPECTATION_FAILED,
                    error: 'email already used',
                }, HttpStatus.EXPECTATION_FAILED);
            }

        } catch (err) {
            return new HttpException({
                status: HttpStatus.EXPECTATION_FAILED,
                error: err,
            }, HttpStatus.EXPECTATION_FAILED);
        }

    }

    async login({ email, password, realm }: any) {
        const xuser = await this.validateUser({ email, password, realm });

        if (!xuser) {
            throw new HttpException("Unauthorized", 401);
        }
        const payload = { email: xuser.email, sub: xuser._id };
        const token = this.jwtService.sign(payload)
        const decoded = this.jwtService.decode(token);
        return {
            _id: token,
            ttl: (Number(decoded['exp']) * 1000).toString(),
            created: xuser.register_date,
            userId: xuser._id,
        };
    }


    async create(createAccountsDto: CreateAccountsDto): Promise<Accounts> {
        const created = new this.accountsModel(createAccountsDto);
        return created.save();
    }

    async updateOne(where: any, updates: any): Promise<Accounts> {
        return this.accountsModel.findOneAndUpdate(where, updates, { upsert: false });
    }

    async updateMany(where: any, updates: any): Promise<Accounts> {
        return this.accountsModel.findManyAndUpdate(where, updates, { upsert: false });
    }


    async findAll(first?: number, skip?: number, where?: any, sort?: any, aggregation?: any): Promise<Accounts[]> {
        if (aggregation) {
            return this.accountsModel.aggregate(aggregation).exec();
        } else {
            return this.accountsModel.find(where).limit(first).skip(skip).sort(sort).exec();
        }
    }


    async find(_id: string): Promise<Accounts> {
        return this.accountsModel.find({ _id }).exec();
    }

    async findByID(_id: string): Promise<Accounts> {
        return this.accountsModel.find({ _id }).exec();
    }

    async findBySID(_id: string): Promise<Accounts[]> {
        return this.accountsModel.find({ sid: _id }).exec();
    }

}