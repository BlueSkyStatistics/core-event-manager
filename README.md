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

### Get result of your action handler
```js 
const myEvent = new BSEvent('myEvent')
```
Your `handler` can return something you would like to retrieve when emitting the event
```js
const myHandler = (event, payload) => {
    // ...handler code here
    return '123 this is the result of my great handler!'
}
```

To get the desired result pass the `awaitResult: true` to your emit payload:
```js
const eventResult = await myEvent.emit({awaitResult: true})
console.log(eventResult) // <- '123 this is the result of my great handler!'
```
Note that `await` is required as event will return a promise