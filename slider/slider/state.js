import { DefaultPlugins, defaultOptions, defaultClasses } from './defaults'

export const SliderObj = {
    config: null,
    state: null,
    elements: null,
    bus: null,
    plugins: null,
    pluginState: null
}

export const ConfigObj = {
    options: null,
    responsiveOptions: null,
    breakpoints: null,
    classes: null
}

/**
 * example responsive option
 *
 * responsiveOptions: {
 *     '1024px': {
 *          slidesToScroll: 2
 *     }
 * }
 */

export const StateObj = {
    isInitilised: false,
    currentSlide: 0, // Current Slide, does not relate to infinite slides
    relativeCurrentSlide: 0, // Current Slide for infinite slides
    previousSlide: 0, // Previous Slide, does not relate to infinite slides
    relativePreviousSlide: 0, // Previous Slide for infitie slides
    slideCount: 0,
    totalSlideCount: 0, // includes cloned slides
    currentBreakpoint: 0,
    maxSlidePosition: 0,
    minSlidePosition: 0,
    maxInfiniteSlidePosition: 0,
    minInfiniteSlidePosition: 0,
    slidePositionOffset: 0
}

export const ElementObj = {
    container: null,
    viewport: null,
    track: null,
    slides: null,
    allSlides: null // includes cloned slides
}

export const BusObj = {
    triggers: null,
    events: null
}

export const EventsObj = {
    slideChange: null,
    resize: null,
    disabled: null
}

export const TriggersObj = {
    incrementSlide: null,
    changeSlide: null,
    setup: null
}

export function setupConfig({ options = {}, classes = {}, plugins = [] }, doneCallback) {
    this.plugins = [...DefaultPlugins, ...plugins]

    let pluginOptions = {}
    let pluginClasses = {}
    this.plugins.forEach((plugin) => {
        if (plugin.config.options) {
            pluginOptions = { ...pluginOptions, ...plugin.config.options }
        }

        if (plugin.config.classes) {
            pluginClasses = { ...pluginClasses, ...plugin.config.classes }
        }
    })

    this.config.options = { ...defaultOptions, ...pluginOptions, ...options }
    this.config.classes = { ...defaultClasses, ...pluginClasses, ...classes }

    this.pluginState = this.plugins.reduce((acc, plugin) => {
        acc[plugin.name] = plugin.state
        return acc
    }, {})

    if (this.config.options.responsive) {
        setupResponsiveOptions.call(this, doneCallback) // calls setup
        this.bus.events.resize.subscribe(() => updateBreakpoints.call(this, doneCallback))
    } else {
        doneCallback.call(this)
    }
}

/**
 * creates the responsive options state and sets up the breakpoint list from largest to smallest
 */
function setupResponsiveOptions(doneCallback) {
    const copyResponsiveOptions = Object.assign({}, this.config.options.responsive)
    delete this.config.options.responsive

    const responsiveOptions = {
        0: this.config.options
    }

    const keys = Object.keys(copyResponsiveOptions)
    keys.push('0')

    const breakpoints = keys.sort((a, b) => {
        const aNum = +a.replace(/[^0-9]/g, '')
        const bNum = +b.replace(/[^0-9]/g, '')
        return bNum - aNum
    })

    breakpoints.forEach((breakpoint) => {
        responsiveOptions[breakpoint] = Object.assign(
            {},
            this.config.options,
            copyResponsiveOptions[breakpoint]
        )
    })

    this.config.breakpoints = breakpoints
    this.config.responsiveOptions = responsiveOptions
    updateBreakpoints.call(this, doneCallback)
}

/**
 * Goes through the breakpoint keys from largest to smallest
 * if the breakpoint has changes we change the config.options and call setup
 */
function updateBreakpoints(doneCallback) {
    if (!this.config.breakpoints) {
        return
    }

    for (let index = 0; index < this.config.breakpoints.length; index++) {
        if (!window.matchMedia(`(min-width: ${this.config.breakpoints[index]})`).matches) {
            continue
        }

        if (this.state.currentBreakpoint === this.config.breakpoints[index]) {
            break
        }

        this.state.currentBreakpoint = this.config.breakpoints[index]
        this.config.options = this.config.responsiveOptions[this.state.currentBreakpoint]
        doneCallback.call(this)
        break
    }
}
