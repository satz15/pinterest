import express from "express";
import dotenv from 'dotenv'
import connectDb from './database/db.js';

dotenv.config();

const app = express()

const port = process.env.PORT

app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("server working")
// })

import userRoutes from './routes/userRoute.js'

app.use("/api/user" , userRoutes);

app.listen(port, () =>{
    console.log(`server is running on http://localhost:${port}`);
    connectDb()
    
})