import { filter, map } from 'rxjs/operators'

export default {
    id: 'dots',
    config: {
        options: {
            dots: true,
            referenceDotContainer: true,
            dotFormat: (x) => x
        },
        classes: {
            dotList: 'o-carousel__dots',
            dot: 'o-carousel__dot',
            activeDot: 'is-active'
        }
    },
    slideChangeEvents,
    busSubscribe
}

function busSubscribe() {
    this.bus.build.subscribe(build.bind(this))
    this.bus.postUpdate.subscribe(update.bind(this))
}

function build() {
    if (!this.config.options.dots) {
        removeDots.call(this)
        return
    }

    if (this.state.elements.dotNav) {
        return
    }

    if (this.config.options.referenceDotContainer) {
        this.state.elements.dotNav = this.state.elements.sliderEl.querySelector(
            '.' + this.config.classes.dotList
        )
    } else {
        const dotNav = document.createElement('div')
        dotNav.classList.add(this.config.classes.dotList)
        this.state.elements.sliderEl.appendChild(dotNav)

        this.state.elements.dotNav = dotNav
    }

    let slideCount = this.state.slideCount
    const dots = []
    for (let i = 0; i < slideCount; i++) {
        const dotButton = document.createElement('div')
        dotButton.classList.add(this.config.classes.dot)
        dotButton.setAttribute('aria-hidden', 'true')
        dotButton.setAttribute('focusable', 'false')
        dotButton.innerHTML = this.config.options.dotFormat(i + 1)
        dotButton.dataset.index = i
        dots.push(dotButton)
        this.state.elements.dotNav.appendChild(dotButton)
    }

    this.state.elements.dots = dots
}

function removeDots() {
    this.state.elements.dotNav && this.state.elements.dotNav.remove()
    this.state.elements.dotNav = null
    this.state.elements.dots = []
}

function update() {
    if (
        !this.config.options.dots ||
        !this.state.elements.dots ||
        !this.state.elements.dots.length
    ) {
        return
    }

    this.state.elements.dots.forEach((el, index) => {
        if (index === this.state.currentSlide) {
            el.classList.add(this.config.classes.activeDot)
        } else {
            el.classList.remove(this.config.classes.activeDot)
        }
    })
}
function slideChangeEvents(baseObservables) {
    if (!this.config.options.dots) {
        return
    }

    return baseObservables.click.pipe(
        filter((evt) => evt.target.classList.contains(this.config.classes.dot)),
        filter(() => !this.config.options.disabled),
        map((evt) => evt.target.dataset.index - this.state.currentSlide)
    )
}
