# Deployment Guide

## Railway (Backend)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add the following environment variables:
   - `PORT` (Railway will set this automatically)
   - `FRONTEND_URL` (your GitHub Pages URL, e.g., `https://jonathan-cheng19.github.io`)

4. Deploy settings:
   - Build command: `npm install && cd client && npm install`
   - Start command: `node server/index.js`
   - Root directory: `/`

The Railway deployment will now work correctly!

## GitHub Pages (Frontend)

### Automatic Deployment

The frontend automatically deploys to GitHub Pages when you push to the main branch or your current branch.

### Manual Setup (First Time)

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically build and deploy

### Environment Variables

Before deploying, you need to set the backend URL:

1. In GitHub, go to **Settings** > **Secrets and variables** > **Actions**
2. Add a new repository variable:
   - Name: `VITE_BACKEND_URL`
   - Value: Your Railway backend URL (e.g., `https://your-app.railway.app`)

OR create a `.env` file locally:

```bash
VITE_BACKEND_URL=https://your-railway-app.railway.app
```

### Testing Locally

```bash
# Install dependencies
npm run install-all

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
cd client && npm run preview
```

## URLs

- **Frontend**: https://jonathan-cheng19.github.io/finance-drawing-game
- **Backend**: Your Railway URL (e.g., https://your-app.railway.app)

## Troubleshooting

### Railway Build Fails

- Make sure `vite` is in dependencies, not devDependencies in `client/package.json`
- Check the build logs in Railway dashboard

### GitHub Pages Shows 404

- Make sure GitHub Pages is enabled in repository settings
- Check that the workflow completed successfully in the Actions tab
- Wait a few minutes for DNS propagation

### CORS Errors

- Make sure `FRONTEND_URL` is set correctly in Railway
- Verify the backend URL in the frontend environment variables
- Check that both URLs use HTTPS in production
