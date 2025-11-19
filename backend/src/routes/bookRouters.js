import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middlewar.js";
const router = express.Router();



router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, author, caption, image, rating } = req.body; // ✅ user'ı body'den kaldır

    if (!image || !title || !author || !caption || !rating) { // ✅ user kontrolünü kaldır
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
      user: req.user._id, // ✅ user protectRoute middleware'inden gelir
    });

    await newBook.save();
    res.status(201).json({ message: "Kitap başarıyla eklendi", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
// Tüm kitapları getirme
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
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

// Kitsp silme
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

    await Book.findByIdAndDelete(id);  // ✅ Doğru metod

    // veya: await book.deleteOne();

    if (book.image && book.image.includes("cloudinary")) {

        try {
            const publicId = book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
            
        } catch (error) {
            console.error("Cloudinary resim silme hatası:", error);
            // Hata durumunda isteği iptal et
            return res.status(500).json({ message: "Resim silme hatası" });
            
        }

    }
    
    res.json({ message: "Kitap başarıyla silindi" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
