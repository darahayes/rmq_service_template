'use strict'

const amqp = require('amqplib/callback_api')
const parse = require('fast-json-parse')
const stringify = require('fast-safe-stringify')
const pino = require('pino')()

module.exports = function(thingy, opts) {

  var connection = null
  var channel = null

  function start(done) {
    amqp.connect(opts.url, (err, conn) => {
      if (err) done(err)
      connection = conn
      conn.createChannel((err, ch) => {
        channel = ch
        channel.assertQueue(opts.q, {durable: true})
        channel.prefetch(1)
        channel.consume(opts.q, (message) => {
          parseMessage(message, (err, parsed) => {
            if (err) {
              pino.error({error: 'Invalid JSON message', message: message})
              return channel.ack(message)
            }
            thingy.received(message, (err, result) => {
              channel.ack(message)
            })
          })
        })
        done()
      })
    })
  }

  function dispatch(key, msg) {
    channel.publish('', key, Buffer.from(stringify(msg)))
  }

  function parseMessage(message, done) {
    let parsed = parse(message.content)
    if (parsed.err) {
      message.content = message.content.toString()
      return done(parsed.err)
    }
    message.content = parsed.value
    done(null, message)
  }

  function exit(error) {
    pino.error(error)
    process.exit(1)
  }

  return {
    start: start,
    dispatch: dispatch
  }
}
