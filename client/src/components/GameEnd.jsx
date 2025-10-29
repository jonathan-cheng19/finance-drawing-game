import './GameEnd.css'

function GameEnd({ data, onPlayAgain }) {
  const rankedTeams = data?.rankedTeams || []
  const players = data?.players || []

  return (
    <div className="game-end">
      <div className="card game-end-card fade-in">
        <div className="end-header">
          <h1>Game Over!</h1>
          {rankedTeams.length > 0 && (
            <div className="winner-announcement">
              <div className="trophy">🏆</div>
              <div className="winner-text">
                <div className="winner-label">Winner:</div>
                <div className="winner-name">{rankedTeams[0].name}</div>
                <div className="winner-score">{rankedTeams[0].score} points</div>
              </div>
            </div>
          )}
        </div>

        <div className="final-standings">
          <h2>Final Standings</h2>
          <div className="standings-list">
            {rankedTeams.map((team, index) => (
              <div key={team.id} className="standing-card">
                <div className="standing-rank">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="standing-info">
                  <div className="standing-header">
                    <div className="standing-team">{team.name}</div>
                    <div className="standing-score">{team.score} pts</div>
                  </div>
                  <div className="standing-players">
                    {team.players.map((player) => {
                      const playerData = players.find(p => p.id === player.id)
                      return (
                        <div key={player.id} className="standing-player">
                          <span className="standing-player-name">{player.name}</span>
                          <span className="standing-player-score">
                            {playerData?.score || 0} pts
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="end-actions">
          <button className="btn btn-primary btn-large" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameEnd
