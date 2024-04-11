import express from "express";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import db from "../db/connection.js";

const router = express.Router();
const USER = "user";

router.post("/signup", async(req, res) => {
    try {
        const hashPw = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            email: req.body.email,
            password: hashPw,
            fullName: null,
            address: null,
            dateOfBirth: null
        };

        const collection = await db.collection(USER);
        await collection.insertOne(newUser);

        const query = { email: newUser.email};
        const user = await collection.findOne(query);

        return res.json({user});
    } catch(err) {
        console.error("Error signing up", err);
        res.status(500).send("Error signing up user");
    }
});

router.post("/login", async(req, res) => {
    try {
        const collection = await db.collection(USER);
        const em = req.body.email;
        const pw = req.body.password;

        const query = { email: em};
        const user = await collection.findOne(query);

        if(!user) {
            res.status(404).send("Not found user");
            return;
        }

        const matchPw = await bcrypt.compare(pw, user.password);

        if(matchPw) {
            return res.json({user});
        } else {
            res.status(401).send("Invalid password");
        }
    } catch(error) {
        console.error("Error login user", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/signup", async(req, res) => {
    try {
        const collection = await db.collection(USER);
        const users = await collection.find({}, { email: 1}).toArray(function(err, email) {
            if(err) {
                console.error('Error retrieving emails', err);
                return;
            }
        });

        let emails = users.map(({email}) => ({email}));

        res.send(emails).status(200);
    }  catch(err) {
        console.error("Error fetching user", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/user", async(req, res) => {
    try {
        const collection = await db.collection(USER);
        const em = req.body.email;

        const query = { email: em};
        const user = await collection.findOne(query);

        if(!user) {
            res.status(404).send("Not found user");
            return;
        } else {
            res.json({user});
        }
    } catch(error) {
        console.error("Error get user", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put("/update", async(req, res) => {
    try {
        const id = req.body.userId;
        const fn = req.body.fullname;
        const address = req.body.address;
        const dob = req.body.dob;

        const collection = await db.collection(USER);
        const query = { _id: new ObjectId(id) };
        let user = await collection.findOne(query);

        if(!user) {
            return res.status(404).send("User not found");
        }

        user.fullName = fn;
        user.address = address;
        user.dateOfBirth = dob;

        await collection.updateOne(query, { $set: user});

        return res.json({user});
    } catch(error) {
        console.error("Error update user", error);
        res.status(500).send("Internal Server Error");
    }
});


export default router;