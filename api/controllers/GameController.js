/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
	start: function (req, res, next) {
		var userId = req.session.userId;
		var targetWord = req.body.target;
		var gameName = req.body.game;
		req.session.gameName = gameName;
		req.session.adminId = userId;
		Game.create({
			name : gameName,
			admin: userId,
			target: targetWord,
		}).exec(function (err, game) {
			if (!err) {
				console.log("Game id ", game.id);
				req.session.gameId = game.id;
				var welcomeText = 'Welcome to ' + gameName + ' Word length is ' + targetWord.length;
				//req.session.welcomeText = welcomeText;
				game.moves.add({
					text: welcomeText,
					game: game.id
				});
				game.save(function (err) {
					if (!err) {
						return res.view('game/launch', {
							gameName : game.name,
							gameAdmin : userId
						});
					}
				});
			}
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
			//console.log(_.pluck(games, 'id'));
			Game.subscribe(req, games);
			return res.ok(games);
		});
	},

	join: function (req, res) {
		var userId = req.session.userId;

		if (req.isSocket) {
			console.log("GOING TO SUBSCRIBE TO GAME changes");
			if (req.session.adminId) {
				Game.find({
					admin: req.session.adminId
				}).exec(function (err, games) {
					console.log('Going to subscribe to game ' + games[0].name + 'with admin ' + req.session.adminId);
					Game.subscribe(req.socket, games[0]);
					return res.ok([]);
				});
			} else {
				console.log('Game name from session ', req.session.gameName);
				Game.findOneByName(req.session.gameName).populate('players').exec(function (err, game) {
					if (err) {
						return res.negotiate(err);
					}
					Game.subscribe(req.socket, game);
					console.log('Players in game', game.players);
					var playerIds = _.pluck(game.players, 'username');
					console.log("players backend ", playerIds);
					return res.ok(playerIds);
				});
			}
		} else {
			req.session.gameName = req.params['game_name'];
			Game.findOneByName(req.params['game_name']).populate('admin').exec(function (err, game) {
				if (err) {
					return res.negotiate(err);
				}
				console.log('Game to join', game);
				req.session.gameId = game.id;
				req.session.targetWord = game.target;
				game.players.add(userId);
				game.save(function (err) {
					if (err) {
						return res.negotiate(err);
					}
					console.log('User ' + userId + ' joined ' + game.name + ' successfully');
					User.find(userId).exec(function (err, users) {
						Game.publishAdd(game.id, 'players', users[0].username);
						return res.view('game/launch', {
							gameName : game.name,
							gameAdmin: game.admin.username
						});
					});
				});
			});
		}
	}
};

