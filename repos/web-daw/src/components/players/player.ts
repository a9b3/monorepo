let players

export async function getPlayers() {
  if (players) {
    return players
  }
  const dynamicModules = import.meta.glob('src/assets/players/*.gif')
  const res = await Promise.all(Object.values(dynamicModules).map(im => im()))
  players = res.map(r => r.default)
  return players
}
