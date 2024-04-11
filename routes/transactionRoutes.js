import express from "express";
import db from "../db/connection.js";

const router = express.Router();
const TRANSACTION = "transaction";

router.get("/", async(req, res) => {
    try {
        const collection = await db.collection(TRANSACTION);
        const results = await collection.find({}).toArray();

        if(!results) {
            res.send("Not Found").status(404);
        } else {
            res.send(results).status(200);
        }
    } catch(err) {
        console.error("Error fetching transaction", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/", async(req, res) => {
    try {
        const newTransaction = {
            userId: req.body.userId,
            contents: req.body.contents,
            grandTotal: req.body.grandTotal,
            transaction_date: req.body.transaction_date
        };

        const collection = await db.collection(TRANSACTION);
        await collection.insertOne(newTransaction);
        
        res.sendStatus(204);
    } catch(err) {
        console.error("Error transaction", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;