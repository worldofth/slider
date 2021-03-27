export default {
    id: 'infiniteSlide',
    config: {
        options: {
            infiniteSlide: false
        },
        classes: {
            slideClone: 'o-carousel__slide-clone'
        }
    },
    pluginState: {
        appliedReducedAnimation: false,
        preUpdateWithReduced: false
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.prebuild.subscribe(prebuild.bind(this))
    this.bus.build.subscribe(build.bind(this))
    this.bus.postSetup.subscribe(postSetup.bind(this))
    this.bus.transitionEnd.subscribe(transitionEnd.bind(this))
    this.bus.preUpdate.subscribe(preUpdate.bind(this))
}

function prebuild() {
    if (this.config.options.fade) {
        this.config.options.infiniteSlide = false
    }
}

function postSetup() {
    if (
        !this.config.options.infiniteSlide &&
        !this.config.options.fade &&
        !this.config.options.infiniteActiveClasses
    ) {
        this.state.maxSlidePosition = this.state.slideCount - this.config.options.slidesToShow
        this.state.minSlidePosition = 0
        this.state.slidePositionOffset = 0
        return
    }

    if (this.config.options.infiniteSlide) {
        this.state.maxSlidePosition = this.state.slideCount
        this.state.minSlidePosition = -this.config.options.slidesToShow
        this.state.slidePositionOffset = this.config.options.slidesToShow
    }
}

function build() {
    if (!this.config.options.infiniteSlide) {
        removeClonedSlides.call(this)
        return
    }

    if (this.state.totalSlideCount > this.state.slideCount) {
        return
    }

    let slides = [...this.state.elements.slides]

    for (let i = 0; i < this.config.options.slidesToShow; i++) {
        const slideClone = this.state.elements.slides[i].cloneNode(true)
        slideClone.classList.add(this.config.classes.slideClone)
        this.state.elements.track.appendChild(slideClone)
        slides.push(slideClone)
    }

    let start = this.state.elements.slides.length - 1
    let end = this.state.elements.slides.length - this.config.options.slidesToShow
    let before = this.state.elements.slides[0]

    for (let i = start; i >= end; i--) {
        const slideClone = this.state.elements.slides[i].cloneNode(true)
        slideClone.classList.add(this.config.classes.slideClone)
        this.state.elements.track.insertBefore(slideClone, before)
        before = slideClone
        slides.unshift(slideClone)
    }

    this.state.elements.slides = slides
    this.state.totalSlideCount = this.state.elements.slides.length
}

function removeClonedSlides() {
    this.state.elements.slides
        .filter(el => el.classList.contains(this.config.classes.slideClone))
        .forEach(slide => {
            slide.remove()
        })

    this.state.elements.slides = this.state.elements.slides.filter(
        el => !el.classList.contains(this.config.classes.slideClone)
    )
    this.state.totalSlideCount = this.state.slideCount
}

function preUpdate() {
    if (
        !this.pluginState.infiniteSlide.preUpdateWithReduced &&
        this.pluginState.infiniteSlide.appliedReducedAnimation
    ) {
        this.pluginState.infiniteSlide.preUpdateWithReduced = true
        return
    }

    // replay animation after being reduced
    if (this.pluginState.infiniteSlide.appliedReducedAnimation) {
        this.pluginState.infiniteSlide.appliedReducedAnimation = false
        this.bus.applyAnimation.next()
        this.pluginState.infiniteSlide.preUpdateWithReduced = false
    }
}

function transitionEnd() {
    if (!this.config.options.infiniteSlide) {
        return
    }

    if (
        this.state.currentSlide > this.state.minSlidePosition &&
        this.state.currentSlide < this.state.maxSlidePosition
    ) {
        return
    }

    // reduce animation
    this.pluginState.infiniteSlide.appliedReducedAnimation = true
    this.bus.reduceAnimation.next()

    // change slide position
    let offsetChange = 0
    if (this.state.currentSlide === this.state.minSlidePosition) {
        offsetChange = this.state.slideCount
    } else if (this.state.currentSlide === this.state.maxSlidePosition) {
        offsetChange = -this.state.slideCount
    }
    this.events.changeSlide.next(offsetChange)
}
