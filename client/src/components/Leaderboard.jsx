import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import './Leaderboard.css'

function Leaderboard({ teams, players, currentPlayer }) {
  // Sort teams by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const teamColors = [
    'from-cyan-500 to-blue-600',
    'from-orange-500 to-red-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-600',
  ]

  return (
    <Card className="leaderboard w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <span>🏆</span> Leaderboard
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedTeams.map((team, index) => (
          <div
            key={team.id}
            className={`team-score-card bg-gradient-to-br ${teamColors[index % teamColors.length]} rounded-lg p-5 shadow-lg transform transition-all hover:scale-102`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getRankEmoji(index)}</div>
                <div>
                  <div className="font-bold text-white text-lg">{team.name}</div>
                  <Badge variant="outline" className="bg-white/90 text-gray-900 border-white/50 font-semibold mt-1 px-2 py-0.5">
                    {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{team.score}</div>
            </div>

            <div className="space-y-2">
              {team.players.map((player) => {
                const playerData = players.find(p => p.id === player.id)
                const isCurrentPlayer = player.name === currentPlayer

                return (
                  <div
                    key={player.id}
                    className={`player-score flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-sm ${
                      isCurrentPlayer ? 'ring-2 ring-white/90' : ''
                    }`}
                  >
                    <span className="text-gray-900 font-medium text-sm">
                      {player.name}
                      {isCurrentPlayer && ' 👤'}
                    </span>
                    <span className="text-gray-900 font-bold">{playerData?.score || 0}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default Leaderboard
