import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import './Home.css'

function Home({ onCreateRoom, onJoinRoom }) {
  const [mode, setMode] = useState(null) // null, 'create', 'join'
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter your name')
      return
    }

    if (mode === 'create') {
      onCreateRoom(name)
    } else if (mode === 'join') {
      if (!roomCode.trim()) {
        alert('Please enter a room code')
        return
      }
      onJoinRoom(roomCode.toUpperCase(), name)
    }
  }

  if (!mode) {
    return (
      <div className="home">
        <Card className="home-card fade-in max-w-2xl w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-5xl font-extrabold text-gray-900">
                Financial Pictionary
              </h1>
            </div>
            <CardDescription className="text-lg text-gray-700">
              🎨 Draw and guess finance terms with your team! Test your financial literacy while having fun.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                size="lg"
                variant="default"
                className="h-32 flex-col gap-3 text-lg"
                onClick={() => setMode('create')}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Game</span>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-32 flex-col gap-3 text-lg"
                onClick={() => setMode('join')}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Join Game</span>
              </Button>
            </div>
            
            <div className="mt-6 p-6 bg-gray-100 rounded-xl border-2 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• One player draws a financial term</li>
                <li>• Team members guess the word before time runs out</li>
                <li>• Score points for correct guesses!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="home">
      <Card className="home-card fade-in max-w-md w-full">
        <CardHeader>
          <Button
            variant="ghost"
            className="mb-2 w-fit text-gray-600 hover:text-gray-900"
            onClick={() => setMode(null)}
          >
            ← Back
          </Button>

          <CardTitle className="text-center">
            {mode === 'create' ? '🎮 Create a Game' : '🚪 Join a Game'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'create' 
              ? 'Start a new game session and invite your friends!' 
              : 'Enter the room code to join an existing game'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-medium text-gray-900">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="h-12"
              />
            </div>

            {mode === 'join' && (
              <div className="space-y-3">
                <label htmlFor="roomCode" className="text-sm font-medium text-gray-900">
                  Room Code
                </label>
                <Input
                  id="roomCode"
                  type="text"
                  placeholder="XXXXXX"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="h-12 text-center text-xl font-bold tracking-widest"
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant={mode === 'create' ? 'default' : 'secondary'}
              className="w-full h-12"
            >
              {mode === 'create' ? '🎨 Create Room' : '🎯 Join Room'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home
