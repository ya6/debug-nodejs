const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

console.log('usercontroller');
router.post('/signup', (req, res) => {
    User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordhash: bcrypt.hashSync(req.body.user.password, 10),
        email: req.body.user.email,
    })
        .then(
            function signupSuccess(user) {
                let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user: user,
                    token: token
                })
            },

            function signupFail(err) {
                res.status(500).send(err.message)
            }
        )
})

router.route('/signin').post( (req, res) => { 
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
                if (matches) {
                    const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user: user,
                        message: "Successfully authenticated.",
                        sessionToken: token
                    });
                } else {
                    res.status(401).send({ error: "Passwords do not match." }) //502--401
                }
            });
        } else {
            res.status(404).send({ error: "User not found." }) //403 --> 404
        }

    })
})

module.exports = router;