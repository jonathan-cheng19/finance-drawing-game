import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Home from './components/Home'
import WaitingRoom from './components/WaitingRoom'
import GameBoard from './components/GameBoard'
import RoundBreak from './components/RoundBreak'
import GameEnd from './components/GameEnd'
import './App.css'

// Get backend URL from environment variable, fallback to localhost
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
const socket = io(BACKEND_URL)

function App() {
  const [gameState, setGameState] = useState('home') // home, waiting, playing, roundBreak, ended
  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [currentRound, setCurrentRound] = useState(0)
  const [wordToDrawn, setWordToDrawn] = useState(null)
  const [wordLength, setWordLength] = useState(0)
  const [roundConfig, setRoundConfig] = useState(null)
  const [revealedLetters, setRevealedLetters] = useState([])
  const [drawing, setDrawing] = useState([])
  const [roundBreakData, setRoundBreakData] = useState(null)
  const [gameEndData, setGameEndData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [totalRounds, setTotalRounds] = useState(6)
  // Removed correctGuessData - no longer using overlay

  useEffect(() => {
    // Connection status
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Room update
    socket.on('roomUpdate', (data) => {
      const timestamp = new Date().toLocaleTimeString()
      console.log(`📊 [${timestamp}] Room update received:`, { 
        teams: data.teams?.map(t => ({ name: t.name, score: t.score })),
        players: data.players?.map(p => ({ name: p.name, score: p.score }))
      })
      console.log('  Setting teams state:', data.teams)
      console.log('  Setting players state:', data.players)
      setTeams(data.teams)
      setPlayers(data.players)
      if (data.gameState) {
        setGameState(data.gameState)
      }
      if (data.currentRound) {
        setCurrentRound(data.currentRound)
      }
    })

    // Game started
    socket.on('gameStarted', (data) => {
      setGameState('playing')
      setCurrentRound(data.currentRound)
      setWordLength(data.wordLength)
      setRoundConfig(data.roundConfig)
      setRevealedLetters([])
      setDrawing([])
      setTotalRounds(data.totalRounds || 6)
    })

    // Word to draw (host only)
    socket.on('wordToDrawn', (data) => {
      setWordToDrawn(data)
    })

    // Drawing update
    socket.on('drawingUpdate', (data) => {
      setDrawing(data.drawing)
    })

    // Letter revealed
    socket.on('letterRevealed', (data) => {
      setRevealedLetters(data.revealedLetters)
    })

    // Correct guess - just log it, no overlay
    socket.on('correctGuess', (data) => {
      console.log('🎉 Received correctGuess event:', data)
      console.log('Current playerName:', playerName)
      // Points are updated via roomUpdate event
    })

    // Round break
    socket.on('roundBreak', (data) => {
      setGameState('roundBreak')
      setRoundBreakData(data)
    })

    // Round started
    socket.on('roundStarted', (data) => {
      setGameState('playing')
      setCurrentRound(data.currentRound)
      setWordLength(data.wordLength)
      setRoundConfig(data.roundConfig)
      setRevealedLetters([])
      setDrawing([])
      setWordToDrawn(null)
      setTotalRounds(data.totalRounds || 6)
      setCorrectGuessData(null)
    })

    // Game ended
    socket.on('gameEnded', (data) => {
      setGameState('ended')
      setGameEndData(data)
    })

    // Host disconnected
    socket.on('hostDisconnected', () => {
      alert('Host disconnected. Returning to home.')
      resetGame()
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('roomUpdate')
      socket.off('gameStarted')
      socket.off('wordToDrawn')
      socket.off('drawingUpdate')
      socket.off('letterRevealed')
      socket.off('correctGuess')
      socket.off('roundBreak')
      socket.off('roundStarted')
      socket.off('gameEnded')
      socket.off('hostDisconnected')
    }
  }, [])

  const createRoom = (name) => {
    setPlayerName(name)
    socket.emit('createRoom', (response) => {
      if (response.success) {
        setRoomCode(response.roomCode)
        setIsHost(response.isHost)
        setGameState('waiting')
      }
    })
  }

  const joinRoom = (code, name) => {
    setPlayerName(name)
    socket.emit('joinRoom', { roomCode: code, playerName: name }, (response) => {
      if (response.success) {
        setRoomCode(response.roomCode)
        setIsHost(response.isHost)
        setGameState('waiting')
      } else {
        alert(response.message)
      }
    })
  }

  const assignTeams = () => {
    socket.emit('assignTeams', { roomCode })
  }

  const startGame = () => {
    socket.emit('startGame', { roomCode })
  }

  const sendDrawing = (drawingData) => {
    socket.emit('draw', { roomCode, drawing: drawingData })
  }

  const sendGuess = (guess) => {
    console.log(`📝 Sending guess: "${guess}" from player: ${playerName}`)
    socket.emit('guess', { roomCode, guess })
  }

  const awardBonus = (teamId, points) => {
    socket.emit('awardBonus', { roomCode, teamId, points })
  }

  const nextRound = () => {
    socket.emit('nextRound', { roomCode })
  }

  const resetGame = () => {
    setGameState('home')
    setRoomCode('')
    setIsHost(false)
    setPlayerName('')
    setTeams([])
    setPlayers([])
    setCurrentRound(0)
    setWordToDrawn(null)
    setWordLength(0)
    setRoundConfig(null)
    setRevealedLetters([])
    setDrawing([])
    setRoundBreakData(null)
    setGameEndData(null)
  }

  return (
    <div className="app">
      {/* Connection Status Indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <span className="status-dot"></span>
        {isConnected ? 'Connected' : 'Connecting...'}
      </div>

      {gameState === 'home' && (
        <Home onCreateRoom={createRoom} onJoinRoom={joinRoom} isConnected={isConnected} />
      )}

      {gameState === 'waiting' && (
        <WaitingRoom
          roomCode={roomCode}
          isHost={isHost}
          teams={teams}
          players={players}
          onAssignTeams={assignTeams}
          onStartGame={startGame}
        />
      )}

      {gameState === 'playing' && (
        <GameBoard
          isHost={isHost}
          currentRound={currentRound}
          totalRounds={totalRounds}
          wordToDrawn={wordToDrawn}
          wordLength={wordLength}
          roundConfig={roundConfig}
          revealedLetters={revealedLetters}
          drawing={drawing}
          teams={teams}
          players={players}
          playerName={playerName}
          onDraw={sendDrawing}
          onGuess={sendGuess}
        />
      )}

      {gameState === 'roundBreak' && (
        <RoundBreak
          isHost={isHost}
          data={roundBreakData}
          teams={teams}
          players={players}
          onAwardBonus={awardBonus}
          onNextRound={nextRound}
        />
      )}

      {gameState === 'ended' && (
        <GameEnd
          data={gameEndData}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  )
}

export default App
