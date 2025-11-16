import authController from "../controllers/auth.controller.js";

const authRouter = (router) =>{
    router.get("/", authController.ValidateLineLiff)
}

export default authRouter