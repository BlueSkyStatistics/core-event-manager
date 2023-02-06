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
!!! Getting a result requires your `handler` to be able to do that
```js
const myHandlerWithResultsReturn = (event, payload) => {
    const {awaitResult, ...otherOptions} = payload
    //  
    // ...handler code here
    //  
    const resultData = '*result of my great handler*'
    if (awaitResult !== undefined) {
        BSEvent.handleResolveResult(awaitResult, resultData)
    }
}
```

When your `handler` is configured get the desired results:
```js
const eventResult = await myEvent.emit({awaitResult: true})
console.log(eventResult) // <- '*result of my great handler*'
```
