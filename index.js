const BSEvent = require('./js/BSEvent')
sessionStore.set(BSEvent.STORE_KEY, [])
require('./events')
module.exports = {
    BSEvent,
    css: ['notifyer.css']
}