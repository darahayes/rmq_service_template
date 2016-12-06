'use strict'

const config = require('./config')
const task = require('./tasks/task')
const amqpConnector = require('./lib/amqp_connector')

amqpConnector.start(config.rabbit, task.perform)
