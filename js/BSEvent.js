class BSEvent {
    static STORE_KEY = 'BSEvents'
    static RESULTS_KEY = 'BSEventResults'


    static list = () => sessionStore.get(BSEvent.STORE_KEY, [])
    static results = global[BSEvent.RESULTS_KEY]
    static setResult({resultKey, resultValue}) {
        BSEvent.results[resultKey] = resultValue
    }
    static handleCleanResults() {
        Object.entries(BSEvent.results).forEach(([key, {retrieved}]) => {
            if (retrieved) {
                delete BSEvent.results[key]
            }
        })
    }

    static handleResolveResult(resultKey, resultValue) {
        BSEvent.handleCleanResults()
        const resultNode = Object.keys(BSEvent.results).find(k => k === resultKey.toString())
        if (BSEvent.results[resultNode]) {
            BSEvent.results[resultNode]?.resolve(resultValue)
            BSEvent.results[resultNode].retrieved = true
        }
    }

    constructor(name) {
        if (sessionStore === undefined || ipcRenderer === undefined) {
            console.warn('Requirements unset', {sessionStore, ipcRenderer})
        }
        this.name = name
    }

    get list() {
        return BSEvent.list()
    }

    get exists() {
        return this.list.includes(this.name)
    }

    register(handler) {
        if (this.exists) {
            throw new Error(`Event with name [${this.name}] is already registered!`)
        } else {
            sessionStore.set(BSEvent.STORE_KEY, [...this.list, this.name])
            ipcRenderer.on(this.name, handler)
        }
        return this
    }

    async emit(payload) {
        !this.exists && console.warn(`Event with name [${this.name}] is not registered. Still emitting...`)
        const {awaitResult} = payload
        if (awaitResult !== undefined) {
            let resultKey = new Date().getTime()
            switch (typeof awaitResult) {
                case 'string':
                    resultKey = awaitResult
                case 'boolean':
                default:
                    let resolveCallback
                    const proxyPromise = new Promise(async (resolve, reject) => {
                        resolveCallback = resolve
                    })
                    BSEvent.setResult({resultKey, resultValue: {promise: proxyPromise, resolve: resolveCallback}})
                    payload.awaitResult = resultKey
                    break
            }
        }
        await ipcRenderer.invoke('bsevent', {event: this.name, data: payload})
        if (awaitResult) {
            return BSEvent.results[payload.awaitResult]?.promise
        }
    }
}

BSEvent.results = {}
module.exports = BSEvent
