# 📝 MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js. This project demonstrates seamless integration between front-end and back-end components, including database operations, API communication, state management, authentication, and advanced features.

![MERN Stack](https://img.shields.io/badge/MERN-MongoDB%20Express%20React%20Node-green)
![License](https://img.shields.io/badge/license-ISC-blue)

## 🚀 Live Features

- ✅ Full CRUD operations for blog posts
- ✅ User authentication and authorization (Clerk)
- ✅ Image uploads for featured images
- ✅ Comments system
- ✅ Search and filter functionality
- ✅ Pagination
- ✅ Responsive design
- ✅ Optimistic UI updates
- ✅ Real-time notifications

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

This is a complete MERN stack blog application where users can:
- Create, read, update, and delete blog posts
- Sign up and sign in securely using Clerk authentication
- Upload featured images for their posts
- Comment on posts
- Search and filter posts by category
- Browse posts with pagination

The application follows RESTful API principles, implements secure authentication with Clerk, and provides a modern, responsive user interface.

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Clerk** - Authentication and user management
- **Multer** - File upload handling
- **Joi** - Input validation
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Clerk React** - Authentication components and hooks
- **Axios** - HTTP client
- **Context API** - State management
- **Custom Hooks** - Reusable logic

---

## 📁 Project Structure

```
mern-stack-integration-babulele/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Notification.jsx
│   │   │   ├── NotificationContainer.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── PostContext.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useApi.js
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   └── PostForm.jsx
│   │   ├── services/                # API service layer
│   │   │   └── api.js
│   │   ├── utils/                   # Utility functions
│   │   │   └── validation.js
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css                  # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── server/                          # Express backend
│   ├── config/                      # Configuration
│   │   ├── db.js                    # MongoDB connection
│   │   └── env.example.txt          # Environment template
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── postController.js
│   ├── middleware/                  # Custom middleware
│   │   ├── auth.js                  # Authentication
│   │   ├── errorHandler.js          # Error handling
│   │   └── upload.js                # File upload
│   ├── models/                      # Mongoose models
│   │   ├── Category.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/                       # API routes
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── posts.js
│   ├── uploads/                     # Uploaded files
│   ├── utils/                       # Utility functions
│   │   └── validation.js            # Joi schemas
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
├── README.md                        # This file
└── Week4-Assignment.md              # Assignment details
```

---

## ✨ Features

### Core Features
- **Blog Posts Management**: Create, read, update, and delete blog posts
- **Categories**: Organize posts into categories with custom colors
- **User Authentication**: Secure authentication with Clerk (email/password, social logins, MFA)
- **Image Uploads**: Upload featured images for posts (max 5MB)
- **Comments**: Add comments to posts (requires authentication)
- **Search**: Search posts by title or content
- **Filtering**: Filter posts by category
- **Pagination**: Browse posts 9 per page

### Advanced Features
- **Protected Routes**: Secure create/edit/delete operations
- **Optimistic UI Updates**: Instant feedback for better UX
- **Toast Notifications**: Success/error notifications
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Form Validation**: Both frontend and backend validation
- **Error Handling**: Comprehensive error handling throughout
- **Loading States**: Loading indicators for async operations
- **Slug URLs**: SEO-friendly URLs for posts

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation) - [Download](https://www.mongodb.com/try/download/community)
  - OR **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Clerk Account** - [Sign up](https://clerk.com) (free tier available)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mern-stack-integration-babulele
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Clerk Setup (Required First)

Before configuring the application, you need to set up Clerk:

1. **Create a Clerk Account**:
   - Go to [https://clerk.com](https://clerk.com)
   - Sign up for a free account
   - Create a new application

2. **Get Your API Keys**:
   - In the Clerk dashboard, go to **API Keys**
   - Copy your **Publishable Key** (starts with `pk_test_`)
   - Copy your **Secret Key** (starts with `sk_test_`)

3. **Configure Authentication Methods** (Optional):
   - In Clerk dashboard, go to **User & Authentication**
   - Enable email/password authentication
   - Optionally enable social logins (Google, GitHub, etc.)

### Server Configuration

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/mern-blog

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-blog

# Clerk Authentication
# Get your secret key from https://dashboard.clerk.com
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key-here
```

### Client Configuration

1. Navigate to the client directory:
```bash
cd client
```

2. Create a `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

3. Edit `.env`:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Clerk Authentication
# Get your publishable key from https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key-here
```

---

## 🚀 Running the Application

### Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
# or
sudo systemctl start mongod
```

**MongoDB Atlas:** No action needed, connection string handles it.

### Start the Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

Expected output:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5000
📝 Environment: development
```

### Start the Frontend Development Server

Open another terminal and run:
```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

Expected output:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and visit: `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require authentication. The application uses **Clerk** for authentication. Include the Clerk session token in the Authorization header:
```
Authorization: Bearer <clerk-session-token>
```

**Note**: Session tokens are automatically obtained from Clerk when users sign in. The frontend automatically includes the token in API requests.

---

### Auth Endpoints

**Note**: User registration and login are handled by Clerk on the frontend. Users sign up and sign in through Clerk's UI components at `/sign-up` and `/sign-in` routes.

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <clerk-session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "clerkId": "user_2abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "default-avatar.png"
  }
}
```

**Note**: Users are automatically created in MongoDB when they first authenticate with Clerk.

---

### Post Endpoints

#### Get All Posts
```http
GET /api/posts?page=1&limit=9&category=technology&search=react
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `category` (optional): Filter by category slug
- `search` (optional): Search in title/content
- `isPublished` (optional): Filter by published status

**Response:**
```json
{
  "success": true,
  "count": 9,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Blog Post",
      "content": "Post content...",
      "slug": "my-blog-post",
      "excerpt": "Short excerpt",
      "featuredImage": "1234567890-image.jpg",
      "author": {
        "_id": "507f191e810c19729de860ea",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Technology",
        "slug": "technology",
        "color": "#667eea"
      },
      "tags": ["react", "javascript"],
      "isPublished": true,
      "viewCount": 42,
      "comments": [],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Post
```http
GET /api/posts/:id
```

**Parameters:**
- `:id` can be MongoDB ObjectId or post slug

**Response:**
```json
{
  "success": true,
  "data": {
    // Full post object with populated relationships
  }
}
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Post",
  "content": "This is the content of my blog post. It must be at least 10 characters.",
  "excerpt": "Short summary",
  "category": "507f1f77bcf86cd799439012",
  "tags": ["react", "tutorial"],
  "isPublished": true,
  "featuredImage": "image-filename.jpg"
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters
- `content`: Required, minimum 10 characters
- `category`: Required, must be valid category ID
- `excerpt`: Optional, max 200 characters
- `tags`: Optional array of strings
- `isPublished`: Optional boolean

**Response:**
```json
{
  "success": true,
  "data": {
    // Created post object
  }
}
```

#### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  // ... other fields to update
}
```

**Authorization:** Only post author or admin can update

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Authorization:** Only post author or admin can delete

**Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Post deleted successfully"
}
```

#### Upload Post Image
```http
POST /api/posts/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  image: <file>
```

**Validation:**
- File type: jpeg, jpg, png, gif, webp
- Max size: 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1234567890-image.jpg",
    "path": "/uploads/1234567890-image.jpg"
  }
}
```

#### Add Comment
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post! Thanks for sharing."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "content": "Great post! Thanks for sharing.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Technology",
      "description": "Tech related posts",
      "slug": "technology",
      "color": "#667eea",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Category
```http
GET /api/categories/:id
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech related posts",
  "color": "#667eea"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters, unique
- `description`: Optional, max 200 characters
- `color`: Optional, must be valid hex color

---

## 🗺️ Frontend Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Blog post list with search/filter |
| `/posts/:id` | PostDetail | Public | Single post view with comments |
| `/posts/new` | PostForm | Private | Create new post |
| `/posts/:id/edit` | PostForm | Private | Edit existing post |
| `/sign-in` | SignIn | Public | User sign-in page (Clerk) |
| `/sign-up` | SignUp | Public | User registration page (Clerk) |

---

## 📖 Usage Guide

### For Users

1. **Sign Up/Sign In**: Create an account or sign in using Clerk's authentication (supports email/password and social logins)
2. **Browse Posts**: View all blog posts on the home page
3. **Search/Filter**: Use search bar or category filter to find posts
4. **Read Posts**: Click on any post to view full content
5. **Comment**: Sign in to add comments on posts
6. **Create Post**: Click "New Post" to write your own blog post
7. **Edit/Delete**: Edit or delete your own posts (buttons appear on post detail page)

### For Developers

The application follows these patterns:

- **Component Architecture**: Reusable components in `/components`
- **Page Components**: Full page views in `/pages`
- **Context API**: Shared state via AuthContext and PostContext
- **Custom Hooks**: Reusable API logic in `/hooks`
- **Service Layer**: API calls centralized in `/services`
- **Validation**: Both frontend (Joi) and backend validation

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/homeblog.PNG)
*Home page displaying blog posts in a grid layout with search and category filter options*

### Post Detail View
![Post Detail](./screenshots/post.PNG)
*Single post view showing full content, featured image, author information, and comments section*


**Note**: To add your screenshots:
1. Take screenshots of your running application
2. Save them in the `screenshots/` directory with the filenames above
3. The images will automatically display in this README

**Screenshot Instructions**:
- Make sure both servers are running
- Navigate to each feature in your browser
- Use Windows (Win + Shift + S) or Mac (Cmd + Shift + 4) to capture
- Save images as PNG format for best quality

---

## 🧪 Testing

### Manual Testing

1. **Authentication**:
   - [ ] Sign up new user (via Clerk)
   - [ ] Sign in with credentials (via Clerk)
   - [ ] Access protected routes (should redirect to /sign-in if not authenticated)
   - [ ] Logout functionality
   - [ ] Social login (if configured in Clerk)

2. **Posts**:
   - [ ] Create new post
   - [ ] View all posts
   - [ ] View single post
   - [ ] Edit own post
   - [ ] Delete own post
   - [ ] Cannot edit/delete others' posts

3. **Search & Filter**:
   - [ ] Search posts by keyword
   - [ ] Filter by category
   - [ ] Pagination works

4. **Image Upload**:
   - [ ] Upload image when creating post
   - [ ] Image displays in post
   - [ ] Image validation (type, size)

5. **Comments**:
   - [ ] Add comment (when logged in)
   - [ ] Comments display with user info
   - [ ] Login prompt for guests

### API Testing

Use Postman, Thunder Client, or curl to test endpoints:

```bash
# Test get all posts
curl http://localhost:5000/api/posts

# Test get current user (requires Clerk session token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <clerk-session-token>"
```

**Note**: To get a Clerk session token, sign in through the frontend application. The token is automatically included in API requests.

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```
Error: Cannot connect to MongoDB
```
**Solution**: 
- Ensure MongoDB is running: `mongosh` to test
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB service is started

**Port Already in Use**
```
Error: Port 5000 already in use
```
**Solution**: 
- Change `PORT` in server `.env` file
- Or kill the process using the port

**Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution**: 
- Run `npm install` in the respective directory (server or client)

**CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Ensure backend server is running
- Check `VITE_API_URL` in client `.env`
- Verify proxy configuration in `vite.config.js`

**Authentication Failed**
```
401 Unauthorized
```
**Solution**: 
- Verify `CLERK_SECRET_KEY` is set in server `.env`
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in client `.env`
- Ensure you're signed in through Clerk
- Check that the session token is being sent in Authorization header
- Verify Clerk dashboard settings are correct

**Missing Clerk Keys**
```
Missing VITE_CLERK_PUBLISHABLE_KEY
```
**Solution**:
- Create a Clerk account at https://clerk.com
- Create a new application in Clerk dashboard
- Copy your Publishable Key and Secret Key
- Add them to your `.env` files

---

## 🔒 Security Features

- **Clerk Authentication**: Industry-standard authentication with secure session management
- **Password Security**: Handled by Clerk (bcrypt, secure storage)
- **Session Tokens**: Short-lived, automatically refreshed tokens
- **Input Validation**: Joi validation on backend
- **Protected Routes**: Middleware guards sensitive endpoints
- **Authorization**: Users can only modify their own content
- **File Upload Validation**: Type and size restrictions
- **Error Handling**: No sensitive data leaked in errors
- **Multi-Factor Authentication**: Available through Clerk (if enabled)

---

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Clerk Documentation](https://clerk.com/docs) - Authentication and user management
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Node.js SDK](https://clerk.com/docs/references/backend/overview)
- [Vite Documentation](https://vitejs.dev/)

---

## 📝 Assignment Completion Summary

### Tasks Completed ✅

- [x] **Task 1**: Project Setup - Complete directory structure, MongoDB connection, Express server, Vite React app, environment variables
- [x] **Task 2**: Back-End Development - All API endpoints, Mongoose models, Joi validation, error handling
- [x] **Task 3**: Front-End Development - All React components, React Router, hooks, custom API hook
- [x] **Task 4**: Integration and Data Flow - API service, state management, form validation, optimistic updates, loading/error states
- [x] **Task 5**: Advanced Features - Authentication (Clerk), image uploads, pagination (already implemented), search/filter, comments

### Expected Outcomes Met ✅

- [x] Fully functional MERN stack blog application
- [x] Proper integration between MongoDB, Express.js, React.js, and Node.js
- [x] Clean code organization with separation of concerns
- [x] Responsive UI with good user experience
- [x] Multiple advanced features implemented

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Student Name**: [Your Name Here]

This project was completed as part of the Week 4 MERN Stack Integration assignment.

---

## 🙏 Acknowledgments

- PLP (Power Learn Project) for the assignment structure
- MongoDB, Express, React, and Node.js communities for excellent documentation
- Clerk for providing robust authentication solutions
- All open-source contributors of the packages used in this project

---

**Happy Coding! 🚀**
