# Quiz App

A comprehensive quiz application built with the MERN stack that allows users to take quizzes, track their progress, and earn certificates while providing administrators with powerful management tools.

## 🚀 Demo

**Live Demo:** [https://quiz-app-1-jdgz.onrender.com](https://quiz-app-1-jdgz.onrender.com)

## 📋 Features

### 👤 User Features
- **Authentication System**: Secure user registration and login
- **Quiz Management**: Browse and attempt quizzes across various subjects
- **Leaderboard**: View rankings and compete with other users
- **Certificate Generation**: Earn certificates when scoring 75% or higher on any subject
- **Analytics Dashboard**: Track personal performance and progress over time
- **User Profile**: Manage personal information and view quiz history

### 🔧 Admin Features
- **Course Management**: Add, edit, and organize courses
- **Topic Management**: Create and modify topics within courses
- **Question Bank**: Add, edit, and manage quiz questions
- **User Management**: View and delete user accounts when necessary
- **Performance Analytics**: View user performance data through interactive pie charts
- **Content Control**: Full CRUD operations on educational content

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **CSS/Styled Components** - Styling and responsive design
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Deployment
- **Render** - Cloud hosting platform

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=development
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📱 Usage

### For Users
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Browse Courses**: Explore available courses and topics
3. **Take Quizzes**: Attempt quizzes and test your knowledge
4. **View Results**: Check your scores and performance analytics
5. **Earn Certificates**: Achieve 75% or higher to unlock certificates
6. **Track Progress**: Monitor your improvement through the analytics dashboard

### For Administrators
1. **Admin Dashboard**: Access administrative controls after login
2. **Manage Content**: Add/edit courses, topics, and questions
3. **Monitor Users**: View user performance and manage accounts
4. **Analytics**: Review system-wide performance metrics

## 🎯 Key Components

### Authentication
- JWT-based authentication system
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt

### Quiz Engine
- Dynamic question loading
- Real-time score calculation
- Progress tracking and analytics

### Certificate System
- Automated certificate generation
- 75% threshold requirement
- Downloadable certificates

### Analytics
- Personal performance tracking
- Admin dashboard with pie charts
- Leaderboard functionality

## 🚀 Deployment

The application is deployed on Render. To deploy your own instance:

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service
4. Configure environment variables
5. Deploy automatically from your repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Please report any bugs or issues in the GitHub Issues section

## 📞 Support

For support, please contact [ganganaveenpotu@gmail.com] or create an issue in the repository.

---

**Built with ❤️ using the MERN Stack**
