const { authenticate } = require('passport')
const bcrypt = require('bcrypt');
// How to use the local version of passport
const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser =  async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: 'No user with that email'})    // false: no user found, null: no error
        }
        try{
            if(await bcrypt.compare(password, user.password)) {   // password: sent with the login form
                // if there is a authenticated user
                return done(null, user)
            }  
            else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }
        catch (e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize