import authRouter from "./auth.route.js";
import express from "express";

const route = express.Router()

const authRoute = authRouter(route)


export default route