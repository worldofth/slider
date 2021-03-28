// import anime from 'animejs'

import anime from 'animejs'

export const HorizontalSlide = {
    name: 'HorizontalSlide',
    config: {
        options: {
            horizontalSlide: false,
            animationSpeed: 750,
            easing: 'cubicBezier(0.3, 0.15, 0.18, 1)'
        }
    },
    state: {
        currentAnimation: null,
        singleSlideMovePercent: 0,
        looped: false
    },
    build: {
        order: 0,
        fnc: build
    },
    subscribeToEvents
}

function subscribeToEvents() {
    this.bus.events.slideChange.subscribe(slideChange.bind(this))
    this.bus.events.infiniteLoop.subscribe(infiniteLoop.bind(this))
}

function build() {
    this.pluginState['HorizontalSlide'].singleSlideMovePercent =
        (this.config.options.slidesToScroll / this.config.options.slidesToShow) * -100

    let currentSlide
    if (this.config.options.isInfinite) {
        currentSlide = this.state.relativeCurrentSlide + this.state.slidePositionOffset
    } else {
        currentSlide = this.state.currentSlide
    }

    this.elements.track.style.transform = `translateX(${
        currentSlide * this.pluginState['HorizontalSlide'].singleSlideMovePercent
    }%)`
}

function infiniteLoop() {
    this.pluginState['HorizontalSlide'].looped = true
}

function slideChange() {
    if (this.pluginState['HorizontalSlide'].currentAnimation) {
        this.pluginState['HorizontalSlide'].currentAnimation.pause()
        this.pluginState['HorizontalSlide'].currentAnimation = null
    }

    let currentSlide
    if (this.config.options.isInfinite) {
        currentSlide = this.state.relativeCurrentSlide + this.state.slidePositionOffset
    } else {
        currentSlide = this.state.currentSlide
    }

    this.pluginState['HorizontalSlide'].currentAnimation = anime({
        targets: this.elements.track,
        duration: this.config.options.animationSpeed,
        easing: this.config.options.easing,
        translateX: [
            getCurrentTranslate.call(this),
            currentSlide * this.pluginState['HorizontalSlide'].singleSlideMovePercent + '%'
        ]
    })

    this.pluginState['HorizontalSlide'].currentAnimation.finished.then(() => {
        this.bus.triggers.transitionEnd.next(this)
    })
}

function getCurrentTranslate() {
    if (this.pluginState['HorizontalSlide'].looped) {
        this.pluginState['HorizontalSlide'].looped = false
        let currentSlide = this.state.relativePreviousSlide + this.state.slidePositionOffset
        return currentSlide * this.pluginState['HorizontalSlide'].singleSlideMovePercent
    }

    const currentTranslateMatch = this.elements.track.style.transform.match(/translateX\(+(.+)+\)/)
    return (currentTranslateMatch && currentTranslateMatch[1]) || 0
}
