const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const { Token } = require("../models/token");
const moment = require("moment");
moment().format();
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");


const host = process.env.HOST; // FRONTEND Host
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");



// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          unit_id: user.unit_id,
          rehearsal_location: user.rehearsal_location,
          vocal_part: user.vocal_part,
          gender: user.gender,
          email: user.email,
          title: user.title,
          phone: user.phone,
          whatsapp_phone: user.whatsapp_phone,
          contact_address: user.contact_address,
          pha: user.pha,
          dob: user.dob,
          wed_date: user.wed_date,
          marital_status: user.marital_status,
          work_status: user.work_status,
          profession: user.profession,
          employer_name: user.employer_name,
          employer_address: user.employer_address,
          state_origin: user.state_origin,
          nationality: user.nationality,
          nok_name: user.nok_name,
          nok_address: user.nok_address,
          nok_phone: user.nok_phone,
          nok_occupation: user.nok_occupation,
          nok_relation: user.nok_relation,
          nok_email: user.nok_email,
          membership_status: user.membership_status,
          leadership_status: user.leadership_status,
          sub_group: user.sub_group,
          wsf_status: user.wsf_status,
          new_birth_year: user.new_birth_year,
          holy_spirit_year: user.holy_spirit_year,
          lfc_joined_year: user.lfc_joined_year,
          ordination_year: user.ordination_year,
          province: user.province,
          district: user.district,
          zone: user.zone

        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600 // 1 hour in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});



// @route for reseting password
router.post("/login/forgot", (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (!user)
      return res.status(400).send({ message: "This email is not valid." });

    // Create a verification token
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    user.passwordResetToken = token.token;
    user.passwordResetExpires = moment().add(12, "hours");

    user.save(function(err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      // Save the token
      token.save(function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        // Send the mail
        const mail = {
          to: user.email,
          from: `no-reply@ft-choir.herokuapp.com`,
          subject: "Reset password link",
          text: "Some useless text",
          html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n
        <a href="https://${host}/login/reset/${
            token.token
          }">https://${host}/login/reset/${
            token.token
          }</a> \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n </p>`
        };
        sgMail
          .send(mail)
          .then(() => {
            return res
              .status(200)
              .send({ message: "A verification mail has been sent." });
          })
          .catch(error => {
            return res.status(500).send({ message: error });
          });
      });
    });
  });
});

router.post("/login/reset/:token", (req, res) => {
  // Validate password Input
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  // Find a matching token
  Token.findOne({ token: req.params.token }, function(err, token) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (!token)
      return res.status(400).send({
        message: "This token is not valid. Your token my have expired."
      });

    // If we found a token, find a matching user
    User.findById(token._userId, function(err, user) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!user)
        return res
          .status(400)
          .send({ message: `We were unable to find a user for this token.` });
      if (user.passwordResetToken !== token.token)
        return res.status(400).send({
          message:
            "User token and your token didn't match. You may have a more recent token in your mail list."
        });
      // Verify that the user token expires date has not been passed
      if (moment().utcOffset(0) > user.passwordResetExpires) {
        return res.status(400).send({
          message: "Token has expired."
        });
      }
      // Update user
      user.password = req.body.password;
      user.passwordResetToken = "nope";
      user.passwordResetExpires = moment().utcOffset(0);
      //Hash new password
      user.hashPassword().then(() =>
        // Save updated user to the database
        user.save(function(err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          // Send mail confirming password change to the user
          const mail = {
            to: user.email,
            from: `no-reply@ft-choir.herokuapp.com`,
            subject: "Your password has been changed",
            text: "Some useless text",
            html: `<p>This is a confirmation that the password for your account ${
              user.email
            } has just been changed. </p>`
          };
          sgMail.send(mail).catch(error => {
            return res.status(500).send({ message: error });
          });
          return res
            .status(200)
            .send({ message: "Password has been reset. Please log in." });
        })
      );
    });
  });
});


// @route GET api/personals/:id
// @description Get single personal by id
// @access Public
router.get('/detail/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ nopersonalfound: 'Not user found' }));
});

// @route GET api/tasks/:id
// @description Update task
// @access Public
// router.put('/update/:id', (req, res) => {
//   User.findByIdAndUpdate(req.params.id, req.body)
//     .then(user => {
//       console.log('User with updated info', user);
//       res.json({ user, msg: 'Updated successfully'})
//     })
//     .catch(err =>
//       res.status(400).json({ error: 'Unable to update the Database' }),
//     );
// });


router.put('/update/:id', (req, res) => {
  User.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, user ) => {
    if(err) res.status(400).json({ error: 'Unable to update the Database' });

      console.log('User with updated info', user);
      res.json({ user, msg: 'Updated successfully'})
  }); 
});

module.exports = router;