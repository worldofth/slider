import { BehaviorSubject, interval, never } from 'rxjs'
import { switchMap, map, scan, filter } from 'rxjs/operators'

export default {
    id: 'autoplay',
    config: {
        options: {
            autoplay: false,
            autoplaySpeed: 4000
        }
    },
    pluginState: {
        pauser: null,
        resetTicker: false,
        pauseAutoPlay: () => {},
        resumeAutoPlay: () => {}
    },
    slideChangeEvents,
    busSubscribe
}

function busSubscribe() {
    this.bus.preUpdate.subscribe(() => {
        this.pluginState.autoplay.resetTicker = true
    })
}

function slideChangeEvents() {
    this.pluginState.autoplay.pauser = new BehaviorSubject(!this.config.options.autoplay)

    const intervalLength = 50
    const intervalObs = interval(intervalLength)

    const autoPlay = this.pluginState.autoplay.pauser.pipe(
        switchMap(paused => (paused ? never() : intervalObs)),
        scan(acc => {
            if (this.pluginState.autoplay.resetTicker) {
                this.pluginState.autoplay.resetTicker = false
                acc = 0
            }
            acc += intervalLength
            return acc
        }, 0),
        filter(timeElapsed => timeElapsed % this.config.options.autoplaySpeed === 0),
        map(() => this.config.options.slidesToScroll),
        filter(() => !this.config.options.disabled)
    )

    this.pluginState.autoplay.pauseAutoPlay = () => {
        this.pluginState.autoplay.pauser.next(true)
    }

    this.pluginState.autoplay.resumeAutoPlay = () => {
        this.pluginState.autoplay.pauser.next(false)
    }

    return autoPlay
}
