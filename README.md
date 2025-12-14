# FitPlanHub - Fitness Plans Platform

A full-stack web application where certified trainers can create and manage fitness plans, and users can discover, purchase, and follow fitness plans from their favorite trainers.

## 🎯 Features

### For Users
- **Browse Plans**: View all available fitness plans with preview information
- **Purchase Plans**: Subscribe to fitness plans with simulated payment
- **Follow Trainers**: Follow your favorite trainers to see their plans in your feed
- **Personalized Feed**: View plans from trainers you follow and plans you've purchased
- **Plan Details**: Access full plan details after subscription (preview for non-subscribers)

### For Trainers
- **Create Plans**: Create fitness plans with title, description, price, and duration
- **Manage Plans**: Edit and delete your own fitness plans
- **Dashboard**: Centralized dashboard to manage all your plans

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database)
- **npm** (comes with Node.js) or **yarn**

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd FitPlanHub
```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd fitplanhub-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a file named `.env` in the `fitplanhub-backend` directory with the following content:
   ```env
   MONGO_URI=mongodb://localhost:27017/fitplanhub
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```
   
   **Note:** 
   - If using MongoDB Atlas (cloud), replace `MONGO_URI` with your connection string from Atlas
   - Replace `JWT_SECRET` with a long random string (e.g., use a password generator)

4. **Start MongoDB:**
   - **Local MongoDB**: Make sure MongoDB is running on your system
     - Windows: MongoDB should start automatically as a service
     - Mac/Linux: Run `mongod` in a terminal
   - **MongoDB Atlas**: No need to start anything, just use your connection string

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd fitplanhub-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ▶️ Running the Application

### Start the Backend Server

1. **In the backend terminal:**
   ```bash
   cd fitplanhub-backend
   npm start
   ```

2. **You should see:**
   ```
   MongoDB connected
   Server running on port 5000
   ```

3. **The backend API will be available at:** `http://localhost:5000`

### Start the Frontend Application

1. **In a new terminal, navigate to the frontend directory:**
   ```bash
   cd fitplanhub-frontend
   npm start
   ```

2. **The React app will automatically open in your browser at:** `http://localhost:3000`

   If it doesn't open automatically, manually navigate to `http://localhost:3000` in your browser.

## 📱 Using the Application

### First Time Setup

1. **Create a Trainer Account:**
   - Click "Sign Up" in the navbar
   - Fill in your details
   - Select "Trainer" as your role
   - Click "Sign Up"
   - You'll be redirected to login

2. **Login as Trainer:**
   - Use your email and password to login
   - You'll be taken to the Trainer Dashboard
   - Create your first fitness plan!

3. **Create a User Account:**
   - Logout from trainer account
   - Click "Sign Up" again
   - Select "User" as your role
   - Create a new account

4. **Login as User:**
   - Login with your user credentials
   - Browse plans, follow trainers, and purchase plans!

### Key Features to Try

- **As a Trainer:**
  - Create multiple fitness plans
  - Edit plan details
  - Delete plans you no longer need

- **As a User:**
  - Browse all plans on the landing page
  - Click "All Plans" in navbar to see all plans
  - View plan details (preview for non-subscribers)
  - Subscribe to plans (simulated payment)
  - Follow trainers from their profile pages
  - View personalized feed with plans from followed trainers

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user/trainer
- `POST /api/auth/login` - Login user/trainer
- `GET /api/auth/me` - Get current user info

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID (with access control)
- `GET /api/plans/trainer/my-plans` - Get trainer's own plans
- `POST /api/plans` - Create plan (Trainer only)
- `PUT /api/plans/:id` - Update plan (Owner only)
- `DELETE /api/plans/:id` - Delete plan (Owner only)

### Subscriptions
- `POST /api/subscribe/:planId` - Subscribe to a plan
- `GET /api/subscribe/check/:planId` - Check subscription status

### Follow
- `POST /api/follow/follow/:trainerId` - Follow a trainer
- `POST /api/follow/unfollow/:trainerId` - Unfollow a trainer
- `GET /api/follow/following` - Get list of followed trainers

### Feed
- `GET /api/feed` - Get personalized feed (followed trainers + purchased plans)

### Trainer
- `GET /api/trainer/:trainerId` - Get trainer profile with plans

## 📁 Project Structure

```
FitPlanHub/
├── fitplanhub-backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── planController.js  # Plan CRUD operations
│   │   ├── subscriptionController.js  # Subscription logic
│   │   ├── followController.js # Follow/unfollow logic
│   │   ├── feedController.js   # Feed logic
│   │   └── trainerController.js # Trainer profile
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Plan.js             # Plan schema
│   │   └── Subscription.js     # Subscription schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth routes
│   │   ├── planRoutes.js       # Plan routes
│   │   ├── subscriptionRoutes.js # Subscription routes
│   │   ├── followRoutes.js     # Follow routes
│   │   ├── feedRoutes.js       # Feed routes
│   │   └── trainerRoutes.js   # Trainer routes
│   ├── server.js               # Express server setup
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (create this)
│
└── fitplanhub-frontend/
    ├── public/
    │   └── index.html          # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js       # Navigation bar
    │   │   ├── Navbar.css      # Navbar styles
    │   │   ├── ProtectedRoute.js # Route protection
    │   │   ├── PaymentModal.js # Payment simulation
    │   │   └── PaymentModal.css # Payment modal styles
    │   ├── context/
    │   │   └── AuthContext.js  # Authentication context
    │   ├── pages/
    │   │   ├── LandingPage.js # Home page
    │   │   ├── Login.js        # Login page
    │   │   ├── Signup.js       # Signup page
    │   │   ├── TrainerDashboard.js # Trainer dashboard
    │   │   ├── PlanDetails.js  # Plan details page
    │   │   ├── UserFeed.js     # User feed page
    │   │   └── TrainerProfile.js # Trainer profile
    │   ├── services/
    │   │   └── api.js          # API service layer
    │   ├── App.js              # Main app component
    │   ├── App.css             # App styles
    │   ├── index.js            # React entry point
    │   └── index.css           # Global styles
    ├── package.json            # Frontend dependencies
    └── README.md               # Frontend README
```

## 🔐 Default Configuration

- **Backend Port:** 5000
- **Frontend Port:** 3000
- **Database:** MongoDB (local or Atlas)

## 🐛 Troubleshooting

### Backend Issues

**Problem: "MongoDB connection failed"**
- Solution: Make sure MongoDB is running
  - Check if MongoDB service is running (Windows: Services, Mac/Linux: `sudo systemctl status mongod`)
  - Verify your `MONGO_URI` in `.env` file is correct
  - For MongoDB Atlas, ensure your IP is whitelisted

**Problem: "Port 5000 already in use"**
- Solution: Change the port in `server.js` or stop the process using port 5000

**Problem: "JWT_SECRET is missing"**
- Solution: Make sure you created the `.env` file with `JWT_SECRET` defined

### Frontend Issues

**Problem: "Cannot connect to server"**
- Solution: 
  - Make sure the backend is running on port 5000
  - Check if `API_URL` in `src/services/api.js` is `http://localhost:5000/api`
  - Verify CORS is enabled in backend (it should be)

**Problem: "npm install fails"**
- Solution:
  - Delete `node_modules` folder and `package-lock.json`
  - Run `npm install` again
  - Make sure you have Node.js v14 or higher

**Problem: "Page not found after login"**
- Solution: Clear browser cache and localStorage, then try again

## 📝 Notes

- **Payment Simulation**: The payment process is simulated - no real transactions occur
- **Authentication**: Uses JWT tokens stored in localStorage
- **Access Control**: Non-subscribers see preview (title, trainer, price), subscribers see full details
- **Role-Based Access**: Trainers can only create/edit/delete their own plans

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Authentication](https://jwt.io/introduction)

## 📄 License

This project is created for educational purposes.

## 👤 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check that both backend and frontend servers are running
5. Review browser console for errors (F12)

---

**Happy Coding! 💪**

