import * as mongoose from 'mongoose';
export class CreateSitesDto {
    readonly _id: mongoose.Types.ObjectId;

    readonly name: string;
    readonly title: string;
    readonly subtitle: string;
    readonly image: string;
  
}