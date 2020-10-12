import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Sites extends Document {


    @Prop()
    name: string;

    @Prop()
    title: string;

    @Prop()
    subtitle: string;

    @Prop()
    image: string;

   

}

export const SitesSchema = SchemaFactory.createForClass(Sites);