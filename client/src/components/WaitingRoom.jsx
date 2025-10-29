import './WaitingRoom.css'

function WaitingRoom({ roomCode, isHost, teams, players, onAssignTeams, onStartGame }) {
  const unassignedPlayers = players.filter(p => p.teamId === null)
  const hasTeams = teams.length > 0

  return (
    <div className="waiting-room">
      <div className="card waiting-card fade-in">
        <div className="room-header">
          <h2>Waiting Room</h2>
          <div className="room-code">
            <span className="room-code-label">Room Code:</span>
            <span className="room-code-value">{roomCode}</span>
          </div>
        </div>

        {!hasTeams && (
          <div className="players-waiting">
            <h3>Players Waiting ({players.length})</h3>
            <div className="player-list">
              {players.map((player) => (
                <div key={player.id} className="player-chip">
                  {player.name}
                </div>
              ))}
            </div>

            {players.length === 0 && (
              <p className="empty-state">Waiting for players to join...</p>
            )}
          </div>
        )}

        {hasTeams && (
          <div className="teams-container">
            <h3>Teams</h3>
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-card">
                  <div className="team-header">
                    <h4>{team.name}</h4>
                  </div>
                  <div className="team-members">
                    {team.players.map((player) => (
                      <div key={player.id} className="team-member">
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unassignedPlayers.length > 0 && hasTeams && (
          <div className="unassigned-players">
            <p className="text-light">New players:</p>
            <div className="player-list">
              {unassignedPlayers.map((player) => (
                <div key={player.id} className="player-chip">
                  {player.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {isHost && (
          <div className="host-controls">
            {!hasTeams ? (
              <button
                className="btn btn-primary btn-large"
                onClick={onAssignTeams}
                disabled={players.length < 2}
              >
                Assign Teams
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-large pulse"
                onClick={onStartGame}
              >
                Start Game
              </button>
            )}

            {players.length < 2 && !hasTeams && (
              <p className="text-light mt-2 text-center">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <div className="waiting-message">
            <p className="text-light text-center">
              Waiting for host to start the game...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaitingRoom
