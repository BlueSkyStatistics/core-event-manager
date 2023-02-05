class BSEvent {
    static STORE_KEY = 'BSEvents'
    static list = () => sessionStore.get(BSEvent.STORE_KEY, [])

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
        await ipcRenderer.invoke('bsevent', {event: this.name, data: payload})
    }
}

module.exports = BSEvent
