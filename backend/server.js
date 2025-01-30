require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");

const ordersRoute = require("./routes/orders");
const productsRoute = require("./routes/products");


const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req,res) => {
    console.log("Hello BlinkWorx Test");
    res.status(200).json({message:"Worked"});
});

app.use("/orders", ordersRoute);
app.use("/products", productsRoute)
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});
db.sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        // process.exit(1);
    });
