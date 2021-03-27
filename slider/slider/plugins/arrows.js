import { merge } from 'rxjs'
import { map, filter } from 'rxjs/operators'

import { createElement } from '../util'

export default {
    id: 'arrows',
    config: {
        options: {
            arrows: true,
            referenceArrows: false
        },
        classes: {
            nextArrow: 'o-carousel__arrow--next',
            prevArrow: 'o-carousel__arrow--prev'
        },
        arrows: {
            prev: '<button class="o-carousel__arrow o-carousel__arrow--prev">prev</button>',
            next: '<button class="o-carousel__arrow o-carousel__arrow--next">next</button>'
        }
    },
    busSubscribe,
    slideChangeEvents
}

function busSubscribe() {
    this.bus.build.subscribe(build.bind(this))
    this.bus.update.subscribe(update.bind(this))
    this.bus.disabled.subscribe(disabled.bind(this))
}

function build() {
    if (!this.config.options.arrows) {
        removeArrows.call(this)
        return
    }

    if (this.state.elements.nextArrow) {
        return
    }

    if (this.config.options.referenceArrows) {
        this.state.elements.nextArrow = this.state.elements.sliderEl.querySelector(
            '.' + this.config.classes.nextArrow
        )

        this.state.elements.prevArrow = this.state.elements.sliderEl.querySelector(
            '.' + this.config.classes.prevArrow
        )

        return
    }

    this.config.arrows.prev = createElement(this.config.arrows.prev)
    this.config.arrows.next = createElement(this.config.arrows.next)

    this.state.elements.nextArrow = this.config.arrows.next.cloneNode(true)
    this.state.elements.prevArrow = this.config.arrows.prev.cloneNode(true)

    this.state.elements.sliderEl.insertBefore(
        this.state.elements.prevArrow,
        this.state.elements.viewport
    )
    this.state.elements.sliderEl.appendChild(this.state.elements.nextArrow)
}

function removeArrows() {
    if (this.config.options.referenceArrows) {
        return
    }

    this.state.elements.nextArrow && this.state.elements.nextArrow.remove()
    this.state.elements.nextArrow = null
    this.state.elements.prevArrow && this.state.elements.prevArrow.remove()
    this.state.elements.prevArrow = null
}

function update() {
    if (
        !this.config.options.arrows ||
        this.config.options.infiniteSlide ||
        this.config.options.infiniteFade ||
        this.config.options.infiniteActiveClasses
    ) {
        return
    }

    if (this.state.elements.prevArrow) {
        this.state.elements.prevArrow.disabled =
            this.state.currentSlide === this.state.minSlidePosition
        this.state.elements.prevArrow.hidden = this.config.options.disabled
    }

    if (this.state.elements.nextArrow) {
        this.state.elements.nextArrow.disabled =
            this.state.currentSlide === this.state.maxSlidePosition
        this.state.elements.nextArrow.hidden = this.config.options.disabled
    }
}

function slideChangeEvents(baseObservables) {
    return merge(
        baseObservables.click.pipe(
            filter(evt => evt.target.classList.contains(this.config.classes.nextArrow)),
            filter(() => !this.config.options.disabled),
            map(() => this.config.options.slidesToScroll)
        ),
        baseObservables.click.pipe(
            filter(evt => evt.target.classList.contains(this.config.classes.prevArrow)),
            filter(() => !this.config.options.disabled),
            map(() => -this.config.options.slidesToScroll)
        )
    )
}

function disabled() {
    if (this.config.options.referenceArrows) {
        this.state.elements.nextArrow = this.state.elements.sliderEl.querySelector(
            '.' + this.config.classes.nextArrow
        )
        if (this.state.elements.nextArrow) {
            this.state.elements.nextArrow.hidden = true
        }

        this.state.elements.prevArrow = this.state.elements.sliderEl.querySelector(
            '.' + this.config.classes.prevArrow
        )
        if (this.state.elements.prevArrow) {
            this.state.elements.prevArrow.hidden = true
        }
    }
}
