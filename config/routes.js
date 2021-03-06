module.exports.routes = {

  '/': { view: 'homepage' },
  '/home': {view: 'game/index'},
  'get /login': {view: 'user/login'},
  'get /signup': { view: 'user/signup' },
  'post /login': 'UserController.login',
  'post /signup': 'UserController.signup',
  '/logout': 'UserController.logout',

  'post /start': 'GameController.start',
  'get /games/list': 'GameController.list',
  'get /games/join': 'GameController.join',
  'get /games/join/:game_name': 'GameController.join',
  'get /leave': 'GameController.leave',

  'get /games/player': 'GameController.listPlayers',
  'get /moves/list': 'MoveController.getPastMoves',
  'post /moves/addMove': 'MoveController.addMove'
};
