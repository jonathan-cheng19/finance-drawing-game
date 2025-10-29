import { useState, useEffect } from 'react'
import DrawingCanvas from './DrawingCanvas'
import Leaderboard from './Leaderboard'
import './GameBoard.css'

function GameBoard({
  isHost,
  currentRound,
  wordToDrawn,
  wordLength,
  roundConfig,
  revealedLetters,
  drawing,
  teams,
  players,
  playerName,
  onDraw,
  onGuess
}) {
  const [guess, setGuess] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (roundConfig) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, roundConfig.timeLimit - elapsed)
        setTimeRemaining(Math.ceil(remaining))

        if (remaining <= 0) {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [roundConfig, startTime])

  const handleGuessSubmit = (e) => {
    e.preventDefault()
    if (guess.trim()) {
      onGuess(guess.trim())
      setGuess('')
    }
  }

  // Create word display with underscores and revealed letters
  const wordDisplay = []
  for (let i = 0; i < wordLength; i++) {
    const revealed = revealedLetters.find(r => r.position === i)
    wordDisplay.push(
      <span key={i} className="word-letter">
        {revealed ? revealed.letter : '_'}
      </span>
    )
  }

  const progressPercentage = roundConfig
    ? ((roundConfig.timeLimit - timeRemaining) / roundConfig.timeLimit) * 100
    : 0

  return (
    <div className="game-board">
      <div className="game-container">
        <div className="game-main">
          {/* Header */}
          <div className="game-header">
            <div className="round-info">
              <h2>Round {currentRound}</h2>
              <p className="round-description">{roundConfig?.description}</p>
            </div>
            <div className="timer-container">
              <div className="timer">{timeRemaining}s</div>
              <div className="timer-bar">
                <div
                  className="timer-progress"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Word Display */}
          <div className="word-display">
            {wordDisplay}
          </div>

          {/* Drawing Canvas */}
          <div className="canvas-container">
            {isHost ? (
              <div className="host-view">
                <div className="word-to-draw">
                  <h3>Draw this:</h3>
                  <div className="target-word">{wordToDrawn?.word}</div>
                  <p className="word-definition">{wordToDrawn?.definition}</p>
                </div>
                <DrawingCanvas onDraw={onDraw} isHost={true} />
              </div>
            ) : (
              <DrawingCanvas drawing={drawing} isHost={false} />
            )}
          </div>

          {/* Guess Input (for players) */}
          {!isHost && (
            <div className="guess-container">
              <form onSubmit={handleGuessSubmit} className="guess-form">
                <input
                  type="text"
                  className="input guess-input"
                  placeholder="Type your guess..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-primary">
                  Guess
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <Leaderboard teams={teams} players={players} currentPlayer={playerName} />
      </div>
    </div>
  )
}

export default GameBoard
