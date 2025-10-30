import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import LoadingAnimation from './LoadingAnimation'
import Leaderboard from './Leaderboard'
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

  const isLastRound = data?.currentRound === 6

  return (
    <div className="round-break">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
      <Card className="round-break-card glass-card fade-in w-full">
        <CardHeader className="text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <CardTitle className="text-4xl">Round {data?.currentRound} Complete!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Word Reveal */}
          <div className="word-reveal bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-center">
            <div className="text-white/90 text-lg mb-2">The word was:</div>
            <div className="text-5xl font-extrabold text-white mb-4">{data?.word}</div>
            <div className="text-white text-lg max-w-2xl mx-auto">{data?.definition}</div>
          </div>

            {/* Bonus Points Section (Host Only) */}
          {isHost && (
            <div className="bonus-section bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-300">
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
                    className="w-full h-12 rounded-md border-2 border-blue-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onClick={() => setBonusPoints(points)}
                        className={`h-12 ${bonusPoints === points ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white border-2 border-blue-300 text-blue-500 hover:bg-blue-50'}`}
                      >
                        {points}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white"
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
                className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white pulse"
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
          
          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard teams={teams} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundBreak
