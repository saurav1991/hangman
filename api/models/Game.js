/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		name: {
			type: 'string',
			unique: true,
		},
		admin: {
			model: 'user',
			unique: true
		},
		target: {
			type: 'string'
		},
		players: {
			collection: 'user',
			via: 'gameJoined'
		},
		moves: {
			collection: 'move',
			via: 'game'
		},
		guesses: {
			type: 'integer',
			defaultsTo: 5
		},
		revealedChars: {
			type: 'array',
			defaultsTo: []
		},
		shown: {
			type: 'string'
		},
		over: {
			type: 'boolean',
			defaultsTo: false
		}
  	},

  	startNewGame: function (gameData, callback) {
  		Game.create(gameData, function created (err, game) {
  			if (!err) {
  				var welcomeText = 'Welcome to ' + game.name + ' Word length is ' + game.target.length;
  				game.moves.add({
  					text: welcomeText,
  					game: game.id
  				});
  				game.save(function (err) {
  					if (err) {
  						return callback(err, null);
  					} else {
  						return callback(null, game);
  					}
  				});
  			} else {
  				return callback(err, null);
  			}
  		});
  	},

  	addPlayer: function (data, callback) {
  		Game.findOneByName(data.gameName).populate('admin').exec(function (err, game) {
  			if (err) {
  				return callback(err, null);
  			}
  			game.players.add(data.playerId);
  			game.save(function (err) {
  				if (err) {
  					return callback(err, null);
  				}
  				return callback(null, game);
  			});
  		});
  	}
};

