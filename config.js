module.exports = {
  rabbit: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    q: process.env.RABBITMQ_QUEUE || 'node_worker',
    maxRetries: 10
  }
}
