const { Token } = require("../../models/token");
const moment = require("moment");
moment().format();

const User = require("../../models/User");

module.exports = app => {
	app.get('/reset', (req, res, next) => {
		User.findOne({
			where: {
				resetPasswordToken: req.query.resetPasswordToken,
				resetPasswordExpires: {
					$gt: Date.now(),
				},
			},
		}).then(user => {
			if (user == null) {
				console.log('password reset link is invalid or has expired');
				res.json('password reset link is invalid or has expired');
			} else {
				res.status(200).send({
					email: user.email,
					message: 'password reset link a-ok',
				});
			}
		});
	});
};