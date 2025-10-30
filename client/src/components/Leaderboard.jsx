import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import AnimatedNumber from './AnimatedNumber'
import './Leaderboard.css'

function Leaderboard({ teams, players, currentPlayer }) {
  const [overtakingTeam, setOvertakingTeam] = useState(null)
  const previousRankings = useRef({})

  // Sort teams by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  // Track position changes and trigger overtake animation
  useEffect(() => {
    console.log('🏆 Leaderboard received new teams:', teams.map(t => `${t.name}: ${t.score}`).join(', '))
    console.log('   Full teams data:', teams)

    // Check for position changes
    const currentRankings = {}
    sortedTeams.forEach((team, index) => {
      currentRankings[team.id] = index
      
      // Check if this team moved up
      if (previousRankings.current[team.id] !== undefined) {
        const oldRank = previousRankings.current[team.id]
        const newRank = index
        
        if (newRank < oldRank) {
          console.log(`🎉 ${team.name} overtook! Old rank: ${oldRank + 1}, New rank: ${newRank + 1}`)
          setOvertakingTeam(team.id)
          setTimeout(() => setOvertakingTeam(null), 2000)
        }
      }
    })

    previousRankings.current = currentRankings
  }, [teams, sortedTeams])

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const teamColors = [
    'from-red-500 to-red-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-purple-500 to-purple-600',
  ]

  return (
    <Card className="leaderboard glass-card w-full">
      <CardHeader className="pb-4 p-8">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span>🏆</span> Leaderboard
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {sortedTeams.map((team, index) => {
          const isOvertaking = overtakingTeam === team.id
          
          return (
            <div
              key={team.id}
              className={`team-score-card bg-gradient-to-br ${teamColors[team.id % teamColors.length]} rounded-lg p-5 shadow-lg transform transition-all hover:scale-102 ${
                isOvertaking ? 'overtake-animation' : ''
              }`}
            >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{getRankEmoji(index)}</div>
                <div>
                  <div className="font-bold text-white text-lg">{team.name}</div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40 mt-1">
                    {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">
                <AnimatedNumber value={team.score} />
              </div>
            </div>

            <div className="space-y-2">
              {team.players.map((player) => {
                const playerData = players.find(p => p.id === player.id)
                const isCurrentPlayer = player.name === currentPlayer

                return (
                  <div
                    key={player.id}
                    className={`player-score flex items-center justify-between bg-white/10 backdrop-blur-sm rounded px-3 py-2 ${
                      isCurrentPlayer ? 'ring-2 ring-white/50' : ''
                    }`}
                  >
                    <span className="text-white font-medium text-sm">
                      {player.name}
                      {isCurrentPlayer && ' 👤'}
                    </span>
                    <span className="text-white font-bold">
                      <AnimatedNumber value={playerData?.score || 0} duration={600} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default Leaderboard
