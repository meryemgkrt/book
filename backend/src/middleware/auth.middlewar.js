import jwt from "jsonwebtoken";
import User from "../models/User.js";



const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Yetkilendirme hatası, token bulunamadı" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Yetkilendirme hatası, kullanıcı bulunamadı" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

export default protectRoute;