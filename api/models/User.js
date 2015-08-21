/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		username: {
  			type: 'string',
  			unique: true
  		},
  		password: {
  			type: 'string'
  		},
  		gameAdmin: {
  			collection: 'game',
        via: 'admin'
  		},
  		gameJoined: {
  			model: 'game'
  		}
  	}
};
