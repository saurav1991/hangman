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
			console.log("WATCHING GAME MOVES");
			Move.watch(req);
			//console.log("All moves", moveTexts);
			return res.send(game.moves);
		});
	},

	addMove: function (req, res) {
		console.log('Adding move', req.param('move'));
		console.log('GAME NAME', req.session.gameName, 'GAME ID', req.session.gameId);
		console.log('user id', req.session.userId);
		console.log('Fetching num guesses from session', req.session.remainingGuesses);
		if (req.session.isGameAdmin) {
			console.log('Admin saying something');
			Move.processAdminMove({
				text: req.param('move'),
				user: req.session.userId,
				game: req.session.gameId
			}, function (err, newMove) {
				if (err) {
					return res.negotiate(err);
				}
				console.log('Admin has moved');
			});
		} else {
			Move.processPlayerMove({
				text: req.param('move'),
				user: req.session.userId,
				game: req.session.gameId
			}, function (err) {
				if (err) {
					return res.negotiate(err);
				}
				console.log('Player move processed successfully');
			});
		}
	}
};

