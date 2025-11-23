import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middlewar.js";

const router = express.Router();

// Kitap ekleme - PROTECTED
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, author, caption, image, rating } = req.body;

    if (!image || !title || !author || !caption || !rating) {
      return res.status(400).json({ message: "Lütfen tüm zorunlu alanları doldurun" });
    }

    // Cloudinary'e resim yükleme
    const uploadRes = await cloudinary.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;

    const newBook = new Book({
      title,
      author,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });

    await newBook.save();
    res.status(201).json({ message: "Kitap başarıyla eklendi", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Tüm kitapları getirme - PUBLIC ✅ protectRoute kaldırıldı
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books,
      totalBooks,
      currentPage: page,
      totalPages,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Belirli bir kullanıcının kitaplarını getirme - PROTECTED
router.get("/user/:userId", protectRoute, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const books = await Book.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books,
      totalBooks,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kitap silme - PROTECTED
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Kitap bulunamadı" });
    }

    // Sadece kitabın sahibi silebilir
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bu kitabı silme yetkiniz yok" });
    }

    // Cloudinary'den resmi sil
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Cloudinary resim silme hatası:", error);
        return res.status(500).json({ message: "Resim silme hatası" });
      }
    }

    await Book.findByIdAndDelete(id);
    
    res.json({ message: "Kitap başarıyla silindi" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;