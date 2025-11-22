import express from "express";
import authRoute from "./auth.route.js";
import bubbleRoute from "./bubble.route.js";

const router = express.Router();

const userRoutes = express.Router();
authRoute(userRoutes);                
router.use("/api/auth", userRoutes);   

const bubbleRoutes = express.Router();
bubbleRoute(bubbleRoutes);             
router.use("/api/bubbles", bubbleRoutes);

export default router;
