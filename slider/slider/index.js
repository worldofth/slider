/*
 * TODO:
 *  - Core concept is everything is off by default, and it's up the the developer to correctly turn things on and off
 *     - will need to document what to turn on and off when and where
 *  - the concept of infinite is a core peice of functionality, not a plugin
 *      - as it changes the way we calculate state, we don't want to do that in a plugin
 *  [+] adjust to account for infinite
 *  [+] create horizontal slide animation - can look at infinite stuff, plan to use animejs
 *  [+] adjust to account for infinite in arrows
 *  [] make accessible - https://www.w3.org/WAI/tutorials/carousels/
 *  [+] Dots
 *  [] key navigation
 *  [] autoplay
 *      - autoplay on intersection
 *  [] pause events for autoplay
 *      - dots
 *      - arrows
 *      - track
 *  [] fade - only looks at current slide so can ignore infinite stuff, plan to use animejs
 *  [] swipe - plan to use animejs so can set the seek on drag for feedback, will work on slide and fade
 *  [] navFor
 *
 */

import {
    SliderObj,
    ConfigObj,
    StateObj,
    ElementObj,
    BusObj,
    EventsObj,
    TriggersObj,
    setupConfig
} from './state'
import { setupEvents } from './events'

export function Slider(selector, config = {}) {
    const Obj = Object.assign({}, SliderObj)

    Obj.config = Object.assign({}, ConfigObj)
    Obj.state = Object.assign({}, StateObj)
    Obj.elements = Object.assign({}, ElementObj)

    Obj.bus = Object.assign({}, BusObj)
    Obj.bus.triggers = Object.assign({}, TriggersObj)
    Obj.bus.events = Object.assign({}, EventsObj)

    Obj.plugins = []
    Obj.pluginState = {}
    Obj.animations = {}

    init.call(Obj, selector, config)
    return Obj
}

function init(selector, config = {}) {
    let el = selector
    if (typeof selector === 'string') {
        el = document.querySelector(selector)
    }

    if (!el) {
        console.warn('No slider container was found')
        return
    }

    this.elements.container = el
    setupEvents.call(this)
    this.bus.triggers.setup.subscribe(setupSlider.bind(this))

    setupConfig.call(this, config, () => {
        this.bus.triggers.setup.next(this)
    })
    pluginFunctions.call(this, 'subscribeToEvents')
}

function setupSlider() {
    setupDom.call(this)
    setupState.call(this)

    if (this.state.slideCount <= this.config.options.slidesToShow || this.config.options.disabled) {
        this.bus.events.disabled.next(this)
        return
    }

    pluginFunctions.call(this, 'teardownEvents')
    orderedPluginFunction.call(this, 'build')
    orderedPluginFunction.call(this, 'setupEvents')

    this.state.isInitilised = true
}

function setupState() {
    this.state.maxSlidePosition = this.state.slideCount - this.config.options.slidesToShow
    this.state.minSlidePosition = 0
    this.state.slidePositionOffset = 0

    this.state.currentSlide = Math.max(
        Math.min(this.state.currentSlide, this.state.maxSlidePosition),
        this.state.minSlidePosition
    )
    this.state.previousSlide = Math.max(
        Math.min(this.state.previousSlide, this.state.maxSlidePosition),
        this.state.minSlidePosition
    )
    this.state.relativeCurrentSlide = Math.max(
        Math.min(this.state.relativeCurrentSlide, this.state.maxInfiniteSlidePosition),
        this.state.minInfiniteSlidePosition
    )
    this.state.relativePreviousSlide = Math.max(
        Math.min(this.state.relativePreviousSlide, this.state.maxInfiniteSlidePosition),
        this.state.minInfiniteSlidePosition
    )

    if (this.config.options.isInfinite) {
        this.state.maxInfiniteSlidePosition =
            this.state.maxSlidePosition + this.config.options.slidesToShow
        this.state.minInfiniteSlidePosition = -this.config.options.slidesToShow
        this.state.slidePositionOffset = this.config.options.slidesToShow
        this.state.maxSlidePosition = this.state.slideCount
    } else {
        this.state.totalSlideCount = this.state.slideCount
        this.state.maxInfiniteSlidePosition = this.state.maxSlidePosition
        this.state.minInfiniteSlidePosition = this.state.minSlidePosition
    }

    if (this.config.options.slidesToScroll > this.config.options.slidesToShow) {
        this.config.options.slidesToScroll = this.config.options.slidesToShow
    }

    this.state.scrollVsShowDiff =
        this.config.options.slidesToShow - this.config.options.slidesToScroll
}

function setupDom() {
    this.elements.viewport = this.elements.container.querySelector(
        '.' + this.config.classes.viewport
    )

    this.elements.track = this.elements.container.querySelector('.' + this.config.classes.track)

    this.elements.slides = Array.from(this.elements.track.children)
    this.elements.slides.forEach((slide) => {
        if (!slide.classList.contains(this.config.classes.slide)) {
            slide.classList.add(this.config.classes.slide)
        }
    })
    this.elements.allSlides = this.elements.slides
    this.state.slideCount = this.elements.slides.length

    setupInfiniteSlides.call(this)
}

function pluginFunctions(name) {
    this.plugins
        .filter((plugin) => !!plugin[name])
        .forEach((plugin) => {
            plugin[name].call(this)
        })
}

function orderedPluginFunction(name) {
    this.plugins
        .filter((plugin) => !!plugin[name])
        .sort((pluginA, pluginB) => {
            const a = pluginA[name].order || 0
            const b = pluginB[name].order || 0
            return a - b
        })
        .forEach((plugin) => {
            plugin[name].fnc.call(this)
        })
}

function setupInfiniteSlides() {
    if (!this.config.options.isInfinite) {
        if (hasInfiniteSlides.call(this)) {
            if (!this.state.cloneSlideStore) {
                this.state.cloneSlideStore = {
                    start: document.createElement('div'),
                    end: document.createElement('div')
                }
            }

            let cloneCount =
                this.elements.allSlides.filter((slide) =>
                    slide.classList.contains(this.config.classes.slideClone)
                ).length / 2

            const startClones = this.elements.allSlides.slice(0, cloneCount)
            const endClones = this.elements.allSlides.slice(-cloneCount)

            this.state.cloneSlideStore.start.innerHTML = ''
            this.state.cloneSlideStore.end.innerHTML = ''

            startClones.forEach((clone) => {
                this.state.cloneSlideStore.start.appendChild(clone)
            })
            endClones.forEach((clone) => {
                this.state.cloneSlideStore.end.appendChild(clone)
            })

            this.elements.slides = Array.from(this.elements.track.children)
            this.state.slideCount = this.elements.slides.length
        }
        return
    }

    if (this.state.cloneSlideStore?.start.children.length) {
        const startClones = Array.from(this.state.cloneSlideStore.start.children).reverse()
        const endClones = Array.from(this.state.cloneSlideStore.end.children)

        let insertBefore = this.elements.slides[0]
        startClones.forEach((clone) => {
            insertBefore = this.elements.track.insertBefore(clone, insertBefore)
        })

        endClones.forEach((clone) => {
            this.elements.track.appendChild(clone)
        })

        this.elements.allSlides = Array.from(this.elements.track.children)
        this.state.totalSlideCount = this.elements.allSlides.length
        return
    }

    if (this.state.slideCount < this.config.slidesToShow) {
        return
    }

    const endSlides = this.elements.slides.slice(0, this.config.options.slidesToShow)
    const startSlides = this.elements.slides.slice(-this.config.options.slidesToShow).reverse()

    let insertBefore = this.elements.slides[0]
    startSlides.forEach((slide) => {
        const clone = cloneSlide.call(this, slide)
        insertBefore = this.elements.track.insertBefore(clone, insertBefore)
    })

    endSlides.forEach((slide) => {
        const clone = cloneSlide.call(this, slide)
        this.elements.track.appendChild(clone)
    })

    this.elements.allSlides = Array.from(this.elements.track.children)
    this.state.totalSlideCount = this.elements.allSlides.length
}

function cloneSlide(slide) {
    const slideClone = slide.cloneNode(true)
    slideClone.classList.add(this.config.classes.slideClone)
    return slideClone
}

function hasInfiniteSlides() {
    return this.elements.allSlides[0].classList.contains(this.config.classes.slideClone)
}
