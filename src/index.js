'use strict'

const EventEmitter = require('events')
const old = require('old')

class EventWrapper extends EventEmitter {
  constructor (emitter) {
    super()
    if (emitter == null) {
      throw new Error('Must provide an EventEmitter to wrap')
    }
    this.emitter = emitter
    this.events = {}
    this.on('removeListener', this._onRemoveListener.bind(this))
    this.on('newListener', this._onNewListener.bind(this))
  }

  _onNewListener (event) {
    if (this.events[event]) return
    var listener = (...args) => this.emit(event, ...args)
    this.events[event] = listener
    this.emitter.on(event, listener)
  }

  _onRemoveListener (event) {
    if (this.listenerCount(event) === 0) {
      this._cleanupEvent(event)
    }
  }

  _cleanupEvent (event) {
    this.emitter.removeListener(event, this.events[event])
    delete this.events[event]
  }

  removeAll () {
    for (var event in this.events) {
      this._cleanupEvent(event)
      this.removeAllListeners(event)
    }
  }
}

module.exports = old(EventWrapper)
