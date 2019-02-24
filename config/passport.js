const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { login } = require('../handlers/usersHandlers')
const { userModelGetUser } = require('../models/user')

passport.use('local', new LocalStrategy({ usernameField: 'name', passwordField: 'password' }, async (name, password, done) => {
    try {
        let user = await login(name, password)
        done(null, user)
    } catch (err) {
        done(null, false, err)
    }
}))

passport.serializeUser((user, done) => done(null, user.name))

passport.deserializeUser(async (name, done) => {
    try {
        let user = await userModelGetUser(name)
        user ? done(null, user.name) : done(null, null)
    } catch (err) {
        done(err, null)
    }
})