import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateTeamName, generateRoomCode } from './utils/gameUtils.js';
import { WORD_POOLS, ROUND_CONFIG, TOTAL_ROUNDS } from './config/gameConfig.js';

const app = express();
app.use(cors());

// Health check endpoint for deployment platforms
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Financial Pictionary Server Running',
    activeRooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const httpServer = createServer(app);

// Allowed origins for CORS (production and development)
const allowedOrigins = [
  'http://localhost:5173',
  'https://jonathan-cheng19.github.io',
  'https://localhost:5173', // For local HTTPS testing
];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store game rooms
const rooms = new Map();

// Helper function to get room
const getRoom = (roomCode) => rooms.get(roomCode);

// Helper function to broadcast room update
const broadcastRoomUpdate = (roomCode) => {
  const room = getRoom(roomCode);
  if (room) {
    // Create deep copies to ensure React detects changes
    const teamsCopy = JSON.parse(JSON.stringify(room.teams));
    const playersCopy = JSON.parse(JSON.stringify(room.players));
    
    console.log('Broadcasting room update with teams:', teamsCopy.map(t => `${t.name}: ${t.score}`).join(', '));
    
    io.to(roomCode).emit('roomUpdate', {
      teams: teamsCopy,
      players: playersCopy,
      gameState: room.gameState,
      currentRound: room.currentRound,
      scores: room.scores
    });
  }
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new game room
  socket.on('createRoom', (callback) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      host: socket.id,
      players: [],
      teams: [],
      gameState: 'waiting', // waiting, playing, roundBreak, ended
      currentRound: 0,
      currentWord: null,
      currentDrawing: [],
      scores: {},
      roundStartTime: null,
      revealedLetters: []
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);

    callback({ success: true, roomCode, isHost: true });
    console.log(`Room created: ${roomCode}`);
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomCode, playerName }, callback) => {
    const room = getRoom(roomCode);

    if (!room) {
      callback({ success: false, message: 'Room not found' });
      return;
    }

    if (room.gameState !== 'waiting') {
      callback({ success: false, message: 'Game already in progress' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      teamId: null,
      score: 0
    };

    room.players.push(player);
    socket.join(roomCode);

    callback({
      success: true,
      roomCode,
      isHost: socket.id === room.host
    });

    broadcastRoomUpdate(roomCode);
    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Assign players to teams
  socket.on('assignTeams', ({ roomCode }) => {
    const room = getRoom(roomCode);

    if (!room || socket.id !== room.host) {
      return;
    }

    // Shuffle players
    const shuffledPlayers = [...room.players].sort(() => Math.random() - 0.5);

    // Determine number of teams (2-4 teams based on player count)
    const playerCount = shuffledPlayers.length;
    const teamCount = Math.min(4, Math.max(2, Math.floor(playerCount / 2)));

    // Create teams
    room.teams = [];
    for (let i = 0; i < teamCount; i++) {
      room.teams.push({
        id: i,
        name: generateTeamName(),
        players: [],
        score: 0
      });
    }

    // Distribute players evenly across teams
    shuffledPlayers.forEach((player, index) => {
      const teamIndex = index % teamCount;
      player.teamId = teamIndex;
      room.teams[teamIndex].players.push(player);
    });

    broadcastRoomUpdate(roomCode);
  });

  // Start the game
  socket.on('startGame', ({ roomCode }) => {
    const room = getRoom(roomCode);

    if (!room || socket.id !== room.host) {
      return;
    }

    room.gameState = 'playing';
    room.currentRound = 1;

    // Select a word for round 1 based on difficulty
    const difficulty = ROUND_CONFIG[1].difficulty;
    const wordPool = WORD_POOLS[difficulty];
    room.currentWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    room.roundStartTime = Date.now();
    room.revealedLetters = [];
    room.currentDrawing = [];
    room.playersAnswered = [];

    // Find space positions in the word
    const spacePositions = [];
    for (let i = 0; i < room.currentWord.length; i++) {
      if (room.currentWord[i] === ' ') {
        spacePositions.push(i);
      }
    }

    io.to(roomCode).emit('gameStarted', {
      currentRound: room.currentRound,
      wordLength: room.currentWord.length,
      roundConfig: ROUND_CONFIG[1],
      totalRounds: TOTAL_ROUNDS,
      spacePositions: spacePositions
    });

    // Send word to host only
    io.to(room.host).emit('wordToDrawn', {
      word: room.currentWord,
      definition: getWordDefinition(room.currentWord)
    });

    // Start letter reveal timer
    startLetterReveal(roomCode);

    console.log(`Game started in room ${roomCode}`);
  });

  // Handle drawing data
  socket.on('draw', ({ roomCode, drawing }) => {
    const room = getRoom(roomCode);

    if (!room || socket.id !== room.host) {
      return;
    }

    room.currentDrawing = drawing;
    io.to(roomCode).emit('drawingUpdate', { drawing });
  });

  // Handle guess
  socket.on('guess', ({ roomCode, guess }) => {
    const room = getRoom(roomCode);

    if (!room || room.gameState !== 'playing') {
      return;
    }

    const player = room.players.find(p => p.id === socket.id);
    if (!player) {
      console.log(`❌ Player not found for socket ${socket.id}`);
      return;
    }

    console.log(`📝 ${player.name} (team ID: ${player.teamId}) is guessing: "${guess}"`);

    // Check if player already answered correctly this round
    if (!room.playersAnswered) room.playersAnswered = [];
    if (room.playersAnswered.includes(socket.id)) {
      console.log(`⚠️  ${player.name} already answered this round`);
      return; // Player already answered correctly
    }

    const team = room.teams.find(t => t.id === player.teamId);
    if (!team) {
      console.log(`❌ Team not found for player ${player.name} (teamId: ${player.teamId})`);
      return;
    }

    // Check if guess is correct
    if (guess.toLowerCase().trim() === room.currentWord.toLowerCase()) {
      const timeElapsed = Date.now() - room.roundStartTime;
      const roundConfig = ROUND_CONFIG[room.currentRound];
      const points = calculatePoints(timeElapsed, roundConfig);

      player.score += points;
      team.score += points;
      room.playersAnswered.push(socket.id);

      console.log(`✓ ${player.name} (${socket.id}) scored ${points} points! Total: ${player.score}`);
      console.log(`  Team ${team.name} now has ${team.score} points`);
      console.log(`  All team scores:`, room.teams.map(t => `${t.name}: ${t.score}`).join(', '));

      // Send correct guess notification only to the player who guessed
      console.log(`  Sending correctGuess event to socket: ${socket.id}`);
      socket.emit('correctGuess', {
        playerName: player.name,
        teamName: team.name,
        word: room.currentWord,
        points
      });

      // Always broadcast updated scores immediately
      console.log(`  Broadcasting score update to room ${roomCode}`);
      broadcastRoomUpdate(roomCode);

      // Check if all non-host players have answered
      const nonHostPlayers = room.players.filter(p => p.id !== room.host);
      console.log(`  Players answered: ${room.playersAnswered.length}/${nonHostPlayers.length}`);
      if (room.playersAnswered.length >= nonHostPlayers.length) {
        // All players have answered, move to round break
        console.log(`  All players answered! Moving to round break.`);
        startRoundBreak(roomCode);
      }
    }
  });

  // Award bonus points
  socket.on('awardBonus', ({ roomCode, teamId, points }) => {
    const room = getRoom(roomCode);

    if (!room || socket.id !== room.host) {
      return;
    }

    const team = room.teams.find(t => t.id === teamId);
    if (team) {
      team.score += points;
      broadcastRoomUpdate(roomCode);

      io.to(roomCode).emit('bonusAwarded', {
        teamName: team.name,
        points
      });
    }
  });

  // Start next round
  socket.on('nextRound', ({ roomCode }) => {
    const room = getRoom(roomCode);

    if (!room || socket.id !== room.host) {
      return;
    }

    if (room.currentRound >= TOTAL_ROUNDS) {
      endGame(roomCode);
      return;
    }

    room.currentRound++;
    room.gameState = 'playing';

    const difficulty = ROUND_CONFIG[room.currentRound].difficulty;
    const wordPool = WORD_POOLS[difficulty];
    room.currentWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    room.roundStartTime = Date.now();
    room.revealedLetters = [];
    room.currentDrawing = [];
    room.playersAnswered = []; // Reset answered players for new round

    // Find space positions in the word
    const spacePositions = [];
    for (let i = 0; i < room.currentWord.length; i++) {
      if (room.currentWord[i] === ' ') {
        spacePositions.push(i);
      }
    }

    io.to(roomCode).emit('roundStarted', {
      currentRound: room.currentRound,
      wordLength: room.currentWord.length,
      roundConfig: ROUND_CONFIG[room.currentRound],
      totalRounds: TOTAL_ROUNDS,
      spacePositions: spacePositions
    });

    io.to(room.host).emit('wordToDrawn', {
      word: room.currentWord,
      definition: getWordDefinition(room.currentWord)
    });

    startLetterReveal(roomCode);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Find and update rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        // If host disconnects, end the game
        if (socket.id === room.host) {
          io.to(roomCode).emit('hostDisconnected');
          rooms.delete(roomCode);
        } else {
          broadcastRoomUpdate(roomCode);
        }
      }
    });
  });
});

// Calculate points based on time elapsed
function calculatePoints(timeElapsed, roundConfig) {
  const { timeLimit, maxPoints } = roundConfig;
  const timeInSeconds = timeElapsed / 1000;

  if (timeInSeconds > timeLimit) {
    return 0;
  }

  // Linear decrease: faster guess = more points
  const pointsPerSecond = maxPoints / timeLimit;
  const points = Math.max(100, Math.round(maxPoints - (timeInSeconds * pointsPerSecond)));

  return points;
}

// Start letter reveal timer
function startLetterReveal(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  const roundConfig = ROUND_CONFIG[room.currentRound];
  const word = room.currentWord;
  const revealInterval = (roundConfig.timeLimit * 1000) / word.length;

  const revealTimer = setInterval(() => {
    if (room.gameState !== 'playing') {
      clearInterval(revealTimer);
      return;
    }

    if (room.revealedLetters.length < word.length) {
      // Find unrevealed positions
      const unrevealedPositions = [];
      for (let i = 0; i < word.length; i++) {
        if (!room.revealedLetters.some(r => r.position === i)) {
          unrevealedPositions.push(i);
        }
      }

      if (unrevealedPositions.length > 0) {
        // Reveal a random unrevealed letter
        const position = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)];
        room.revealedLetters.push({
          position,
          letter: word[position]
        });

        console.log(`📝 Revealing letter at position ${position}: "${word[position]}" for word "${word}"`);
        console.log(`   Total revealed: ${room.revealedLetters.length}/${word.length}`);

        // Deep copy to ensure React detects changes
        const revealedLettersCopy = JSON.parse(JSON.stringify(room.revealedLetters));
        
        io.to(roomCode).emit('letterRevealed', {
          revealedLetters: revealedLettersCopy
        });
      }
    }

    // Check if time is up
    const timeElapsed = Date.now() - room.roundStartTime;
    if (timeElapsed >= roundConfig.timeLimit * 1000) {
      clearInterval(revealTimer);
      startRoundBreak(roomCode);
    }
  }, revealInterval);
}

// Start round break
function startRoundBreak(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  room.gameState = 'roundBreak';

  io.to(roomCode).emit('roundBreak', {
    word: room.currentWord,
    currentRound: room.currentRound
  });
}

// End the game
function endGame(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  room.gameState = 'ended';

  // Sort teams by score
  const rankedTeams = [...room.teams].sort((a, b) => b.score - a.score);

  io.to(roomCode).emit('gameEnded', {
    rankedTeams,
    players: room.players
  });
}

// Get word definition (simplified - you could use a dictionary API)
function getWordDefinition(word) {
  const definitions = {
    // Round 1 - Basic terms
    'budget': 'A plan for managing income and expenses',
    'debt': 'Money owed to another person or organization',
    'credit card': 'A card allowing purchases on borrowed money',
    'savings': 'Money set aside for future use',
    'income': 'Money received from work or investments',
    'expense': 'Money spent on goods or services',
    'loan': 'Money borrowed that must be repaid with interest',
    'interest': 'The cost of borrowing money',
    'bank': 'A financial institution that holds and lends money',
    'cash': 'Physical money in bills and coins',

    // Round 2 - Intermediate terms
    'stock market': 'A marketplace for buying and selling company shares',
    'emergency fund': 'Savings reserved for unexpected expenses',
    'credit score': 'A number representing creditworthiness',
    'mortgage': 'A loan specifically for purchasing property',
    'investment': 'Putting money into assets to generate returns',
    'inflation': 'The rate at which prices increase over time',
    'dividend': 'A portion of company profits paid to shareholders',
    'retirement': 'The period after ending one\'s career',
    'insurance': 'Protection against financial loss',
    'tax': 'Government-required payment on income or purchases',

    // Round 3 - Advanced terms
    'diversification': 'Spreading investments across different assets',
    'compound interest': 'Interest calculated on initial principal and accumulated interest',
    'asset allocation': 'Dividing investments among different asset categories',
    'capital gains': 'Profit from selling an asset at a higher price',
    'liquidity': 'How easily an asset can be converted to cash',
    'depreciation': 'The decrease in value of an asset over time',
    'equity': 'Ownership value in an asset after debts',
    'portfolio': 'A collection of financial investments',
    'mutual fund': 'An investment pooling money from many investors',
    'volatility': 'The degree of variation in investment prices'
  };

  return definitions[word.toLowerCase()] || 'A financial term';
}

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
