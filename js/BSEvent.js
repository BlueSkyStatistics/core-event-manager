class BSEvent {
    static store = undefined
    static STORE_KEY = 'BSEvents'
    static RESULTS_KEY = 'BSEventResults'
    static RESULTS_MAX_POOL_SIZE = 10

    static list = () => BSEvent.store.get(BSEvent.STORE_KEY, [])
    static results = {}

    static handleCleanResults() {
        // remove resolved results
        Object.entries(BSEvent.results).forEach(([key, {resolved, rejected}]) => {
            if (resolved || rejected) {
                delete BSEvent.results[key]
            }
        })

        // remove the oldest pending promise from pool if overflow happened
        if (Object.keys(BSEvent.results).length > BSEvent.RESULTS_MAX_POOL_SIZE) {
            const [key, {reject}] = Object.entries(BSEvent.results).reduce((prev, next) => {
                const {timestampPrev} = prev[1]
                const {timestampNext} = next[1]
                return timestampPrev < timestampNext ? prev : next
            })
            reject('Cleaned up by garbage collector')
            delete BSEvent.results[key]
        }
    }

    static handleResolveResult(resultKey, resultValue) {
        BSEvent.handleCleanResults()
        const resultNode = Object.keys(BSEvent.results).find(k => k === resultKey.toString())
        if (BSEvent.results[resultNode]) {
            BSEvent.results[resultNode]?.resolve(resultValue)
            BSEvent.results[resultNode].resolved = true
        }
    }

    static resultHandlerMiddleware(func) {
        return async (event, payload) => {
            const awaitResult = payload?.awaitResult

            try {
                const handlerResult = await func.apply(this, [event, payload])
                if (awaitResult !== undefined) {
                    BSEvent.handleResolveResult(awaitResult, handlerResult)
                }
                return handlerResult
            } catch (e) {
                throw e
            }
        }
    }

    constructor(name) {
        if (BSEvent.store === undefined || ipcRenderer === undefined) {
            console.warn('Requirements unset', {store: BSEvent.store, ipcRenderer})
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
            BSEvent.store.set(BSEvent.STORE_KEY, [...this.list, this.name])
            ipcRenderer.on(this.name, BSEvent.resultHandlerMiddleware(handler))
        }
        return this
    }

    handlePayloadMutation(payload) {
        const awaitResult = payload?.awaitResult
        if (awaitResult !== undefined) {
            const resultKey = typeof awaitResult === 'string' ? awaitResult : new Date().getTime()
            let resolveCallback, rejectCallback
            const proxyPromise = new Promise(async (resolve, reject) => {
                resolveCallback = resolve
                rejectCallback = reject
            })
            BSEvent.results[resultKey] = {
                promise: proxyPromise,
                resolve: resolveCallback,
                reject: rejectCallback,
                timestamp: new Date().getTime()
            }
            payload.awaitResult = resultKey
        }
        return payload
    }

    async emit(payload) {
        !this.exists && console.warn(`Event with name [${this.name}] is not registered. Still emitting...`)
        payload = this.handlePayloadMutation(payload)
        await ipcRenderer.send('bsevent', {event: this.name, data: payload})
        if (payload?.awaitResult !== undefined) {
            return BSEvent.results[payload.awaitResult]?.promise
        }
    }
}

module.exports = BSEvent
