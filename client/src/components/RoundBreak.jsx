import { useState } from 'react'
import './RoundBreak.css'

function RoundBreak({ isHost, data, teams, onAwardBonus, onNextRound }) {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [bonusPoints, setBonusPoints] = useState(100)

  const handleAwardBonus = () => {
    if (selectedTeam !== null) {
      onAwardBonus(selectedTeam, bonusPoints)
      setSelectedTeam(null)
    }
  }

  const isLastRound = data?.currentRound === 3

  return (
    <div className="round-break">
      <div className="card round-break-card fade-in">
        <div className="break-header">
          <h2>Round {data?.currentRound} Complete!</h2>
        </div>

        <div className="word-reveal">
          <div className="reveal-label">The word was:</div>
          <div className="reveal-word">{data?.word}</div>
          <div className="reveal-definition">{data?.definition}</div>
        </div>

        {isHost && (
          <div className="bonus-section">
            <h3>Award Bonus Points</h3>
            <p className="bonus-description">
              Teams can earn bonus points by correctly defining the term!
            </p>

            <div className="bonus-controls">
              <div className="team-selector">
                <label>Select Team:</label>
                <select
                  className="input"
                  value={selectedTeam ?? ''}
                  onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Choose a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="points-selector">
                <label>Points:</label>
                <div className="points-buttons">
                  {[50, 100, 150, 200].map((points) => (
                    <button
                      key={points}
                      className={`btn ${bonusPoints === points ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setBonusPoints(points)}
                    >
                      {points}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-secondary btn-large"
                onClick={handleAwardBonus}
                disabled={selectedTeam === null}
              >
                Award {bonusPoints} Points
              </button>
            </div>
          </div>
        )}

        {!isHost && (
          <div className="waiting-section">
            <p className="text-light text-center">
              Host is awarding bonus points for correct definitions...
            </p>
          </div>
        )}

        {isHost && (
          <div className="next-round-section">
            <button
              className="btn btn-primary btn-large pulse"
              onClick={onNextRound}
            >
              {isLastRound ? 'View Results' : `Start Round ${data?.currentRound + 1}`}
            </button>
          </div>
        )}

        {!isHost && (
          <div className="waiting-section mt-4">
            <p className="text-light text-center">
              Waiting for host to continue...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoundBreak
