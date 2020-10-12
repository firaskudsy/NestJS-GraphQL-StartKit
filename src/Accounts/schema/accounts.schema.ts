import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Accounts extends Document {

    @Prop()
    register_date: Date;

    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    realm: string;
}

export const AccountsSchema = SchemaFactory.createForClass(Accounts);