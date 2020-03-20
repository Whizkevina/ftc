import crypto from 'crypto';
const { Token } = require("../../models/token");
const moment = require("moment");
moment().format();

const User = require("../../models/User");

require('dotenv').config();

const nodemailer = require('nodemailer');

module.exports = (app) => {
	app.post('/forgetPassword', (req, res) => {
		if (req.body.email === '') {
			res.status(400).send('email required');
		}
		console.log(req.body.email);
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then((user) => {
			if (user === null) {
				console.log('email not in database');
				res.status(403).send('email not in db');
			} else {
				const token = crypto.randomBytes(20).toString('hex');
				user.update({
					resetPasswordToken: token,
					resetPasswordExpires: Date.now() + 3600000,
				});

				const transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: "timmyondbeat@gmail.com",
						pass: "Henderex@2",
					},
				});

				const mailOptions = {
					from: 'ftcchoir@gmail.com',
					to: `${user.email}`,
					subject: 'Link to Reset Password',
					text: 
					  'You are receiving this because you (or someone else) have requested the reset of the password for you account. \n\n'
					  + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n'
					  + `http://ft-choir-page.herokuapp.com/reset/${token}\n\n`
					  + 'If you did not request this, please ignore this email and your password  will remain unchanged. \n',
				};

				console.log('sending mail');

				transporter.sendMail(mailOptions, (err, response) => {
					if (err) {
						console.error('there was an error: ', err);
					} else {
						console.log('here is the res: ', response);
						res.status(200).json('recovery email sent');
					}
				});
			}

		});
	});
};