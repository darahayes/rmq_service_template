'use strict'

const config = require('./config')
const thingy = require('./lib/thingy')()

thingy.transport(require('./lib/amqp_transport'), config.rabbit)

thingy.receive((msg, dispatch, done) => {
  dispatch('jenny.other', {'msg': 'hello from the thingy'})
  done()
})

thingy.start((err) => {
  if (err) {
    throw err
  }
  console.log('thingy started')
})
