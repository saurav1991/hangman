/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	login : function (req, res, next) {
		User.findOne({
			username: req.param('username')
		}).exec(function (err, user) {
			if (err) {
				return res.negotiate(err);
			}
			if (user) {
				if (user.password !== req.param('password')) {
					return res.forbidden();
				}
				user.loggedIn = true;
				user.save(function (err) {
					if (!err) {
						req.session.authenticated = true;
						req.session.userId = user.id;
						return res.view('game/index');
					}
				});
			}
		});
	},
	logout: function (req, res, next) {
		req.session.authenticated = false;

		User.processLogout({
			userId: req.session.userId,
			gameId: req.session.gameId,
			gameName: req.session.gameName,
			isGameAdmin: req.session.isGameAdmin
		}, function (err, user) {
			req.session.userId = undefined;
			req.session.gameId = undefined;
			req.session.gameName = undefined;
			req.session.isGameAdmin = undefined;
			if (err) {
				return res.negotiate(err);
			}
			return res.view('homepage');
		});
	},
	signup: function (req, res, next) {
		User.create(req.body).exec(function (err, user) {
			console.log('USER CREATED', user);
			if (err) {
				return res.badRequest();
			}
			return res.view('user/welcome');
		});
	}
};

