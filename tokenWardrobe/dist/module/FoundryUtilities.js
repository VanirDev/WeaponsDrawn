export function getGame() {
    if (!(game instanceof Game)) {
        throw new Error('game is not initialized yet!');
    }
    return game;
}
