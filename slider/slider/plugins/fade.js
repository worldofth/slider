export default {
    id: 'fade',
    config: {
        options: {
            fade: false,
            infiniteFade: false,
            ease: 'cubic-bezier(0.3, 0.15, 0.18, 1)',
            speed: 750
        }
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.postSetup.subscribe(postSetup.bind(this))
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

    if (this.config.options.infiniteFade && this.config.options.fade) {
        this.state.maxSlidePosition = this.state.slideCount
        this.state.minSlidePosition = -1
    }
}

function update() {
    if (!this.config.options.fade) {
        return
    }

    if (this.state.currentSlide === this.state.maxSlidePosition) {
        this.state.currentSlide = 0
    }

    if (this.state.currentSlide === this.state.minSlidePosition) {
        this.state.currentSlide = this.state.maxSlidePosition - 1
    }

    const positionDifference = this.state.currentSlide - this.state.previousSlide
    let slideTransform = 100 * positionDifference

    const previousSlide = this.getPreviousSlide()
    const currentSlide = this.getCurrentSlide()

    previousSlide.style.transition = `opacity ${this.config.options.speed}ms ${this.config.options.ease}`
    previousSlide.style.transform = `translate(${slideTransform}%)`
    previousSlide.style.opacity = 0
    previousSlide.style['z-index'] = 2

    currentSlide.style.transition = ''
    currentSlide.style.transform = ''
    currentSlide.style.opacity = 1
    currentSlide.style['z-index'] = 1

    let transform =
        (100 * (this.state.currentSlide + this.state.slidePositionOffset)) /
        this.config.options.slidesToShow
    this.state.elements.track.style.transform = `translateX(-${transform}%)`
}

function transitionEnd() {
    if (!this.config.options.fade) {
        return
    }

    const previousSlide = this.getPreviousSlide()
    const currentSlide = this.getCurrentSlide()

    previousSlide.style.transition = ''
    previousSlide.style.transform = ''
    previousSlide.style.opacity = ''
    previousSlide.style['z-index'] = 0

    currentSlide.style.opacity = ''
    currentSlide.style['z-index'] = 1
}

function applyAnimation() {
    if (!this.config.options.fade) {
        return
    }

    removeAnimation.call(this)
}

function reduceAnimation() {
    if (!this.config.options.fade) {
        return
    }

    removeAnimation.call(this)
}

function removeAnimation() {
    if (!this.config.options.fade) {
        return
    }

    this.state.elements.track.style.transition = ''
}
