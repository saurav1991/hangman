/**
* Move.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var processor = require('../services/GameProcessor');
module.exports = {
	attributes: {
		text: {
			type: 'string'
		},
		user: {
			type: 'integer',
			defaultsTo: 9999
		},
		game: {
			model: 'game'
		}
  	},

  	processAdminMove: function (moveData, callback) {
  		Move.create(moveData).exec(function (err, newMove) {
  			if (err) {
  				return callback(err, null);
  			}
  			Move.publishCreate({id: newMove.id, move: newMove});
  			return callback(null, newMove);
  		});
  	},

  	processPlayerMove: function (moveData, callback) {
  		Move.create(moveData).exec(function created(err, newMove) {
  			if (err) {
  				return callback(err);
  			}
  			Move.publishCreate({id: newMove.id, move: newMove});
			console.log('A new move has been created');
			console.log('Now processing move', newMove.text);

			Game.findOne(moveData.game).exec(function (err, game) {
				if (!err) {
					processor.processMove(game, newMove.text, function (result) {
						console.log('Next move', result.moveData);
						result.gameData.save(function (err) {
							if (err) {
								return callback(err)
							}
							Move.create({
								text: result.moveData,
								user: 9999,
								game: game.id
							}).exec(function (err, systemMove) {
								if (err) {
									return callback(err);
								}
								Move.publishCreate({id: systemMove.id, move: systemMove});
								if (result.gameData.over) {
									Game.destroy(result.gameData.id).exec(function (err) {
										if (!err) {
											console.log('GAME OVER, DESTROYING');
											Game.publishDestroy(result.gameData.id);
											return callback();
										}
									})
								} else {
									console.log('System move generated', systemMove.id, systemMove.text);
									return callback();
								}
							});
						});
					});
				} else {
					return callback(err);
				}
			});
  		});
  	}
};

