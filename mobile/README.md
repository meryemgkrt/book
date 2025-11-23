# 📚 BookWorm - Book Sharing Platform

> A full-stack mobile application for discovering and sharing book recommendations

## 📱 Screenshots

<div align="center">
  <img src="./screenshots/Öğelerle Yeni Klasör/Simulator Screenshot - iPhone 15 Pro - 2025-11-24 at 02.02.14.png" alt="Login" width="200"/>
  <img src="./screenshots/Öğelerle Yeni Klasör/Simulator Screenshot - iPhone 15 Pro - 2025-11-24 at 02.03.28.png" alt="Home" width="200"/>
  <img src="./screenshots/Öğelerle Yeni Klasör/Simulator Screenshot - iPhone 15 Pro - 2025-11-24 at 02.03.36.png" alt="Profile" width="200"/>
  <img src="./screenshots/Öğelerle Yeni Klasör/Simulator Screenshot - iPhone 15 Pro - 2025-11-24 at 02.03.39.png" alt="Create" width="200"/>
</div>

### 🎯 Key Features Showcase

| 🔐 Authentication | 📖 Browse Books | 👤 User Profile | ➕ Add Books |
|:-----------------:|:---------------:|:---------------:|:------------:|
| ![Login](./screenshots/login.png) | ![Home](./screenshots/home.png) | ![Profile](./screenshots/profile.png) | ![Create](./screenshots/create.png) |
| Secure login & registration | Discover book recommendations | Manage your collection | Share your favorites |

## ✨ Features

- 🔐 **JWT Authentication** - Secure user login and registration
- 📚 **Book Management** - Create, read, update, delete books
- 🖼️ **Image Upload** - Cloudinary integration for book covers
- 👤 **User Profiles** - Personalized book collections
- 🔄 **Real-time Updates** - Pull-to-refresh & pagination
- 🎨 **Modern UI** - Clean and intuitive design

## 🛠️ Tech Stack

### Frontend
- **React Native** (Expo)
- **Zustand** - State management
- **Expo Router** - Navigation
- **AsyncStorage** - Local persistence

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- MongoDB Atlas account

### Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm start
\`\`\`

### Mobile Setup
\`\`\`bash
cd mobile
npm install
npx expo start
\`\`\`

## 🌐 Live Demo

**Backend API:** [https://book-1-o7rf.onrender.com](https://book-1-o7rf.onrender.com)

**Test the API:**
- GET `/api/books` - Fetch all books
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

## 📦 Project Structure

\`\`\`
book/
├── backend/           # Node.js API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # Express routes
│   ├── middleware/   # Auth & validation
│   └── lib/          # Utilities
├── mobile/           # React Native app
│   ├── app/          # Screens (Expo Router)
│   ├── components/   # Reusable components
│   ├── store/        # Zustand state
│   └── constants/    # Config & styles
└── screenshots/      # App screenshots
\`\`\`

## 🎓 What I Learned

- Building production-ready mobile applications
- Implementing secure authentication flows
- Managing cloud infrastructure (MongoDB Atlas, Cloudinary, Render)
- Optimizing API performance with pagination
- Modern React patterns and state management

## 🔮 Future Enhancements

- [ ] Like & comment system
- [ ] Book search & filters
- [ ] Follow/unfollow users
- [ ] Push notifications
- [ ] Dark mode
- [ ] Reading lists
- [ ] Social sharing

## 👨‍💻 Author

**Meryem Kurtulus**

- GitHub: [@meryemgkrt](https://github.com/meryemgkrt)
- LinkedIn: [your-linkedin-profile]

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ Star this repo if you find it helpful!