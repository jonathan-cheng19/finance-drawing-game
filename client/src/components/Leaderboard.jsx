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
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-gray-400 to-gray-500',
    'from-blue-600 to-green-600',
  ]

  return (
    <Card className="leaderboard w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <span>🏆</span> Leaderboard
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {sortedTeams.map((team, index) => (
          <div
            key={team.id}
            className={`team-score-card bg-gradient-to-br ${teamColors[index % teamColors.length]} rounded-lg p-4 shadow-lg transform transition-all hover:scale-102`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{getRankEmoji(index)}</div>
                <div>
                  <div className="font-bold text-white text-lg">{team.name}</div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40 mt-1">
                    {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{team.score}</div>
            </div>

            <div className="space-y-1">
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
                    <span className="text-white font-bold">{playerData?.score || 0}</span>
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
