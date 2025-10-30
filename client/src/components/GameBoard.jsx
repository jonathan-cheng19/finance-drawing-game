import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
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

  const getTimerColor = () => {
    if (timeRemaining > 60) return 'from-emerald-500 to-teal-500'
    if (timeRemaining > 30) return 'from-teal-500 to-cyan-500'
    if (timeRemaining > 10) return 'from-emerald-600 to-teal-600'
    return 'from-red-500 to-red-600'
  }

  const isTimerLow = timeRemaining <= 10 && timeRemaining > 0

  return (
    <div className={`game-board min-h-screen py-8 px-6 ${isTimerLow ? 'timer-warning' : ''}`}>
      <div className="game-container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        Round {currentRound}/3
                      </Badge>
                      <span className="text-gray-700 text-sm">{roundConfig?.description}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-4xl font-extrabold ${timeRemaining <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {timeRemaining}s
                    </div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getTimerColor()} transition-all duration-1000`}
                        style={{ width: `${100 - progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word Display */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {wordDisplay.map((letter, idx) => (
                    <div key={idx} className="word-letter-container">
                      {letter}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drawing Canvas */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {isHost ? (
                  <div className="host-view">
                    <div className="word-to-draw bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
                      <h3 className="text-lg font-semibold text-white/90 mb-2">🎨 Draw this:</h3>
                      <div className="text-3xl font-bold text-white mb-2">{wordToDrawn?.word}</div>
                      <p className="text-white/80 text-sm">{wordToDrawn?.definition}</p>
                    </div>
                    <DrawingCanvas onDraw={onDraw} drawing={drawing} isHost={true} />
                  </div>
                ) : (
                  <DrawingCanvas drawing={drawing} isHost={false} />
                )}
              </CardContent>
            </Card>

            {/* Guess Input (for players) */}
            {!isHost && (
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleGuessSubmit} className="flex gap-4">
                    <Input
                      type="text"
                      className="flex-1 h-12 text-lg"
                      placeholder="Type your guess here..."
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      autoComplete="off"
                    />
                    <Button type="submit" size="lg" className="px-8">
                      Guess!
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard teams={teams} players={players} currentPlayer={playerName} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard
