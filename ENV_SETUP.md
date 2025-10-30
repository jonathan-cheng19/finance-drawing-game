# Example: Environment Variables for Backend URL

## Option 1: Direct URL (Simpler)

Edit `client/src/App.jsx` line 10:

```javascript
// Before (development)
const socket = io('http://localhost:3000')

// After (production) - Replace with your Railway URL
const socket = io('https://financial-pictionary-production.up.railway.app')
```

## Option 2: Environment Variables (Recommended)

### Step 1: Create environment files

**Create `client/.env.development`:**
```env
VITE_SOCKET_URL=http://localhost:3000
```

**Create `client/.env.production`:**
```env
VITE_SOCKET_URL=https://your-railway-url.up.railway.app
```

### Step 2: Update App.jsx

Replace line 10 in `client/src/App.jsx`:

```javascript
// Before
const socket = io('http://localhost:3000')

// After
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000')
```

### Step 3: Update .gitignore

Make sure `client/.gitignore` has:
```
.env.local
.env.*.local
```

But keep `.env.production` tracked so it deploys correctly.

---

## ✅ Benefits of Environment Variables

- **Automatic switching**: Dev uses localhost, production uses deployed URL
- **Easy updates**: Change URL without editing code
- **Best practice**: Follows standard deployment patterns

---

## 🎯 Which Should You Use?

- **Quick & Simple?** → Use Option 1 (Direct URL)
- **Professional Setup?** → Use Option 2 (Environment Variables)

Both work perfectly! Choose what you're comfortable with.
