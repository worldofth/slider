export default {
    id: 'backgroundColor',
    config: {
        options: {
            backgroundColorSwapping: true
        }
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.update.subscribe(update.bind(this))
}

function update() {
    if (!this.config.options.backgroundColorSwapping) {
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
    let currentColor = currentSlide.dataset.background

    if (currentColor) {
        this.state.elements.sliderEl.style.setProperty(
            '--background-color',
            'var(' + currentColor + ')'
        )
    }
}
