export default {
    id: 'timer',
    config: {
        options: {
            timerTracker: false
        },
        classes: {
            timer: 'o-carousel__timer-bar'
        }
    },
    pluginState: {
        animation: null
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.setup.subscribe(setup.bind(this))
    this.bus.postSetup.subscribe(postSetup.bind(this))
    this.bus.postUpdate.subscribe(postUpdate.bind(this))
}

function setup() {
    if (!this.config.options.timerTracker) {
        return
    }

    this.state.elements.timeTracker = this.state.elements.sliderEl.querySelector(
        '.' + this.config.classes.timer
    )

    import('animejs')
        .then(m => m.default)
        .then(anime => {
            this.pluginState.timer.animation = anime({
                targets: this.state.elements.timeTracker,
                scaleX: [0, 1],
                easing: 'linear',
                duration: this.config.options.autoplaySpeed,
                autoplay: false
            })
        })
}

function postSetup() {
    if (!this.config.options.timerTracker) {
        return
    }
    this.pluginState.autoplay.pauser.subscribe(paused => {
        if (paused) {
            this.pluginState.timer.animation.pause()
        } else {
            this.pluginState.timer.animation.play()
        }
    })
}

function postUpdate() {
    if (!this.config.options.timerTracker) {
        return
    }
    this.pluginState.timer.animation.restart()
}
