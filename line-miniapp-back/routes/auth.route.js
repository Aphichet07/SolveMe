import authController from "../controllers/auth.controller.js"

const authRoute = (route) =>{
    route.get("/", ()=>{
        console.log("test")
    })
    route.post("/line-login", authController.loginTo)
}

export default authRoute