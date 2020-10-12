
export default class Query {
    schema: any;
    constructor(data: any) {
        this.schema = {
            query: {
                _id:data._id
            }
        }
    }
}