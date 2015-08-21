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
			model: 'user'
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
		}
  	}
};

