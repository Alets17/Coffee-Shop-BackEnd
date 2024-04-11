import express from "express";
import db from "../db/connection.js";

const router = express.Router();
const COFFEE = "coffee";

router.get("/", async(req, res) => {
    try {
        const collection = await db.collection(COFFEE);
        const results = await collection.find({}).toArray();

        res.send(results).status(200);
    } catch(err) {
        console.error("Error fetching coffee items", err);
        res.status(500).send("Internal Server Error");
    } 
});

router.get("/:id", async(req, res) => {
    try {
        const targetId = parseInt(req.params.id);
        const collection = await db.collection(COFFEE);
        const query = { id: targetId};
        const result = await collection.findOne(query);

        if(!result) {
            res.send("Not Found").status(404);
        } else {
            res.send(result).status(200);
        }
    } catch(err) {
        console.error("Error fetching coffee item", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;