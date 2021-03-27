import { fromEvent, race, never } from 'rxjs'
import { map } from 'rxjs/operators'

export default {
    id: 'horizontalSlide',
    config: {
        options: {
            horizontalSlide: true,
            ease: 'cubic-bezier(0.3, 0.15, 0.18, 1)',
            speed: 750
        }
    },
    busSubscribe,
    transitionEndEvent
}

function busSubscribe() {
    this.bus.prebuild.subscribe(prebuild.bind(this))
    this.bus.update.subscribe(update.bind(this))
    this.bus.applyAnimation.subscribe(applyAnimation.bind(this))
    this.bus.reduceAnimation.subscribe(reduceAnimation.bind(this))
    this.bus.removeAnimation.subscribe(removeAnimation.bind(this))
}

function prebuild() {
    if (this.config.options.fade) {
        this.config.options.horizontalSlide = false
    }
}

function applyAnimation() {
    if (!this.config.options.horizontalSlide) {
        return
    }

    this.state.elements.track.style.transition = `transform ${this.config.options.speed}ms ${this.config.options.ease}`
}

function reduceAnimation() {
    if (!this.config.options.horizontalSlide) {
        return
    }

    this.state.elements.track.style.transition = `transform ${1}ms ${this.config.options.ease}`
}

function removeAnimation() {
    if (!this.config.options.horizontalSlide) {
        return
    }

    this.state.elements.track.style.transition = ''
}

function update() {
    if (!this.config.options.horizontalSlide) {
        return
    }

    let transform =
        (100 * (this.state.currentSlide + this.state.slidePositionOffset)) /
        this.config.options.slidesToShow
    this.state.elements.track.style.transform = `translateX(-${transform}%)`
}

function transitionEndEvent() {
    if (!this.config.options.horizontalSlide) {
        return never()
    }

    return race(
        fromEvent(this.state.elements.track, 'webkitTransitionEnd'),
        fromEvent(this.state.elements.track, 'transitionend'),
        fromEvent(this.state.elements.track, 'msTransitionEnd'),
        fromEvent(this.state.elements.track, 'oTransitionEnd')
    ).pipe(map(() => this))
}
