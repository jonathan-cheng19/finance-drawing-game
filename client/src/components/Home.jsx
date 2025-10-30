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
        <Card className="home-card glass-card fade-in max-w-2xl w-full">
          <CardHeader className="text-center space-y-4 p-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-5xl">💰📈</div>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900">
              PPM Pictionary
            </h1>
            <p className="text-blue-500 font-medium text-lg">Financial Drawing Game</p>
          </CardHeader>

          <CardContent className="space-y-6 p-10">
            <div className="grid grid-cols-1 gap-4">
              <Button
                size="lg"
                variant="default"
                className="h-16 flex items-center justify-center gap-3 text-lg w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setMode('create')}
              >
                <span className="text-xl">🎮</span>
                <span>Host a Game</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex items-center justify-center gap-3 text-lg w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => setMode('join')}
              >
                <span className="text-xl">🔗</span>
                <span>Join a Game</span>
              </Button>
            </div>
            
            <p className="text-center text-blue-500 text-sm font-medium pt-4">
              Learn finance concepts while having fun!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="home">
      <Card className="home-card glass-card fade-in max-w-md w-full">
        <CardHeader className="p-8">
          <Button
            variant="ghost"
            className="mb-2 w-fit text-gray-600 hover:text-gray-900"
            onClick={() => setMode(null)}
          >
            ← Back
          </Button>

          <CardTitle className="text-center text-2xl">
            {mode === 'create' ? '🎮 Create a Game' : '🔗 Join a Game'}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {mode === 'create' 
              ? 'Start a new game session and invite your friends!' 
              : 'Enter the room code to join an existing game'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
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
              className={`w-full h-12 ${mode === 'create' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent'}`}
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
