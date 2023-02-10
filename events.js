const BSEvent = require("./js/BSEvent")
require('./js/bootstrap-notify')

module.exports = {
    notify: new BSEvent('notify').register(async (event, payload) => {
        const message = typeof payload === 'object' ? payload.message : payload
        if (!message) {
            throw new Error('Event payload must be object {message: "my message", ...options} or a plain string "my message"')
        }
        let {title, icon, type, subtitle, ...options} = payload
        const getIcon = type => {
            if (title === undefined) {
                return undefined
            }
            switch (type) {
                case 'warning':
                    return 'fas fa-exclamation-triangle'
                case 'error':
                    return 'fas fa-times'
                case 'success':
                    return 'fas fa-check'
                default:
                    return 'fas fa-info-circle'
            }
        }
        if (icon === undefined) {
            icon = getIcon(type)
        }

        const notificationId = $.notify({message, title, icon}, {
            element: 'body',
            position: null,
            allow_duplicates: true,
            newest_on_top: false,
            showProgressbar: false,
            spacing: 10,
            z_index: 1060,
            delay: 5000,
            url_target: '_blank',
            mouse_over: null,
            animate: {
                enter: 'hoverFadeUp',
                exit: 'hoverFadeDown'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            onClick: null,
            icon_type: 'class',
            // timer: false,
            allow_dismiss: true,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: {
                x: 21,
                y: 47
            },
            type: 'bs-style',
            template: `
                <div class="bs-notifyer-container ${title === undefined ? 'bs-notifyer-untitled' : ''}" role="alert" data-notify="container">
                    <div class="bs-notifyer-title-container">
                        <i class="bs-notifyer-title-icon fa-sm" data-notify="icon"></i>
                        <span class="bs-notifyer-title-text" data-notify="title">{1}</span>
                        <span class="bs-notifyer-subtitle-text">${subtitle === undefined ? '' : subtitle}</span>
                        <button class="bs-notifyer-close btn btn-secondary" type="button" aria-label="Close" data-notify="dismiss">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="bs-notifyer-message" data-notify="message">
                        <i class="bs-notifyer-message-icon fa-sm" data-notify="icon"></i>{2}
                    </div>
                    <div class="progress" data-notify="progressbar">
                        <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                             aria-valuemax="100" style="width: 0%;"></div>
                    </div>
                    <a href="{3}" target="{4}" data-notify="url"></a>
                </div>
                `,
            ...options
        })

        return notificationId
    })
}

if (sessionStore.get('appMode') === 'test') {
    const testHandler = require('./js/test')
    module.exports.testNotify = new BSEvent('test-notify').register(testHandler)
}
