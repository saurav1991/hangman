/**
 * MoveController
 *
 * @description :: Server-side logic for managing moves
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getPastMoves: function (req, res) {
		var gameName = req.session.gameName;
		Game.findOneByName(gameName).populate('moves').exec(function (err, game) {
			if (err) {
				return res.negotiate(err);
			}
			console.log("WATCHING MOVES");
			Move.watch(req);
			var moveTexts = _.pluck(game.moves, 'text');
			console.log("All moves", moveTexts);
			return res.send(moveTexts);
		});
	},

	addMove: function (req, res) {
		console.log('Adding move', req.param('move'));
		console.log('GAME NAME', req.session.gameName, 'GAME ID', req.session.gameId);
		console.log('user id', req.session.userId);
		console.log('Fetching num guesses from session', req.session.remainingGuesses);
		if (req.session.adminId) {
			console.log('Admin saying something', req.session.adminId);
			Move.create({
				text: req.param('move'),
				user: req.session.userId,
				game: req.session.gameId
			}).exec(function created (err, newMove) {
				if (err) {
					return res.negotiate(err);
				}
				Move.publishCreate({id: newMove.id, text: newMove.text});
				console.log('Admin has been moved');
			});
		} else {

			Move.create({
				text: req.param('move'),
				user: req.session.userId,
				game: req.session.gameId
			}).exec(function created (err, newMove) {
				if (err) {
					return res.negotiate(err);
				}
				Move.publishCreate({id: newMove.id, text: newMove.text});
				console.log('A new move has been created');
				console.log('Now processing move', newMove.text);
				Game.findOne(req.session.gameId).exec(function (err, game) {
					game.guesses = game.guesses - 1;
					game.save(function (err) {
						if (err) {
							console.log('Could not update game moves');
							return res.negotiate(err);
						}
						Move.create({
							text: 'Moves remaining ' + game.guesses,
							user: 9999,
							game: req.session.gameId
						}).exec(function created(err, systemMove) {
							if (err) {
								res.negotiate(err);
							}
							var systemMoveText = systemMove.text;
							Move.publishCreate({id: systemMove.id, text: systemMoveText});
							console.log('System  move generated', systemMove.id, systemMove.text);
						});
					});
				});
			});
		}
	}
};

