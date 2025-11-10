import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* const response= await fetch(`http://localhost:3000/api/books`,{
    method:"POST",
    body:JSON.stringify({
        title,
        caption
        
    }),
    headers:{
        Authorization:`Bear ${token}`,
        "Content-Type":"application/json"
    }

}) */

    const protectRoute= async(req, resizeBy, next)=>{
        try {
            const token =req.header("Authorization")?.replace("Bear ","");
            if(!token) return res.status(401).json({message:"Yetkilendirme hatası, token bulunamadı"}); 
            
            const decoded=jwt.verify(token, process.env.JWT_SECRET);
            const user=await User.findById(decoded.userId).select("-password");
            
            if(!user){
                return res.status(401).json({message:"Yetkilendirme hatası, kullanıcı bulunamadı"});
            }
            req.user=user;
            next(); 
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Sunucu hatası"});
        }
    }
export default protectRoute;