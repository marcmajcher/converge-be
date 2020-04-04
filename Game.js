module.exports = class Game {
  static games = {};
  static players = {};

  constructor(gameId, playerId) {
    this.id = gameId;
    this.players = [playerId];
    this.round = 0;
    this.words = [];

    Game.games[gameId] = this;
    Game.players[playerId] = this;
  }

  addWord(playerId, word) {
    // returns true if both submitted, false otherwise
    if (this.words[this.round] === undefined) {
      this.words[this.round] = { [playerId]: word };
      return false;
    }
    this.words[this.round][playerId] = word;
    return true;
  }

  delete() {
    this.players.forEach((id) => delete Game.players[id]);
    delete Game.games[this.id];
  }

  isWin() {
    const values = Object.values(this.words[this.round]);
    return values[0].toLowerCase() === values[1].toLowerCase();
  }

  nextRound() {
    this.round++;
  }

  reset() {
    this.round = 0;
    this.words = [];
  }

  roundWords() {
    return this.words[this.round];
  }


  static byPlayer(playerId) {
    return this.players[playerId];
  }

  static byId(gameId) {
    return this.games[gameId];
  }

  static joinGame(gameId, playerId) {
    const game = this.byId(gameId);
    if (game.players.length === 1) {
      this.players[playerId] = game;
      game.players.push(playerId);
      return true;
    }
    return false;
  }
};
