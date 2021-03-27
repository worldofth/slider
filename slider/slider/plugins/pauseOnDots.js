import { fromEvent } from 'rxjs'

export default {
    id: 'pauseOnDots',
    config: {
        options: {
            pauseOnDots: true
        }
    },
    pluginState: {
        dotsMouseOver: null,
        dotsMouseOut: null
    },
    events,
    busSubscribe
}

function events() {
    if (
        !this.config.options.pauseOnDots ||
        !this.config.options.dots ||
        !this.config.options.autoplay
    ) {
        return {}
    }

    return {
        dotsMouseOver: fromEvent(this.state.elements.dotNav, 'mouseover'),
        dotsMouseOut: fromEvent(this.state.elements.dotNav, 'mouseout')
    }
}

function busSubscribe() {
    this.bus.eventsUnSub.subscribe(eventsUnSub.bind(this))
    this.bus.eventsSub.subscribe(eventsSub.bind(this))
}

function eventsUnSub() {
    this.pluginState.pauseOnDots.dotsMouseOver &&
        this.pluginState.pauseOnDots.dotsMouseOver.unsubscribe()
    this.pluginState.pauseOnDots.dotsMouseOut &&
        this.pluginState.pauseOnDots.dotsMouseOut.unsubscribe()
}

function eventsSub() {
    if (
        !this.config.options.pauseOnDots ||
        !this.config.options.dots ||
        !this.config.options.autoplay
    ) {
        return {}
    }

    this.pluginState.pauseOnDots.dotsMouseOver = this.events.dotsMouseOver.subscribe(
        this.pluginState.autoplay.pauseAutoPlay.bind(this)
    )

    this.pluginState.pauseOnDots.dotsMouseOut = this.events.dotsMouseOut.subscribe(
        this.pluginState.autoplay.resumeAutoPlay.bind(this)
    )
}
