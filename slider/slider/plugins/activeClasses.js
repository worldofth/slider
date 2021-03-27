import { fromEvent, race, never } from 'rxjs'
import { map } from 'rxjs/operators'

export default {
    id: 'activeClasses',
    config: {
        options: {
            activeClasses: false,
            infiniteActiveClasses: false,
            activeHalfSteps: false
        },
        classes: {
            transitionWatch: 'js-transition-watch',
            transitionWatchActive: 'is-active',
            current: 'is-current',
            previous: 'is-previous',
            reduceAnim: 'is-anim-reduced',
            removeAnim: 'is-anim-removed',
            left: 'is-left',
            right: 'is-right',
            half: 'is-half'
        }
    },
    pluginState: {
        lastPrevious: undefined
    },
    busSubscribe,
    transitionEndEvent
}

function busSubscribe() {
    this.bus.postSetup.subscribe(postSetup.bind(this))
    this.bus.build.subscribe(build.bind(this))
    this.bus.update.subscribe(update.bind(this))
    this.bus.transitionEnd.subscribe(transitionEnd.bind(this))
    this.bus.applyAnimation.subscribe(applyAnimation.bind(this))
    this.bus.reduceAnimation.subscribe(reduceAnimation.bind(this))
    this.bus.removeAnimation.subscribe(removeAnimation.bind(this))
}

function postSetup() {
    if (
        !this.config.options.infiniteFade &&
        !this.config.options.fade &&
        !this.config.options.infiniteSlide &&
        !this.config.options.infiniteActiveClasses
    ) {
        this.state.maxSlidePosition = this.state.slideCount - this.config.options.slidesToShow
        this.state.minSlidePosition = 0
        return
    }

    if (this.config.options.infiniteActiveClasses && this.config.options.activeClasses) {
        if (this.config.options.activeHalfSteps) {
            this.state.maxSlidePosition = this.state.slideCount * 2
            this.state.minSlidePosition = -1
        } else {
            this.state.maxSlidePosition = this.state.slideCount
            this.state.minSlidePosition = -1
        }
    }
}

function build() {
    if (!this.config.options.activeClasses) {
        return
    }

    this.state.elements.transitionWatch = this.state.elements.sliderEl.querySelector(
        '.' + this.config.classes.transitionWatch
    )

    if (!this.state.elements.transitionWatch) {
        console.warn('transition watch element not found, active classes has been disabled')
        this.config.options.activeClasses = false
    }
}

function update() {
    if (!this.config.options.activeClasses) {
        return
    }

    const isLeft =
        this.state.currentSlide + this.state.slidePositionOffset <
        this.state.previousSlide + this.state.slidePositionOffset

    if (this.state.currentSlide === this.state.maxSlidePosition) {
        this.state.currentSlide = 0
    }

    if (this.state.currentSlide === this.state.minSlidePosition) {
        this.state.currentSlide = this.state.maxSlidePosition - 1
    }

    let currentPos = this.state.currentSlide + this.state.slidePositionOffset
    let previousPos = this.state.previousSlide + this.state.slidePositionOffset
    let isHalfStep = false

    if (this.config.options.activeHalfSteps) {
        isHalfStep = !!(currentPos % 2)
        currentPos = Math.floor(currentPos / 2)
        previousPos = Math.floor(previousPos / 2)
    }

    if (this.pluginState.activeClasses.lastPrevious !== undefined) {
        this.state.elements.slides[this.pluginState.activeClasses.lastPrevious].classList.remove(
            this.config.classes.previous
        )
    }

    if (currentPos !== previousPos) {
        this.state.elements.slides[previousPos].classList.remove(this.config.classes.current)
        this.state.elements.slides[previousPos].classList.add(this.config.classes.previous)
        this.pluginState.activeClasses.lastPrevious = previousPos

        if (isLeft) {
            this.state.elements.sliderEl.classList.remove(this.config.classes.right)
            this.state.elements.sliderEl.classList.add(this.config.classes.left)
        } else {
            this.state.elements.sliderEl.classList.remove(this.config.classes.left)
            this.state.elements.sliderEl.classList.add(this.config.classes.right)
        }
    }

    if (isHalfStep) {
        this.state.elements.sliderEl.classList.add(this.config.classes.half)
    } else {
        this.state.elements.sliderEl.classList.remove(this.config.classes.half)
    }

    this.state.elements.slides[currentPos].classList.add(this.config.classes.current)

    this.state.elements.transitionWatch.classList.add(this.config.classes.transitionWatchActive)
}

function transitionEnd() {
    if (!this.config.options.activeClasses) {
        return
    }

    this.state.elements.transitionWatch.classList.remove(this.config.classes.transitionWatchActive)
}

function applyAnimation() {
    this.state.elements.sliderEl.classList.remove(this.config.classes.reduceAnim)
    this.state.elements.sliderEl.classList.remove(this.config.classes.removeAnim)
}

function reduceAnimation() {
    this.state.elements.sliderEl.classList.add(this.config.classes.reduceAnim)
}

function removeAnimation() {
    this.state.elements.sliderEl.classList.add(this.config.classes.removeAnim)
}

function transitionEndEvent() {
    if (!this.config.options.activeClasses) {
        return never()
    }

    return race(
        fromEvent(this.state.elements.transitionWatch, 'webkitTransitionEnd'),
        fromEvent(this.state.elements.transitionWatch, 'transitionend'),
        fromEvent(this.state.elements.transitionWatch, 'msTransitionEnd'),
        fromEvent(this.state.elements.transitionWatch, 'oTransitionEnd')
    ).pipe(map(() => this))
}
