# Backend Deployment Guide

## 🚀 Deploying the Socket.IO Backend

The Financial Pictionary backend uses Socket.IO and needs to be hosted on a platform that supports WebSocket connections.

---

## ⭐ Recommended: Railway (Easiest)

Railway has excellent Socket.IO support and is the easiest option.

### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `financial-pictionary` repository

3. **Configure Service:**
   - Railway will auto-detect Node.js
   - No additional configuration needed (uses `railway.json`)

4. **Deploy:**
   - Railway will automatically deploy
   - Your backend URL: `https://your-project.railway.app`

5. **Get Your URL:**
   - Copy the URL from Railway dashboard
   - It will look like: `https://financial-pictionary-production.up.railway.app`

---

## 🆓 Alternative: Render (Free Tier)

Render offers a free tier but services spin down after 15 minutes of inactivity.

### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create Web Service:**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub repository

3. **Configuration:**
   ```
   Name: financial-pictionary-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: node index.js
   Instance Type: Free
   ```

4. **Advanced Settings (Optional):**
   - Add environment variable: `NODE_ENV=production`
   - Health Check Path: `/health`

5. **Deploy:**
   - Click "Create Web Service"
   - Your URL: `https://your-app-name.onrender.com`

⚠️ **Note:** Free tier spins down after inactivity. First request after sleep takes ~30 seconds to wake up.

---

## 🌐 Alternative: Fly.io

### Steps:

1. **Install Fly CLI:**
   ```bash
   # PowerShell (Windows)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Navigate to server directory:**
   ```bash
   cd server
   ```

4. **Launch app:**
   ```bash
   fly launch
   ```
   - Choose app name
   - Select region
   - Don't deploy yet

5. **Update fly.toml:**
   ```toml
   [env]
     PORT = "8080"

   [[services]]
     internal_port = 8080
     protocol = "tcp"

     [[services.ports]]
       port = 80
       handlers = ["http"]

     [[services.ports]]
       port = 443
       handlers = ["tls", "http"]
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

Your URL: `https://your-app-name.fly.dev`

---

## 💰 Alternative: Heroku (Paid)

Heroku no longer has a free tier but is very reliable.

### Steps:

1. **Install Heroku CLI:**
   ```bash
   # From your project root
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy server only:**
   ```bash
   git subtree push --prefix server heroku main
   ```

Your URL: `https://your-app-name.herokuapp.com`

**Cost:** Starts at $5/month for Eco dynos

---

## 🔧 After Deployment

### 1. Test Your Backend

Visit your backend URL in a browser. You should see:
```json
{
  "status": "ok",
  "message": "Financial Pictionary Server Running",
  "activeRooms": 0,
  "timestamp": "2025-10-29T..."
}
```

### 2. Update Frontend

Edit `client/src/App.jsx` and replace the Socket.IO URL:

**Before:**
```javascript
const socket = io('http://localhost:3000')
```

**After:**
```javascript
const socket = io('https://your-backend-url.com')
```

**Or use environment variables (recommended):**

Create `client/.env.production`:
```env
VITE_SOCKET_URL=https://your-backend-url.com
```

Update `client/src/App.jsx`:
```javascript
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
```

### 3. Rebuild and Redeploy Frontend

```bash
cd client
npm run build
npm run deploy
```

Or push to GitHub to trigger automatic deployment via GitHub Actions.

---

## ✅ Verification Checklist

- [ ] Backend URL is accessible in browser
- [ ] Health check endpoint returns `{"status":"healthy"}`
- [ ] Frontend Socket.IO URL is updated
- [ ] CORS is properly configured (already done in server code)
- [ ] Both frontend and backend are deployed
- [ ] Can create a room and join successfully
- [ ] Real-time drawing works
- [ ] Multiple players can connect

---

## 🐛 Troubleshooting

### WebSocket Connection Failed
- Check browser console for CORS errors
- Verify backend URL is correct and accessible
- Ensure backend platform supports WebSockets

### "Not allowed by CORS"
- Backend already configured to allow GitHub Pages
- If using custom domain, add it to `allowedOrigins` in `server/index.js`

### Backend Spinning Down (Render Free Tier)
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier or use Railway instead
- Add a ping service like UptimeRobot to keep it alive

### Railway "App Crashed"
- Check Railway logs in dashboard
- Verify `package.json` has correct start script
- Ensure all dependencies are in `dependencies` not `devDependencies`

---

## 📊 Platform Comparison

| Platform | Free Tier | Socket.IO | Spin Down | Best For |
|----------|-----------|-----------|-----------|----------|
| **Railway** | $5 credit/mo | ✅ Perfect | ❌ No | Production |
| **Render** | ✅ Yes | ✅ Good | ✅ Yes (15min) | Testing |
| **Fly.io** | 3 VMs | ✅ Excellent | ❌ No | Performance |
| **Heroku** | ❌ Paid only | ✅ Perfect | ❌ No | Enterprise |

---

## 🎉 All Done!

Once your backend is deployed and frontend is updated, your game will be fully playable at:

**https://jonathan-cheng19.github.io/financial-pictionary/**

Players can create rooms, draw, and guess in real-time from anywhere in the world!
