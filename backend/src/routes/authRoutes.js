import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const generateToken = (userId) => {
    return jwt.sign(
        {userId}, process.env.JWT_SECRET, {expiresIn:"10d"}
    )
}
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tüm alanları doldurun" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalı" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı en az 3 karakter olmalı" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email zaten kayıtlı" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Kullanıcı adı zaten kayıtlı" });
    }

    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const newUser = new User({ username, email, password, profileImage });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
  // res.send("register"); ← BU SATIRI SİLİN TAMAMEN!
});

router.post("/login", async (req, res) => {
  res.send("login");
});

export default router;
