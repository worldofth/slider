import { setupState } from './state'
import { setupBus, setupEvents, setupEarlyEvents } from './events'
import {
    Arrows,
    HorizontalSlide,
    Dots,
    KeyNavigation,
    InfiniteSlides,
    NavFor,
    AutoPlay,
    PauseOnHover,
    PauseOnArrows,
    PauseOnDots,
    Fade,
    ActiveClasses,
    TimerTracker,
    Swipe,
    BackgroundColor,
    ButtonLink
} from './plugins'
import { getCurrentSlide, getPreviousSlide, busTrack } from './util'

const SliderObj = {
    config: {
        options: {},
        responsiveOptions: {},
        breakpoints: [],
        classes: {}
    },
    state: {},
    bus: {},
    events: {},
    plugins: [
        Arrows,
        Dots,
        KeyNavigation,
        HorizontalSlide,
        InfiniteSlides,
        NavFor,
        AutoPlay,
        PauseOnHover,
        PauseOnArrows,
        PauseOnDots,
        Fade,
        ActiveClasses,
        TimerTracker,
        Swipe,
        BackgroundColor,
        ButtonLink
    ],
    pluginState: {},
    busTrack,
    getCurrentSlide,
    getPreviousSlide
}

const SliderState = {
    elements: null,
    initialised: false,
    previousSlide: 0,
    currentSlide: 0,
    slideCount: 0,
    totalSlideCount: 0, // includes cloned slides
    currentBreakpoint: 0,
    maxSlidePosition: 0,
    minSlidePosition: 0,
    slidePositionOffset: 0
}

window.sliders = []

export function Slider(selector, config = {}) {
    const Obj = Object.create(SliderObj)
    Obj.state = Object.create(SliderState)
    init.call(Obj, selector, config)
    window.sliders.push(Obj)
    return Obj
}

function init(selector, config) {
    let el = selector
    if (typeof selector === 'string') {
        el = document.querySelector(selector)
    }

    if (!el) {
        return
    }

    if (!el.childElementCount) {
        return
    }

    this.state.elements = {}
    this.state.selector = el.className
    this.state.elements.sliderEl = el

    setupBus.call(this)
    setupEarlyEvents.call(this)

    this.plugins
        .filter((plugin) => plugin.busSubscribe)
        .forEach((plugin) => {
            this.bus.busSubscribe.subscribe(plugin.busSubscribe.bind(this))
        })

    this.bus.busSubscribe.subscribe(subscribeToBus.bind(this))
    this.bus.busSubscribe.next(this)

    setupState.call(this, config)
}

function subscribeToBus() {
    this.bus.setup.subscribe(setupSlider.bind(this))
    this.bus.slideChange.subscribe((position) => {
        this.state.previousSlide = this.state.currentSlide
        this.state.currentSlide = position
        this.bus.preUpdate.next(this)
        this.bus.update.next(this)
        this.bus.postUpdate.next(this)
    })
}

function setupSlider() {
    if (this.state.slideCount <= this.config.options.slidesToShow || this.config.options.disabled) {
        this.bus.disabled.next(this)
        return
    }

    this.state.maxSlidePosition = this.state.slideCount - 1
    this.state.minSlidePosition = 0
    this.state.slidePositionOffset = 0
    this.state.totalSlideCount = this.state.slideCount

    if (this.config.options.slidesToScroll > this.config.options.slidesToShow) {
        this.config.options.slidesToScroll = this.config.options.slidesToShow
    }

    this.bus.prebuild.next(this)
    this.bus.build.next(this)

    if (!this.state.initialised) {
        setupEvents.call(this)
    }

    this.bus.eventsUnSub.next(this)
    this.bus.eventsSub.next(this)

    this.bus.postSetup.next(this)
    this.bus.preUpdate.next(this)
    this.bus.update.next(this)
    this.bus.postUpdate.next(this)

    requestAnimationFrame(() => {
        this.bus.applyAnimation.next(this)
    })

    this.state.initialised = true
}
