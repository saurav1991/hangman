'use strict';

module.exports = {
	processMove : function (game, moveText, callback) {
		if (game.guesses > 0) {
			var shown = game.shown.split('');
			if (game.target.indexOf(moveText) !== -1) {
				if (game.revealedChars.indexOf(moveText) === -1) {
					for (var i = 0; i < game.target.length; i++) {
						if (moveText === game.target.charAt(i)) {
							shown[i] = moveText;
						}
					}
					game.revealedChars.push(moveText);
					game.shown = shown.join('');
					console.log('Valid move');
					if (game.shown.indexOf('*') === -1) {
						game.over = true;
						return callback({
							gameData: game,
							moveData: 'You have crossed the gates of Valhalla. The word is ' + game.shown
						});
					} else {
						return callback({
							gameData: game,
							moveData: 'Shiny and Chrome!!. Revealed word ' + game.shown
						});
					}
				} else {
					return callback({
						gameData: game,
						moveData: moveText + ' has already been revealed'
					});
				}
			} else {
				game.guesses = game.guesses - 1;
				if (game.guesses === 0) {
					game.over = true;
					return callback({
						gameData: game,
						moveData: 'You lose. The gates of Valhalla remain shut'
					});
				}
				return callback({
					gameData: game,
					moveData: 'Mediocre.. Moves left ' + game.guesses
				});
			}
		}
	}
};