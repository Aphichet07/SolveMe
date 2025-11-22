import authService from "../services/auth.sevice.js"

const authController = {
    loginTo: async (req, res) =>{
        res.status(299).json({message: "hello"})
    } 
}

export default authController