import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import LoadingAnimation from './LoadingAnimation'
import './WaitingRoom.css'

function WaitingRoom({ roomCode, isHost, teams, players, onAssignTeams, onStartGame }) {
  const unassignedPlayers = players.filter(p => p.teamId === null)
  const hasTeams = teams.length > 0

  const teamColors = [
    'from-blue-400 to-blue-500',
    'from-blue-500 to-blue-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
  ]

  return (
    <div className="waiting-room">
      <Card className="waiting-room-card glass-card fade-in max-w-4xl w-full">
        <CardHeader className="p-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <CardTitle className="text-3xl">🎮 Waiting Room</CardTitle>
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg border-2 border-blue-500">
              <span className="text-sm text-gray-600 font-semibold">Room Code:</span>
              <span className="text-2xl font-bold tracking-widest text-blue-500">{roomCode}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {!hasTeams && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Players Waiting</h3>
                <Badge variant="secondary" className="text-base px-3 py-1 bg-blue-100 text-blue-700">
                  {players.length} {players.length === 1 ? 'Player' : 'Players'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="player-chip bg-white/90 backdrop-blur-sm border-2 border-blue-300 rounded-lg p-4 text-center hover:scale-105 transition-transform hover:border-blue-600 hover:shadow-lg"
                  >
                    <div className="text-gray-900 font-medium">{player.name}</div>
                  </div>
                ))}
              </div>

              {players.length === 0 && (
                <div className="text-center py-12">
                  <LoadingAnimation message="Waiting for players to join..." />
                </div>
              )}
            </div>
          )}

          {hasTeams && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>👥</span> Teams
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team, idx) => (
                  <div
                    key={team.id}
                    className={`team-card bg-gradient-to-br ${teamColors[idx % teamColors.length]} rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-white">{team.name}</h4>
                      <Badge variant="outline" className="bg-white/30 text-white border-white/50">
                        {team.players.length} {team.players.length === 1 ? 'member' : 'members'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {team.players.map((player) => (
                        <div
                          key={player.id}
                          className="team-member bg-white/95 backdrop-blur-sm rounded-lg px-5 py-3 text-gray-900 font-medium shadow-sm"
                        >
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
            <div className="bg-blue-100/80 rounded-lg p-4 border-2 border-blue-300">
              <p className="text-gray-900 font-semibold mb-3">🆕 New players joined:</p>
              <div className="flex flex-wrap gap-2">
                {unassignedPlayers.map((player) => (
                  <Badge key={player.id} variant="outline" className="text-base px-3 py-1 bg-white border-blue-400 text-blue-700">
                    {player.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isHost && (
            <div className="space-y-3 pt-4">
              {!hasTeams ? (
                <>
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={onAssignTeams}
                    disabled={players.length < 2}
                  >
                    ✨ Assign Teams
                  </Button>
                  {players.length < 2 && (
                    <p className="text-center text-red-600 text-sm font-medium">
                      ⚠️ Need at least 2 players to start
                    </p>
                  )}
                </>
              ) : (
                <Button
                  size="lg"
                  className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white pulse"
                  onClick={onStartGame}
                >
                  🚀 Start Game
                </Button>
              )}
            </div>
          )}

          {!isHost && (
            <div className="text-center py-6">
              <LoadingAnimation message="Waiting for host to start the game..." />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WaitingRoom
