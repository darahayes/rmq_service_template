'use strict'

const config = require('./config')
const thingy = require('./lib/thingy')()

thingy.transport(require('./lib/amqp_transport'), config.rabbit)

thingy.receive((msg, done) => {
  console.log('message received', msg)
  thingy.dispatch('jenny.other', {'msg': 'hello from the thingy'})
  done()
})

thingy.start()
