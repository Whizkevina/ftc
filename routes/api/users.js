const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

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
          lastname: user.lastname
          // unit_id: user.unit_id,
          // rehearsal_location: user.rehearsal_location,
          // vocal_part: user.vocal_part,
          // gender: user.gender,
          // email: user.email,
          // title: user.title,
          // phone: user.phone,
          // whatsapp_phone: user.whatsapp_phone,
          // contact_address: user.contact_address,
          // pha: user.pha,
          // dob: user.dob,
          // wed_date: user.wed_date,
          // marital_status: user.marital_status,
          // work_status: user.work_status,
          // profession: user.profession,
          // employer_name: user.employer_name,
          // employer_address: user.employer_address,
          // state_origin: user.state_origin,
          // nationality: user.nationality,
          // nok_name: user.nok_name,
          // nok_address: user.nok_address,
          // nok_phone: user.nok_phone,
          // nok_occupation: user.nok_occupation,
          // nok_relation: user.nok_relation,
          // nok_email: user.nok_email,
          // membership_status: user.membership_status,
          // leadership_status: user.leadership_status,
          // sub_group: user.sub_group,
          // wsf_status: user.wsf_status,
          // new_birth_year: user.new_birth_year,
          // holy_spirit_year: user.holy_spirit_year,
          // lfc_joined_year: user.lfc_joined_year,
          // ordination_year: user.ordination_year,
          // province: user.province,
          // district: user.district,
          // zone: user.zone

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