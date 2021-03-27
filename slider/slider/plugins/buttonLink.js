export default {
    id: 'buttonLink',
    config: {
        options: {
            buttonLinkSwapping: false,
            buttonLinkClass: 'js-slider-btn-link'
        }
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.build.subscribe(build.bind(this))
    this.bus.update.subscribe(update.bind(this))
}

function build() {
    if (!this.config.options.buttonLinkSwapping) {
        return
    }

    this.state.elements.buttonSwap = this.state.elements.sliderEl.querySelector(
        this.config.options.buttonLinkClass
    )
}

function update() {
    if (!this.config.options.buttonLinkSwapping) {
        return
    }

    if (this.state.currentSlide === this.state.maxSlidePosition) {
        this.state.currentSlide = 0
    }

    if (this.state.currentSlide === this.state.minSlidePosition) {
        this.state.currentSlide = this.state.maxSlidePosition - 1
    }

    let currentPos = this.state.currentSlide + this.state.slidePositionOffset

    let currentSlide = this.state.elements.slides[currentPos]
    let currentLink = currentSlide.dataset.url

    if (currentLink) {
        this.state.elements.buttonSwap.href = currentLink
    }
}
