import express from "express";
import cors from "cors";
import coffee from "./routes/coffeeRoutes.js";
import user from "./routes/userRoutes.js";
import transaction from "./routes/transactionRoutes.js";
import tea from "./routes/teaRoutes.js"
import review from "./routes/reviewRoutes.js";

// const PORT = 5050;
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/coffee", coffee);
app.use("/account", user);
app.use("/checkout", transaction);
app.use("/tea", tea)
app.use("/reivew", review);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});