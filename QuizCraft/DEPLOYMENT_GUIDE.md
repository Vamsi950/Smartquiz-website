# Deployment Guide

## Prerequisites
1. **MongoDB Atlas Account** (for database)
2. **GitHub Repository** (your code should be pushed to GitHub)
3. **Render Account** (for hosting)

## Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string (MONGO_URI)

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `your-app-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: `main` (or your default branch)

5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret string (e.g., `your-super-secret-jwt-key-2024`)
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

### Option B: Using render.yaml (Automatic)
1. The `render.yaml` file is already configured
2. Render will automatically detect and use it
3. Just connect your repository and deploy

## Step 3: Deploy Frontend to Render

1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `your-app-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main`

4. Click "Create Static Site"

## Step 4: Update Frontend API Configuration

You'll need to update your frontend to use the deployed backend URL. Look for API calls in your frontend code and update the base URL.

### Example:
```javascript
// Before (localhost)
const API_BASE_URL = 'http://localhost:5000';

// After (deployed backend)
const API_BASE_URL = 'https://your-app-backend.onrender.com';
```

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test all functionality
3. Check that API calls work correctly

## Alternative Deployment Options

### Vercel (Frontend)
- Great for React apps
- Automatic deployments
- Excellent performance

### Railway
- Good for full-stack apps
- Easy environment management
- Automatic deployments

### Heroku
- Traditional choice
- Requires credit card
- Good for production apps

## Environment Variables Reference

### Backend (.env file for local development)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-2024
NODE_ENV=development
PORT=5000
```

### Frontend
Update your API base URL to point to your deployed backend.

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Database Connection**: Verify your MongoDB Atlas connection string
3. **Build Failures**: Check that all dependencies are in package.json
4. **Environment Variables**: Ensure all required env vars are set in Render

### Backend CORS Configuration:
Make sure your backend allows requests from your frontend domain:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

## Next Steps

1. Set up a custom domain (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and logging
4. Configure automatic deployments

Your app should now be live and accessible from anywhere! 