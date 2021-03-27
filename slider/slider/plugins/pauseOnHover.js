export default {
    id: 'pauseOnHover',
    config: {
        options: {
            pauseOnHover: false
        }
    },
    pluginState: {
        hoverOver: null,
        hoverOut: null
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.eventsUnSub.subscribe(eventsUnSub.bind(this))
    this.bus.eventsSub.subscribe(eventsSub.bind(this))
}

function eventsUnSub() {
    this.pluginState.pauseOnHover.hoverOver && this.pluginState.pauseOnHover.hoverOver.unsubscribe()
    this.pluginState.pauseOnHover.hoverOut && this.pluginState.pauseOnHover.hoverOut.unsubscribe()
}

function eventsSub() {
    if (this.config.options.pauseOnHover && this.config.options.autoplay) {
        this.pluginState.pauseOnHover.hoverOver = this.events.mouseOver.subscribe(
            this.pluginState.autoplay.pauseAutoPlay.bind(this)
        )
        this.pluginState.pauseOnHover.hoverOut = this.events.mouseOut.subscribe(
            this.pluginState.autoplay.resumeAutoPlay.bind(this)
        )
    }
}
