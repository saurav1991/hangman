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
  			unique: true,
        required: true
  		},
  		password: {
  			type: 'string',
        required: true
  		},
  		gameAdmin: {
  			collection: 'game',
        via: 'admin'
  		},
  		gameJoined: {
  			model: 'game'
  		},
      loggedIn: {
        type: 'boolean',
        defaultsTo: false
      }
  	},

    processLogout: function (sessionData, callback) {
      if (sessionData.gameId) {
        if (!sessionData.isGameAdmin) {
          Game.removePlayer({
            gameName: sessionData.gameName,
            playerId: sessionData.userId
          }, function (err, game) {
            if (err) {
              return callback(err, null);
            }
            User.update(sessionData.userId, {
              loggedIn: false
            }, function (err, users) {
              if (err) {
                return callback(err, null);
              }
              Game.publishRemove(game.id, 'players', users[0].username);
              return callback(null, users[0]);
            });
          });
        } else {
          Game.destroy(sessionData.gameId).exec(function (err) {
            if (!err) {
              console.log('GAME DESTROYED');
              Game.publishDestroy(sessionData.gameId);
              return callback(null);
            }
          });
        }
      } else {
        console.log("LOGGING OUT", sessionData);
        User.update(sessionData.userId, {
          loggedIn: false
        }, function (err, users) {
          if (err) {
            return callback(err, null);
          }
          return callback(null, users[0]);
        });
      }
    }
};
