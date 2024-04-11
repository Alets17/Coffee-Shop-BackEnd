import express from "express";
import db from "../db/connection.js";

const router = express.Router();
const REVIEW = "review";

router.get("/:id", async(req, res) => {
    try {
        const itemId = req.params.id;
        const collection = await db.collection(REVIEW);
        const query = { itemId: itemId};
        const reviews = await collection.find(query).sort({ date: -1 }).toArray();

        if(reviews) {
            res.send(reviews).status(200);
        } else {
            return null;
        }
    } catch(err) {
        console.error("Error adding review", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/update", async(req, res) => {
    try {
        const collection = await db.collection(REVIEW);
        const newReview = {
            itemId: req.body.itemId,
            reviewer: req.body.reviewer,
            comment : req.body.comment,
            rate: req.body.rate,
            date: req.body.date
        }

        await collection.insertOne(newReview);

        res.sendStatus(204);
    } catch(err) {
        console.error("Error adding review", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;