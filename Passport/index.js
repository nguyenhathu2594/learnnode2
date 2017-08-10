const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const fs = require('fs');
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "mysecret" }));
app.use(Passport.initialize());
app.use(Passport.session());

app.get('/', (req, res) => res.render('index'));

app.route('/login')
    .get((req, res) => res.render('login'))
    .post(Passport.authenticate('local', { failureRedirect: '/login' }));


Passport.use(new localStrategy(
    (username, password, done) => {
        fs.readFile('./userdb.json', (err, data) => {
            const db = JSON.parse(data)
            const userRc = db.find(x => x.usr == username)
            if (userRc && userRc.pwd == password) {
                return done(null, userRc)
            } else {
                return done(null, false)
            }
        })
    }
))

Passport.serializeUser((user, done) => {
    done(null, user.usr);
})

const port = 3000;
app.listen(port, () => console.log(`Server chay tren cong ${port}`));