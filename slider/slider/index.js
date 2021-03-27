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

    this.bus.events.slideChange.subscribe(() => {
        console.log('slide change: ', this.state.currentSlide)
    })

    setupConfig.call(this, config, () => {
        this.bus.triggers.setup.next(this)
    })
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

// TODO: just copied and not thought about
function setupState() {
    this.state.maxSlidePosition = this.state.slideCount - 1
    this.state.minSlidePosition = 0
    this.state.slidePositionOffset = 0

    // default infinite slide state
    this.state.totalSlideCount = this.state.slideCount
    this.state.maxInfiniteSlidePosition = this.state.maxSlidePosition
    this.state.minInfiniteSlidePosition = this.state.minSlidePosition

    if (this.config.options.slidesToScroll > this.config.options.slidesToShow) {
        this.config.options.slidesToScroll = this.config.options.slidesToShow
    }
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

    this.state.slideCount = this.elements.slides.length
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
