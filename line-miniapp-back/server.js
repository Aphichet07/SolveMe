//  main server
import express, { Router } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";

dotenv.config();

connectDB()

const app = express()
app.use(express.json())
app.use(Router)

dotenv.config();

app.listen(3000, ()=>{
    console.log("Server is running on port : ", 3000)
})