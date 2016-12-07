function thingy() {
  if (!(this instanceof thingy)) {
    return new thingy()
  }
  //This could become a bloom filter eventually to
  //to support multiple receivers based off patterns
  //aka the coolest part of seneca
  this._receiver = null
  this._transport = null
}

thingy.prototype.transport = function (transport, opts) {
  this._transport = transport(this, opts)
}

thingy.prototype.receive = function (handler) {
  this._receiver = handler
}

thingy.prototype.received = function(message, done) {
  if (this._receiver) {
    this._receiver(message, this._transport.dispatch, done)
  }
  else {
    done()
  }
}

thingy.prototype.dispatch = function (key, msg) {
  this._transport.dispatch(key, msg)
}

thingy.prototype.start = function () {
  this._transport.start()
  return this
}

module.exports = thingy
