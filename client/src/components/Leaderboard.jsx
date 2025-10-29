import './Leaderboard.css'

function Leaderboard({ teams, players, currentPlayer }) {
  // Sort teams by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>Leaderboard</h3>
      </div>

      <div className="teams-list">
        {sortedTeams.map((team, index) => (
          <div key={team.id} className="team-score-card">
            <div className="team-rank-badge">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div className="team-info">
              <div className="team-name-score">
                <div className="team-name">{team.name}</div>
                <div className="team-score">{team.score}</div>
              </div>
              <div className="team-players-list">
                {team.players.map((player) => {
                  const playerData = players.find(p => p.id === player.id)
                  const isCurrentPlayer = player.name === currentPlayer

                  return (
                    <div
                      key={player.id}
                      className={`player-score ${isCurrentPlayer ? 'current-player' : ''}`}
                    >
                      <span className="player-name">
                        {player.name}
                        {isCurrentPlayer && ' (You)'}
                      </span>
                      <span className="player-points">{playerData?.score || 0}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
