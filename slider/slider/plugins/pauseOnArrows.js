import { fromEvent } from 'rxjs'

export default {
    id: 'pauseOnArrows',
    config: {
        options: {
            pauseOnArrows: true
        }
    },
    pluginState: {
        nextArrowMouseOver: null,
        nextArrowMouseOut: null,
        prevArrowMouseOver: null,
        prevArrowMouseOut: null
    },
    events,
    busSubscribe
}

function events() {
    if (
        !this.config.options.pauseOnArrows ||
        !this.config.options.arrows ||
        !this.config.options.autoplay
    ) {
        return {}
    }

    return {
        nextArrowMouseOver: fromEvent(this.state.elements.nextArrow, 'mouseover'),
        nextArrowMouseOut: fromEvent(this.state.elements.nextArrow, 'mouseout'),
        prevArrowMouseOver: fromEvent(this.state.elements.prevArrow, 'mouseover'),
        prevArrowMouseOut: fromEvent(this.state.elements.prevArrow, 'mouseout')
    }
}

function busSubscribe() {
    this.bus.eventsUnSub.subscribe(eventsUnSub.bind(this))
    this.bus.eventsSub.subscribe(eventsSub.bind(this))
}

function eventsUnSub() {
    this.pluginState.pauseOnArrows.nextArrowMouseOver &&
        this.pluginState.pauseOnArrows.nextArrowMouseOver.unsubscribe()
    this.pluginState.pauseOnArrows.nextArrowMouseOut &&
        this.pluginState.pauseOnArrows.nextArrowMouseOut.unsubscribe()
    this.pluginState.pauseOnArrows.prevArrowMouseOver &&
        this.pluginState.pauseOnArrows.prevArrowMouseOver.unsubscribe()
    this.pluginState.pauseOnArrows.prevArrowMouseOut &&
        this.pluginState.pauseOnArrows.prevArrowMouseOut.unsubscribe()
}

function eventsSub() {
    if (
        !this.config.options.pauseOnArrows ||
        !this.config.options.arrows ||
        !this.config.options.autoplay
    ) {
        return
    }

    this.pluginState.pauseOnArrows.nextArrowMouseOver = this.events.nextArrowMouseOver.subscribe(
        this.pluginState.autoplay.pauseAutoPlay.bind(this)
    )

    this.pluginState.pauseOnArrows.nextArrowMouseOut = this.events.nextArrowMouseOut.subscribe(
        this.pluginState.autoplay.resumeAutoPlay.bind(this)
    )

    this.pluginState.pauseOnArrows.prevArrowMouseOver = this.events.prevArrowMouseOver.subscribe(
        this.pluginState.autoplay.pauseAutoPlay.bind(this)
    )

    this.pluginState.pauseOnArrows.prevArrowMouseOut = this.events.prevArrowMouseOut.subscribe(
        this.pluginState.autoplay.resumeAutoPlay.bind(this)
    )
}
