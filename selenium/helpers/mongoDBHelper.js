const { MongoClient } = require('mongodb');

class MongoDBHelper {
    client = new MongoClient("mongodb://localhost:30017");

    constructor() {
        this.client.connect();
    }

    async queryDBOne(collection, query){
        return this.client.db("MoFaCT").collection(collection).findOne(query);
    }

    async queryDbMany(collection, query){
        return await this.client.db("MoFaCT").collection(collection).find(query).fetch();
    }

    async closeConnection(){
        await this.client.close();
    }
}

module.exports = {
    MongoDBHelper: MongoDBHelper
}