'use strict'

const amqp = require('amqplib/callback_api')
const parse = require('fast-json-parse')
const stringify = require('fast-safe-stringify')
const pino = require('pino')()

function start(opts, task) {

  amqp.connect(opts.url, (err, conn) => {
    if (err) exit(err)
    conn.createChannel((err, channel) => {
      channel.assertQueue(opts.q, {durable: true})
      channel.prefetch(1)
      channel.consume(opts.q, (message) => {
        let parsed = parse(message.content)
        if (parsed.err) {
          message.content = message.content.toString()
          pino.error({error: 'Invalid JSON message', message: message})
          return channel.ack(message)
        }
        message.content = parsed.value
        pino.info({info: 'message received', message: message})
        task(message, (err, reply) => {
          if (err) {
            pino.error({error: err})
            return channel.ack(message)
          }
          if (message.properties.replyTo && reply) {
            channel.publish('', message.properties.replyTo, Buffer.from(stringify(reply)))
          }
          channel.ack(message)
        })
      })
    })
  })
}

function exit(error) {
  console.error(error)
  process.exit(1)
}

module.exports = {
  start: start
}
