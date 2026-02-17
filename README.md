# Wallpaper Sharing Platform

A full-stack web application for sharing and discovering wallpapers, built with React and Express.js. Users can create accounts, upload wallpapers via Cloudinary, manage their profiles, and explore content from other users.

## ✨ Features

### Authentication & Authorization
- **User Registration & Login** with JWT-based authentication
- **Email Verification** system with secure token-based verification
- **Protected Routes** for authenticated users only
- **Secure Password Hashing** using bcrypt

### User Management
- **User Profiles** with avatar upload support
- **Profile Editing** capabilities
- **User Dashboard** with personalized content
- **Admin Dashboard** for user management (admin-only)

### Wallpaper Management
- **Upload Wallpapers** with Cloudinary integration
- **Create Posts** with image upload functionality
- **Browse Wallpapers** on the home page
- **User-specific Content** management

### UI/UX
- **Modern, Premium Design** with glassmorphism effects
- **Smooth Animations** using Framer Motion
- **Responsive Layout** that works on all devices
- **Dark Mode Support** with gradient backgrounds
- **Toast Notifications** for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router Dom** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system
- **JWT Decode** - JWT token handling

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting and management
- **Multer** - File upload handling
- **Mailtrap** - Email service for verification
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
arr_ya_paar_wala project/
├── Backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Cloudinary, etc.)
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware (auth, etc.)
│   │   ├── models/          # Mongoose models (User, Post)
│   │   ├── routes/          # API routes (auth, user, post)
│   │   └── index.js         # Express server entry point
│   ├── .env                 # Backend environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   ├── dashboard/   # Dashboard-specific components
    │   │   ├── layout/      # Layout components
    │   │   └── routing/     # Route protection components
    │   ├── context/         # React context (Auth)
    │   ├── pages/           # Page components
    │   │   └── Auth/        # Authentication pages
    │   ├── services/        # API service functions
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── .env                 # Frontend environment variables
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary Account** (for image uploads)
- **Mailtrap Account** (for email verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd arr_ya_paar_wala\ project
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `Backend` directory:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Mailtrap)
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_SENDER_EMAIL=your_sender_email
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

1. **Start the Backend**
   ```bash
   cd Backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

#### Production Build

**Frontend Build**
```bash
cd frontend
npm run build
npm run preview
```

## 🔑 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /verify-email` - Verify email with token

### User Routes (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /update` - Update user profile
- `GET /all` - Get all users (admin only)

### Post Routes (`/api/post`)
- `POST /create` - Create new wallpaper post
- `GET /` - Get all posts
- `GET /user/:userId` - Get posts by specific user

## 🎨 Key Features Explained

### Email Verification
- Upon registration, users receive a verification email
- Email contains a secure token link
- Users must verify email before full access
- Token expires after a certain period

### Image Upload
- Integrates with Cloudinary for reliable image hosting
- Supports multiple image formats
- Automatic image optimization
- Secure upload with authentication

### Authentication Flow
1. User registers with email and password
2. Password is hashed with bcrypt
3. Verification email is sent
4. User verifies email via token link
5. User can login with credentials
6. JWT token is issued and stored in httpOnly cookie
7. Token is validated on protected routes

### Protected Routes
- Client-side route protection using `ProtectedRoute` component
- Server-side middleware authentication
- Automatic redirect to login for unauthenticated users
- Public routes accessible without authentication

## 🔐 Security Features

- **Password Hashing** with bcrypt (6 rounds)
- **JWT Authentication** with httpOnly cookies
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **Email Verification** to prevent fake accounts
- **Protected API Endpoints** with authentication middleware

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes and orientations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- Tailwind CSS team
- Cloudinary for image hosting
- All open-source contributors

---

**Note:** Make sure to configure all environment variables before running the application. Never commit `.env` files to version control.
