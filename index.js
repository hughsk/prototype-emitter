var inherits     = require('inherits')
var EventEmitter = require('events/')
var slice        = require('sliced')

module.exports = PrototypeEmitter

function PrototypeEmitter(Original) {
  var maxListeners

  inherits(Base, EventEmitter)
  function Base() {
    EventEmitter.call(this)

    var onceEvents = Base.prototype._onceEvents

    for (var i = 0; i < onceEvents.length; i++) {
      this.once.apply(this, onceEvents[i])
    }
  }

  var proto = Base.prototype
  var _emit = Base.prototype.emit

  Base.addListener = on
  Base.on = on
  Base.once = once

  Base.removeListener = off
  Base.off = off

  proto._onceEvents = []
  proto._sharedEvents = {}

  proto.emit = emit

  if (!Original) return Base

  // Allow prototype-emitter to be applied as a class mixin.
  // include Original's prototype
  var copied = Object.create(Original.prototype)
  Base.prototype = copied

  // include prototype-element's prototype
  extend(Base.prototype, proto, false)

  // include EventEmitter's prototype
  extend(Base.prototype, EventEmitter.prototype, true)

  // Pass static methods from Base onto Original class too
  extend(Original, Base, false)

  Original.prototype = Base.prototype

  return Base = Original

  function on(name, fn) {
    var sharedEvents = Base.prototype._sharedEvents
    sharedEvents[name] = sharedEvents[name] || []
    sharedEvents[name].push(fn)
    return Base
  }

  function once() {
    Base.prototype._onceEvents.push(slice(arguments))
    return Base
  }

  function off(name, fn) {
    var sharedEvents = Base.prototype._sharedEvents
    var events = sharedEvents[name]
    if (!events) return Base
    var idx = events.indexOf(fn)
    if (idx === -1) return Base

    events.splice(idx, 1)

    return Base
  }

  function emit(name, a, b, c, d) {
    if (!name) return

    var sharedEvents = Base.prototype._sharedEvents
    var events = sharedEvents[name]
    var length = events && events.length
    var i = -1

    if (length) {
      switch (arguments.length) {
        case 1:  while (++i !== length) events[i].call(this); break
        case 2:  while (++i !== length) events[i].call(this, a); break
        case 3:  while (++i !== length) events[i].call(this, a, b); break
        case 4:  while (++i !== length) events[i].call(this, a, b, c); break
        case 5:  while (++i !== length) events[i].call(this, a, b, c, d); break
        default: while (++i !== length) events[i].apply(this, slice(arguments, 1)); break
      }
    }

    if (this._events && this._events[name]) {
      _emit.apply(this, slice(arguments))
    }

    return this
  }
}

function extend(a, b, respectful) {
  Object.keys(b).forEach(function(k) {
    if (k === 'super_') return
    a[k] = respectful
      ? a[k] || b[k]
      : b[k]
  })

  return a
}
