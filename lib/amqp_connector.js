'use strict'

const amqp = require('amqplib/callback_api')
const parse = require('fast-json-parse')
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
        })
        if (message.replyTo && reply) {
          channel.publish('', message.properties.replyTo, Buffer.from(result))
        }
        channel.ack(message)
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
