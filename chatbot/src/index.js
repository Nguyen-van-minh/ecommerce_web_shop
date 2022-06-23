import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/wed";

const mongoose = require('mongoose');
require('dotenv').config()

let app = express();

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
};

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);

webRoutes(app);

let port = process.env.PORT || 8080;



app.listen(port, () => {
    console.log("App is running port:" + port);
})