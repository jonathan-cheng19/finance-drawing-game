# Financial Pictionary

A real-time multiplayer drawing game focused on personal finance terms.

## Features

- **Team-Based Gameplay**: Players are automatically sorted into teams with funny, alliterative finance-related names
- **3 Progressive Rounds**: Terms get more obscure and timers get faster with higher point values
- **Real-Time Drawing**: Host draws while players guess
- **Smart Scoring**: Faster guesses earn more points
- **Letter Hints**: Progressive letter reveals as time runs out
- **Definition Bonuses**: Between-round opportunities to earn extra points
- **Individual Stats**: End-game summary showing team placements and individual contributions

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser:
   - Game: http://localhost:5173
   - Server: http://localhost:3000

## How to Play

1. **Host**: Create a game room and become the drawer
2. **Players**: Join with a room code and enter your name
3. **Teams**: Automatically assigned to teams with fun finance names
4. **Draw & Guess**: Host draws finance terms, teams compete to guess first
5. **Score**: Faster guesses = more points
6. **Win**: Team with the most points after 3 rounds wins!

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Real-time**: WebSocket communication
- **Styling**: CSS with minimalist design
