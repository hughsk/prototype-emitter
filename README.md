# prototype-emitter [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/prototype-emitter&title=prototype-emitter&description=hughsk/prototype-emitter%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Define [EventEmitter](https://github.com/Gozala/events) listeners on a class
to save on memory consumption in exchange for a little bit of extra work
emitting the events themselves.

Suitable when you've got a lot of mostly similar EventEmitters, and you're not
emitting enough events for it to be a performance bottleneck.

See also: [bindle](http://github.com/hughsk/bindle)

## Usage ##

[![prototype-emitter](https://nodei.co/npm/prototype-emitter.png?mini=true)](https://nodei.co/npm/prototype-emitter)

### Emitter([BaseClass])

Returns a new `prototype-emitter` class. Optionally you can pass a `BaseClass`
in as the first argument to mixin `prototype-emitter` functionality.

Once created or mixed in, you can add event listeners directly on the
class before (or after) creating instances of it. These listeners will
be available on each instance, so calling `ee.emit` will trigger these
listeners too.

``` javascript
var PrototypeEmitter = require('prototype-emitter')
var CustomEmitter = PrototypeEmitter()

CustomEmitter.once('data', function() {
  console.log('data recieved: ')
})

CustomEmitter.on('data', function(data) {
  console.log('>>', data)
})

var emitter = new CustomEmitter

emitter.on('data', function(data) {
  console.log(' >', data)
})

emitter.emit('data', 1)
emitter.emit('data', 2)
emitter.emit('data', 3)

// data recieved:
// >> 1
//  > 1
// >> 2
//  > 2
// >> 3
//  > 3
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/prototype-emitter/blob/master/LICENSE.md) for details.
