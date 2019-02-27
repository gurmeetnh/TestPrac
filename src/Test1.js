* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

/** Use passport module */
const passport = require('passport');

const app = express();
const DigestItems = require('../DataManager/DigestItems');

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
    res.setHeader('expires', '0');
    res.setHeader('pragma', 'no-cache');
    next();
});

/** Require passport and Auth services from AuthManager */
require('../AuthManager/passport')(passport);
require('../AuthManager/auth')(app, passport);

/** Anonymous endpoint */
app.get(
    '/',
    (_, res) => {
        res.send('You hit the home page that has anonymous access!\n');
    },
);

/** Authorized Endpoints */
app.get(
    '/digestItems',
    passport.authenticate('bearer', { session: false }), // This calls passport.BearerStrategy()
    (req, res) => {
        DigestItems.findAll()
            .then((digestItems) => {
                console.log(`Token is` + JSON.stringify(req.user));
                // console.log(`user is ${req.user}`);
                res.send(digestItems);
            });
    },
);

app.post(
    '/digestItems',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
    DigestItems.create({ note: req.body.note })
        .then((digestItem) => {
        res.send(digestItem);
});
},
);

app.delete(
    '/digestItems/:id',
    passport.authenticate('bearer', { session: false }),

    (req, res) => {
        DigestItems.findById(req.params.id)
            .then(digestItem => digestItem.destroy())
            .then(() => res.send());
    },
);

/** Start Listening port */
app.listen(3000, () => console.log('Example app listening on port 3000!'));

// Add line 3 in master