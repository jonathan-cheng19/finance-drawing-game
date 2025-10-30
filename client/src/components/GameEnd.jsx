import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import './GameEnd.css'

function GameEnd({ data, onPlayAgain }) {
  const rankedTeams = data?.rankedTeams || []
  const players = data?.players || []

  const getRankColor = (index) => {
    if (index === 0) return 'from-blue-500 to-blue-600'
    if (index === 1) return 'from-green-500 to-green-600'
    if (index === 2) return 'from-gray-400 to-gray-500'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <div className="game-end">
      <Card className="game-end-card fade-in max-w-4xl w-full">
        <CardHeader className="text-center pb-8">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <CardTitle className="text-5xl mb-6">Game Over!</CardTitle>
          
          {rankedTeams.length > 0 && (
            <div className="winner-announcement bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-8 shadow-2xl">
              <div className="text-white text-xl mb-2">🎊 Champions 🎊</div>
              <div className="text-5xl font-extrabold text-white mb-2">
                {rankedTeams[0].name}
              </div>
              <Badge variant="outline" className="bg-white/30 text-white border-white/40 text-2xl px-6 py-2">
                {rankedTeams[0].score} points
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Final Standings</h2>
            <div className="space-y-3">
              {rankedTeams.map((team, index) => (
                <div
                  key={team.id}
                  className={`standing-card bg-gradient-to-br ${getRankColor(index)} rounded-xl p-6 shadow-lg transform transition-all hover:scale-102`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{team.name}</div>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/40 mt-1">
                          {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-4xl font-extrabold text-white">{team.score} pts</div>
                  </div>

                  <div className="space-y-2">
                    {team.players.map((player) => {
                      const playerData = players.find(p => p.id === player.id)
                      return (
                        <div
                          key={player.id}
                          className="standing-player flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
                        >
                          <span className="text-white font-medium">{player.name}</span>
                          <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                            {playerData?.score || 0} pts
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button
              size="lg"
              className="w-full h-16 text-xl"
              onClick={onPlayAgain}
            >
              🎮 Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GameEnd
