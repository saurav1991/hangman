/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	login : function (req, res, next) {
		User.findOne(req.body, function (err, user) {
			if (err) {
				return res.json(500, err);
			}
			if (!user) {
				return res.send(400, 'Incorrect username / passowrd');
			}
			req.session.authenticated = true;
			req.session.userId = user.id;
			return res.view('game/index');
		});
	},
	logout: function (req, res, next) {
		req.session.authenticated = false;
		return res.view('homepage');
	},
	signup: function (req, res, next) {
		console.log("req body", req.body);
		User.create(req.params.all()).exec(function (err, user) {
			console.log('USER', user);
			if (err) {
				return res.json(err);
			}
			//req.user = user;
			req.session.authenticated = true;
			return res.view('user/welcome');
		});
	}
};

