
export default class Query {
    schema: any;
    constructor(data: any) {
        this.schema = {
            query: [
                {
                    $match: {
                        sid: data.sid
                    }
                }]
        }
    }
}