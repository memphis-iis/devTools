const { MongoClient } = require('mongodb');

class MongoDBHelper {
    client = new MongoClient("mongodb://localhost:30017");

    constructor() {
        this.client.connect();
    }

    async queryDBOne(collection, query){
        return await this.client.db("MoFaCT").collection(collection).findOne(query);
    }
}

module.exports = {
    MongoDBHelper: MongoDBHelper
}