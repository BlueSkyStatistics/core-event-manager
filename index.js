/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */



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
