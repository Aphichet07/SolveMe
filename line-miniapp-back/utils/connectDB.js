import usersCollection from "../models/user.model.js"

const connectDB = async () => {
    try {
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
    }
};

export default connectDB