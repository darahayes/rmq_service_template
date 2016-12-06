module.exports = {
  rabbit: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    q: process.env.RABBITMQ_QUEUE || 'node_worker'
  }
}
