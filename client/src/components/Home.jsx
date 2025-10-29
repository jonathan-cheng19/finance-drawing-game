import { useState } from 'react'
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
        <div className="card home-card fade-in">
          <h1 className="text-center">Financial Pictionary</h1>
          <p className="text-center text-light mb-4">
            Draw and guess finance terms with your team!
          </p>

          <div className="button-group">
            <button
              className="btn btn-primary btn-large"
              onClick={() => setMode('create')}
            >
              Create Game
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => setMode('join')}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="card home-card fade-in">
        <button
          className="back-button"
          onClick={() => setMode(null)}
        >
          ← Back
        </button>

        <h2 className="text-center mb-4">
          {mode === 'create' ? 'Create a Game' : 'Join a Game'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {mode === 'join' && (
            <div className="form-group">
              <label htmlFor="roomCode">Room Code</label>
              <input
                id="roomCode"
                type="text"
                className="input"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            className={`btn ${mode === 'create' ? 'btn-primary' : 'btn-secondary'} btn-large mt-4`}
          >
            {mode === 'create' ? 'Create Room' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Home
