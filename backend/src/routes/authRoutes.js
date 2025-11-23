import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Şifre karşılaştırması için gerekli

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: "10d" }
  );
};

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

    const profileImage = `https://source.boringavatars.com/beam/200/${username}?colors=667eea,764ba2,f093fb,4facfe`;

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
        createdAt: newUser.createdAt,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// ✅ LOGIN ROUTE - DÜZELTME
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre gerekli" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email veya şifre hatalı" });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email veya şifre hatalı" });
    }

    // Token oluştur
    const token = generateToken(user._id);

    // Başarılı response
    res.status(200).json({
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;