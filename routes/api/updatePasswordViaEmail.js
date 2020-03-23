const { Token } = require("../../models/token");
const moment = require("moment");
moment().format();

const bcrypt = require('bcryptjs');
const User = require("../../models/User");

const BCRYPT_SALT_ROUNDS = 12;
module.exports = app => {
	app.put('/updatePasswordViaEmail', (req, res, next) => {
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then(user => {
			if (user !== null) {
				console.log('user exists in db');
				bcrypt
					.hash(req.body.password, BCRYPT_SALT_ROUNDS)
					.then(hashedPassword => {
						user.update({
							password: hashedPassword,
							resetPasswordToken: null,
							resetPasswordExpires: null,
						});
					})
					.then(() => {
						console.log('password updated');
						res.status(200).send({ message: 'password updated'});
					});
			} else {
				console.log('no user exists in db to update');
				res.status(404).json('')
			}
		})
	})
}