/**
* Move.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
  	}
};

