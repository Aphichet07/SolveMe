import express from 'express';
import {loginUser} from "../controllers/user/loginUsers.js";

const router = express.Router();

// Define routes
router.get('/', getUsers);
router.post('/', createUser);

export default router;