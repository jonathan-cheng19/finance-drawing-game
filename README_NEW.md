# 🎨 Financial Pictionary

An interactive multiplayer drawing game where players guess financial terms! Built with React, Socket.IO, and modern UI components.

## 🌟 Features

- **Real-time Multiplayer**: Play with friends in real-time using Socket.IO
- **Team-Based Gameplay**: Players are divided into teams for competitive fun
- **Multiple Rounds**: 3 rounds with progressive difficulty
- **Letter Hints**: Letters are revealed over time to help guessers
- **Bonus Points**: Hosts can award bonus points for correct definitions
- **Modern UI**: Clean, responsive interface with Tailwind CSS and ShadCN UI components
- **Animated Backgrounds**: Engaging visual experience with smooth animations
- **Red Timer Warning**: Glowing red border when time is running out
- **Multiple Correct Answers**: Round continues until all players answer or time runs out

## 🎮 How to Play

1. **Create or Join a Game**: One player hosts and shares the room code
2. **Form Teams**: Host assigns players to teams
3. **Draw & Guess**: One player draws a financial term while teammates guess
4. **Score Points**: Faster correct guesses earn more points!
5. **Bonus Round**: Hosts award extra points for correct definitions
6. **Winner Takes All**: Team with the highest score wins!

## 🚀 Live Demo

Visit the game at: **[https://jonathan-cheng19.github.io/financial-pictionary/](https://jonathan-cheng19.github.io/financial-pictionary/)**

_(Note: You'll need to deploy the backend separately - see DEPLOYMENT.md for instructions)_

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS v4** - Utility-first styling
- **ShadCN UI** - Component library
- **Roboto Font** - Typography for headers

### Backend
- **Node.js** - Runtime environment
- **Express** - Web server
- **Socket.IO** - Real-time bidirectional communication

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonathan-cheng19/financial-pictionary.git
   cd financial-pictionary
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: `http://localhost:5173/financial-pictionary/`
   - Backend: `http://localhost:3000`

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to GitHub Pages and backend hosting platforms.

**Quick Steps:**
1. Push to GitHub
2. Enable GitHub Pages in repository settings (select "GitHub Actions" as source)
3. Deploy backend to Railway, Render, or Heroku
4. Update socket URL in `client/src/App.jsx` with your backend URL

## 📁 Project Structure

```
financial-pictionary/
├── .github/workflows/deploy.yml    # GitHub Actions
├── client/                          # Frontend (deployed to GitHub Pages)
├── server/                          # Backend (needs separate hosting)
├── DEPLOYMENT.md                    # Detailed deployment guide
└── README.md
```

## 🎯 Game Rules

### Rounds
- **Round 1 (Easy)**: 120 seconds, basic terms, 100-1000 points
- **Round 2 (Medium)**: 90 seconds, intermediate terms, 150-1500 points
- **Round 3 (Hard)**: 60 seconds, advanced terms, 200-2000 points

### Gameplay
- All players can answer correctly (round continues until everyone answers or time runs out)
- Timer warning: Red glowing border appears when ≤10 seconds remain
- Progressive letter hints revealed during gameplay

## 🎨 UI Design

- **Fonts**: Roboto (headers), Tahoma (body)
- **Colors**: White, black, grey, blue, green, red
- **Spacing**: Wide margins and padding (8px) for better readability
- **Borders**: Enhanced 2px borders for visual clarity

## 👤 Author

**Jonathan Cheng**
- GitHub: [@jonathan-cheng19](https://github.com/jonathan-cheng19)

---

**Ready to play?** Start at [https://jonathan-cheng19.github.io/financial-pictionary/](https://jonathan-cheng19.github.io/financial-pictionary/) 🎉
