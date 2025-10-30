import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import LoadingAnimation from './LoadingAnimation'
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
      <Card className="round-break-card fade-in max-w-3xl w-full">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <CardTitle className="text-4xl">Round {data?.currentRound} Complete!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Word Reveal */}
          <div className="word-reveal bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-8 text-center">
            <div className="text-white/80 text-lg mb-2">The word was:</div>
            <div className="text-5xl font-extrabold text-white mb-4">{data?.word}</div>
            <div className="text-white/90 text-lg max-w-2xl mx-auto">{data?.definition}</div>
          </div>

            {/* Bonus Points Section (Host Only) */}
          {isHost && (
            <div className="bonus-section bg-gray-100 rounded-xl p-6 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>✨</span> Award Bonus Points
              </h3>
              <p className="text-gray-700 mb-6">
                Teams can earn bonus points by correctly defining the term!
              </p>              <div className="space-y-4">
                {/* Team Selector */}
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Select Team:</label>
                  <select
                    className="w-full h-12 rounded-md border-2 border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

                {/* Points Selector */}
                <div>
                  <label className="block text-gray-900 mb-2 font-medium">Points:</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[50, 100, 150, 200].map((points) => (
                      <Button
                        key={points}
                        variant={bonusPoints === points ? 'default' : 'outline'}
                        onClick={() => setBonusPoints(points)}
                        className="h-12"
                      >
                        {points}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={handleAwardBonus}
                  disabled={selectedTeam === null}
                >
                  🎁 Award {bonusPoints} Points
                </Button>
              </div>
            </div>
          )}

          {/* Waiting Message (Non-Host) */}
          {!isHost && (
            <div className="text-center py-6">
              <LoadingAnimation message="Host is awarding bonus points for correct definitions..." />
            </div>
          )}

          {/* Next Round Button (Host Only) */}
          {isHost && (
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full h-14 text-lg pulse"
                onClick={onNextRound}
              >
                {isLastRound ? '🏆 View Results' : `🚀 Start Round ${data?.currentRound + 1}`}
              </Button>
            </div>
          )}

          {/* Waiting for Host (Non-Host) */}
          {!isHost && (
            <div className="text-center py-4">
              <p className="text-gray-700">Waiting for host to continue...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RoundBreak
