import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL tanımlı değil!");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB bağlantısı başarısız:", error.message);
        process.exit(1);
    }
};