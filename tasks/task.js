'use strict'

//do stuff
//done(err, reply)
//reply is optional
function perform(message, done) {
  done(null, {message: 'hello from service'})
}

module.exports = {
  perform: perform
}
