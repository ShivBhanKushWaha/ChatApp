import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const secureRoutes = async (req,res,next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: "Unauthorized User"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token: ", decode);  // Check if userId exists in the decoded payload
        

        if(!decode){
            return res.status(401).json({message: "Invalid  token"})
        }
        const user = await User.findById(decode.id).select("-password");
        if(!user){
            return res.status(401).json({message: "User not found"})
        }
        req.user = user;
        next();
    }catch (error){
        console.log(error);
        res.status(501).json({ messge: "Internal server error in getting token" });
    }
}

export default secureRoutes