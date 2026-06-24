# 🌐 Connectify - Mini Social Media Platform

> Connectify is a full-stack social media web application built with Node.js, Express.js, EJS, and MongoDB. This internship project demonstrates core web development practices including user authentication, session management, server-side rendering, and real-time UI interactions.

> This application allows users to register an account, log in securely, view a community feed of posts, create their own posts, and like or unlike posts dynamically without page reloads.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat&logo=ejs&logoColor=black)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=flat&logo=letsencrypt&logoColor=white)

---

## ✨ Features

### User Features
- 📝 **User Registration** - Sign up with username, email, and password
- 🔑 **Secure Login** - Login using username or email with bcrypt password verification
- 🔒 **Session Authentication** - Stay logged in via secure server-side sessions
- 📰 **Community Feed** - View all posts from every user, sorted newest first
- ✍️ **Create Posts** - Share thoughts with the community (up to 500 characters)
- ❤️ **Dynamic Likes** - Like and unlike posts instantly without page reload (AJAX)
- 🛡️ **Route Protection** - Guests are automatically redirected to login for protected pages
- 🚪 **Logout** - Securely destroy session and clear cookies

### Developer Features
- 🌱 **Database Seeder** - `npm run seed` to populate feed with demo data instantly
- 🗂️ **MVC Architecture** - Clean separation of Models, Views, and Controllers
- 💅 **Custom Dark Theme** - Premium UI with CSS variables, glassmorphism, and animations

---

## 🛠️ Tech Stack

### Frontend
- **EJS (Embedded JavaScript)** - Server-side HTML templating
- **Vanilla CSS3** - Custom dark theme with CSS variables and transitions
- **Fetch API** - Client-side AJAX for dynamic like toggling (no framework needed)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework and routing
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - Object Data Modeling (ODM) for MongoDB
- **express-session** - Server-side session management
- **bcryptjs** - Password hashing and verification

### Tools & Platforms
- **dotenv** - Environment variable management
- **npm** - Package manager
- **MongoDB Atlas** - Cloud database hosting

---

## 📁 Project Structure

```
Social Media Platform/
├── config/
│   └── db.js                  # MongoDB Atlas connection setup
├── models/
│   ├── User.js                # User schema (username, email, hashed password)
│   └── Post.js                # Post schema (content, author ref, likedBy[])
├── middleware/
│   └── auth.js                # Route guards (ensureAuthenticated, ensureGuest)
├── controllers/
│   ├── authController.js      # Register, login, logout logic
│   └── postController.js      # Feed display, post creation, like toggle
├── routes/
│   ├── authRoutes.js          # /register, /login, /logout routes
│   └── postRoutes.js          # /feed, /posts/create, /posts/:id/like routes
├── views/
│   ├── partials/
│   │   ├── header.ejs         # Shared navbar and HTML boilerplate
│   │   └── footer.ejs         # Shared footer and script loader
│   ├── login.ejs              # Login page
│   ├── register.ejs           # Registration page
│   ├── feed.ejs               # Community feed with post cards
│   └── create.ejs             # Create new post form
├── public/
│   ├── css/
│   │   └── styles.css         # Custom CSS with dark theme and animations
│   └── js/
│       └── main.js            # Client-side AJAX like/unlike logic
├── .env                       # Environment variables (PORT, DB URI, secret)
├── app.js                     # Express app entry point
├── seed.js                    # Database seeder script
├── package.json               # Project manifest and npm scripts
└── README.md                  # Project documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v16 or higher — [Download here](https://nodejs.org/)
- No local MongoDB needed — the project uses **MongoDB Atlas** (pre-configured)

### Installation Steps

```bash
# 1. Navigate into the project folder
cd "Social Media Platform"

# 2. Install all dependencies
npm install

# 3. (Optional) Seed the database with demo posts
npm run seed

# 4. Start the server
npm start
```

---

## 💻 Usage

### Running the Application

#### Start the Server
```bash
npm start
```
✅ App runs on `http://localhost:3000`

#### Seed Demo Data (Optional)
```bash
npm run seed
```
✅ Creates a demo user and 7 sample posts in the feed

---

### Application Workflow

1. **Register an Account**
   - Visit `http://localhost:3000/register`
   - Fill in username, email, and password
   - Automatically logged in and redirected to the feed

2. **Browse the Feed**
   - Visit `http://localhost:3000/feed`
   - See all community posts sorted newest first
   - Each post shows the author's name, avatar initial, and timestamp

3. **Create a Post**
   - Click **"+ Share Post"** in the navbar or feed header
   - Write your message (up to 500 characters)
   - Click **"Publish Post"** to share it with the community

4. **Like a Post**
   - Click the **♡ heart button** on any post card
   - The count updates instantly — no page reload!
   - Click again to unlike

5. **Log Out**
   - Click **"Log Out"** in the navbar
   - Session is destroyed and you are redirected to login

---

## 🔑 Demo Credentials

After running `npm run seed`, use these to log in instantly:

| Field    | Value        |
|----------|--------------|
| Username | `demo_user`  |
| Password | `demo1234`   |

---

## 🔗 Application Routes

| Method | Route               | Description                        | Auth Required |
|--------|---------------------|------------------------------------|---------------|
| GET    | `/`                 | Redirects to `/feed`               | No            |
| GET    | `/register`         | Show registration form             | No            |
| POST   | `/register`         | Submit registration                | No            |
| GET    | `/login`            | Show login form                    | No            |
| POST   | `/login`            | Submit login credentials           | No            |
| GET    | `/logout`           | Destroy session and log out        | No            |
| GET    | `/feed`             | View community post feed           | ✅ Yes        |
| GET    | `/posts/create`     | Show create post form              | ✅ Yes        |
| POST   | `/posts/create`     | Submit new post                    | ✅ Yes        |
| POST   | `/posts/:id/like`   | Toggle like on a post (JSON API)   | ✅ Yes        |

---

## 🎓 Viva / Interview Reference

### How data flows in this app:
```
[ Browser ]  →  POST /login  →  [ Express Controller ]  →  [ MongoDB ]
                                        ↓
                              Session created (userId stored)
                                        ↓
[ Browser ]  →  GET /feed   →  [ Auth Middleware ]  →  [ Post Controller ]
                                                               ↓
                                                    Fetch posts + populate authors
                                                               ↓
                                                     Render feed.ejs with data
```

### Key concepts to explain:
- **MVC Pattern** — Models, Views, and Controllers each have one clear responsibility
- **bcrypt hashing** — `genSalt(10)` + `hash()` on register; `compare()` on login
- **Sessions vs JWT** — Sessions are server-side, safer for EJS apps; JWT is for SPAs
- **AJAX Likes** — `fetch('/posts/:id/like', {method:'POST'})` → JSON → DOM update
- **Route Guards** — `ensureAuthenticated` middleware runs before every protected route
#   C o d e A l p h a _ C o n n e c t i f y  
 