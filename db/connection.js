import { MongoClient, ServerApiVersion} from "mongodb";
import {seedCollection} from "./collection/collection.js";
import coffeeData from "./collection/data/coffee.json" assert {type: "json"};
import teaData from "./collection/data/tea.json" assert {type: "json"};

const DB_NAME = "CSIS3380_G2";
let db;

//Collections
const COFFEE = "coffee";
const USER = "user";
const TRANSACTION = "transaction";
const TEA = "tea"
const REVIEW = "review";


const uri = "mongodb+srv://ty_mongouser:csis3380g2@atlascluster.hp3vha1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
});

try {
    await client.connect();

    await client.db("admin").command({ping: 1});
    console.log("Successfully connected to MongoDB");

    db = client.db(DB_NAME);
    if(db) {
        //Check coffee collection
        if(! await checkCollection(db, COFFEE)) {
            seedCollection(db, COFFEE, coffeeData.coffee);
        }

        //Check user collection
        if(! await checkCollection(db, USER)) {
            seedCollection(db, USER, null);
        }

        //Check transaction collection
        if(! await checkCollection(db, TRANSACTION)) {
            seedCollection(db, TRANSACTION, null);
        }

        //Check tea collection
        if(! await checkCollection(db, TEA)) {
            seedCollection(db, TEA, teaData.tea)
        }

        //Check review collection
        if(! await checkCollection(db, REVIEW)) {
            seedCollection(db, REVIEW, null);
        }
    }
} catch(err) {
    console.error("Error Connecting to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
}

async function checkCollection(db, collection) {
    let flag = false;
    const collectionList = await db.listCollections({name: collection}).toArray();

    if(collectionList.length > 0) {
        flag = true;
    } else {
        flag = false;
    }

    return flag;
}

export default db;