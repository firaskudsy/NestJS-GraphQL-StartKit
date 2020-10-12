import * as mongoose from 'mongoose';
export class CreateAccountsDto {
    readonly _id: mongoose.Types.ObjectId;

    readonly register_date: Date;
    readonly firstname: string;
    readonly lastname: string;
    readonly phone: string;
    readonly email: string;
    readonly password: string;

    readonly realm: string;

}