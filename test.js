var inherits = require('inherits')
var EE       = require('events/')
var test     = require('tape')
var Emitter  = require('./')

test('defining events on the prototype', function(t) {
  t.plan(5)

  var Base = Emitter()
    .on('hello', function(d) { t.equal(d, 'world') })
    .on('lorem', function(d) { t.equal(d, 'ipsum', 'dolor') })
    .on('another', function(d) { t.equal(d, 1, 2, 3) })
    .on('again', function(d) { t.equal(d, 1, 2, 3, 4) })
    .on('five', function(d) { t.equal(d, 1, 2, 3, 4, 5) })

  var emitter = new Base

  emitter.emit('hello', 'world')
  emitter.emit('lorem', 'ipsum', 'dolor')
  emitter.emit('another', 1, 2, 3)
  emitter.emit('again', 1, 2, 3, 4)
  emitter.emit('five', 1, 2, 3, 4, 5)
})

test('defining events on the prototype and instance', function(t) {
  var times = 0

  t.plan(4)

  var Base = Emitter().on('hello', function(d) {
    t.equal(d, 'world')
    times++
  })

  var emitter = new Base().on('hello', function(d) {
    t.equal(d, 'world')
    times++
  })

  emitter.emit('hello', 'world')
  t.equal(times, 2)
  t.equal(emitter.listeners('hello').length, 1)
})

test('applying to an existing prototype', function(t) {
  t.plan(3)

  inherits(EECopy, EE)
  function EECopy() {
    t.pass('constructor preserved')
    EE.call(this)
  }

  Emitter(EECopy).on('hello', function(world) {
    t.equal(world, 'world')
  })

  var emitter = new EECopy

  emitter.on('hello', function(world) {
    t.equal(world, 'world')
  }).emit('hello', 'world')
})

test('once', function(t) {
  t.plan(2)

  var times = 0
  var Base  = Emitter()
    .once('hello', function() {
      t.ok(++times <= 2)
    })

  var emitter1 = new Base
  var emitter2 = new Base

  for (var i = 0; i < 10; i++) {
    emitter1.emit('hello')
    emitter2.emit('hello')
  }
})

test('off', function(t) {
  var Base = Emitter().on('data', data)
  var emitter = new Base

  Base.off('data', data)
  emitter.emit('data')

  t.end()

  function data() {
    t.fail('should not get called')
  }
})
