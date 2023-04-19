const BSEvent = require('./js/BSEvent')

module.exports = {
    init: ({global}) => {
        BSEvent.store = global.sessionStore
        BSEvent.store.set(BSEvent.STORE_KEY, [])
        BSEvent.results = global[BSEvent.RESULTS_KEY]
        require('./events')
    },
    BSEvent,
    css: ['notifyer.css']
}
