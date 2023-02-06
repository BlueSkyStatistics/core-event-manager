# eventManager
Event manager module to register and emit events and notifications

### Basic usage: 
* to register an event handler:
```js:
const EVENT_NAME = 'myEvent'
const myHandler = async (event, payload) => {
    console.log('Handling payload:', payload, ' for event:', event)
    return 'Wow that was cool!'
}
const myEvent = new BSEvent(EVENT_NAME)
myEvent.register(myHandler)
```

* to emit event anywhere: 
```js
new BSEvent('myEvent').emit({my: 'payload'})
```

* to list registered events:
```js
BSEvent.list()
```
or
```js
const myEvent = new BSEvent('myEvent')
myEvent.list // - same as BSEvent.list()
```