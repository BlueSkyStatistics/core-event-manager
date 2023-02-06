module.exports = function (event, payload) {
    setTimeout(() => {
        const notifications = [
            {
                timer: false, title: 'Title', subtitle: '...and subtitle', message: `
<div>
Hello, I'm message!
</div>
`
            },
            {
                timer: false, title: 'Another Title', message: `
<div>
Hello, I'm message with a button: 
<button class="btn btn-outline btn-secondary btn-sm" onclick='new BSEvent("notify").emit("Wow! With no title!")'>wow</button>
</div>
`
            },
            {timer: false, title: 'Warning', message: 'Warning you', type: 'warning'},
            {timer: false, message: 'No title, bt with icon', icon: 'fa fa-air-freshener'},
            {
                timer: false, title: 'Another Title', message: `
<div>
Updates available! Goto: 
<button class="btn btn-outline btn-secondary btn-sm" data-toggle="modal" data-target="#marketplace" data-notify="dismiss">Market</button>
</div>
`
            },
        ]
        const inrvl = setInterval(() => {
            const notification_payload = notifications.splice(0, 1)
            if (notification_payload.length === 0) {
                console.log('interval cleared')
                clearInterval(inrvl)
                return
            }
            console.log('emitting', notification_payload)
            new BSEvent('notify').emit(notification_payload[0])
        }, 2000)
    }, 3000)
}


