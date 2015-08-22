/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	start: function (req, res, next) {
		var userId = req.session.userId;
		var targetWord = req.body.target;
		var shown = '';
		for (var i = 0; i < targetWord.length; i++) {
			shown += '*';
		}
		var gameName = req.body.game;
		var gameData = {
			name: gameName,
			admin: userId,
			target: targetWord,
			shown: shown
		};
		Game.startNewGame(gameData, function (err, game) {
			if (err) {
				return res.serverError();
			}
			req.session.gameName = game.name;
			req.session.gameId = game.id
			req.session.isGameAdmin = true;
			return res.view('game/launch', {
				gameName: game.name,
				gameAdmin: game.admin
			});
		});
	},
	
	list: function (req, res) {
		if (!req.isSocket) {
			return res.badRequest("Only socket requests accepted");
		}
		Game.find({admin : {'!' : req.session.userId}}).exec(function (err, games) {
			if (err) {
				return res.negotiate(err)
			}
			console.log(games);
			Game.subscribe(req, games);
			return res.ok(games);
		});
	},

	listPlayers: function (req, res) {
		if (req.isSocket) {
			console.log('GOING TO SUBSCRIBE TO GAME');
			console.log(req.session.gameName);
			Game.findOne(req.session.gameId).populate('players').exec(function (err, game) {
				console.log('GAME', game);
				if (!err) {
					Game.subscribe(req, game);
					if (game.players.length === 0) {
						console.log('No players joined game yet');
						return res.ok([]);
					} else {
						console.log('Players in game', game.players);
						var playerIds = _.pluck(game.players, 'username');
						return res.ok(playerIds);
					}
				}
			});
		}
	},

	join: function (req, res) {
		var userId = req.session.userId;

		req.session.gameName = req.params['game_name'];
		Game.addPlayer({
			gameName: req.session.gameName,
			playerId: userId
		}, function (err, game) {
			if (err) {
				return res.negotiate(err);
			}
			req.session.gameId = game.id
			User.findOne(userId).exec(function (err, user) {
				if (err) {
					return res.negotiate(err);
				}
				Game.publishAdd(game.id, 'players', user.username);
				return res.view('game/launch', {
					gameName: game.name,
					gameAdmin: game.admin.username
				})
			});
		});
	}
};

