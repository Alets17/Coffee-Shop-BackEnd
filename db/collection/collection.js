export async function seedCollection(db, collection, data) {
    await createCollection(db, collection);
    if(data != null) {
        await seedData(db, collection, data);
    }
}

async function createCollection(db, collection) {
    try {
        await db.createCollection(collection);

        console.log(`Collection: ${collection} created`);
    } catch(err) {
        console.error(err);
    } 
}

async function seedData(db, collectionName, data) {
    try {
        const collection = await db.collection(collectionName);
        await collection.insertMany(data);

        console.log(`Seed data in ${collectionName}`);
    } catch(err) {
        console.error(err);
    }
}

