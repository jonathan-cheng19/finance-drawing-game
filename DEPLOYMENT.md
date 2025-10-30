# Deployment Guide for Financial Pictionary

This game can be deployed to GitHub Pages at `https://jonathan-cheng19.github.io/financial-pictionary/`

## Prerequisites

1. A GitHub account (jonathan-cheng19)
2. The repository should be named `financial-pictionary`
3. Node.js and npm installed locally

## Deployment Steps

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

The repository is configured with GitHub Actions for automatic deployment.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/jonathan-cheng19/financial-pictionary.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select **GitHub Actions**
   - The workflow will automatically deploy on every push to main

3. **The site will be available at:**
   `https://jonathan-cheng19.github.io/financial-pictionary/`

### Option 2: Manual Deployment

If you prefer manual deployment:

1. **Install gh-pages package:**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Build and deploy:**
   ```bash
   npm run deploy
   ```

## Important Notes

### Backend Server
⚠️ **The backend server needs to be hosted separately!** GitHub Pages only hosts static files (the frontend).

Options for hosting the backend:
1. **Heroku** (Free tier available)
2. **Railway** (Easy deployment)
3. **Render** (Free tier)
4. **AWS/Google Cloud/Azure** (More complex but scalable)

### Update Socket.IO URL

After deploying the backend, update the socket connection in `client/src/App.jsx`:

```javascript
// Replace localhost with your deployed backend URL
const socket = io('https://your-backend-url.com')
```

### Environment Variables

For production deployment, consider using environment variables:

1. Create `.env.production` in the client folder:
   ```
   VITE_SOCKET_URL=https://your-backend-url.com
   ```

2. Update `App.jsx` to use the env variable:
   ```javascript
   const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
   ```

## Testing Locally Before Deployment

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Test with the production backend URL to ensure everything works**

## Troubleshooting

- **404 errors on routes**: Make sure the `base` in `vite.config.js` matches your repository name
- **Assets not loading**: Check that all asset paths are relative
- **Socket connection fails**: Verify the backend URL is correct and accessible
- **Build fails**: Check that all dependencies are installed with `npm ci`

## Repository Structure

```
financial-pictionary/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── client/                      # Frontend (deployed to GitHub Pages)
│   ├── dist/                    # Build output (auto-generated)
│   ├── src/
│   └── package.json
├── server/                      # Backend (needs separate hosting)
│   ├── index.js
│   └── package.json
└── README.md
```

## Next Steps After Deployment

1. ✅ Deploy frontend to GitHub Pages
2. ⚠️ Deploy backend to a hosting service
3. 🔧 Update socket URL in frontend to point to deployed backend
4. ✨ Share the link: `https://jonathan-cheng19.github.io/financial-pictionary/`
