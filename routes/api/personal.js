const express = require('express');
const router = express.Router();

// Load Contact model
const Personals = require('../../models/Personal');

// @route GET api/personals/test
// @description tests  route
// @access Public

router.get('/test', (req, res) => res.send('personal route testing!'));

// @route GET api/personals
// @description Get all personals
// @access Public
router.get('/', (req, res) => {
  Personals.find()
    .then(personals => res.json(personals))
    .catch(err =>
      res.status(404).json({ nopersonalsfound: 'Not found' }),
    );
});

// @route GET api/personals/:id
// @description Get single personal by id
// @access Public
router.get('/:id', (req, res) => {
  Personals.findById(req.params.id)
    .then(personal => res.json(personal))
    .catch(err => res.status(404).json({ nopersonalfound: 'Not found' }));
});

// @route GET api/personals
// @description add/save personal component
// @access Public
router.post('/', (req, res) => {
  Personals.create(req.body)
    .then(personal => res.json({ msg: 'Personal added successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to add this Contact' }),
    );
});

// @route GET api/tasks/:id
// @description Update task
// @access Public
router.put('/:id', (req, res) => {
  Personals.findByIdAndUpdate(req.params.id, req.body)
    .then(personal => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' }),
    );
});

// @route GET api/tasks/:id
// @description Delete task by id
// @access Public
router.delete('/:id', (req, res) => {
  Personals.findByIdAndRemove(req.params.id, req.body)
    .then(personal => res.json({ mgs: 'Personals entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a Contact' }));
});

module.exports = router;