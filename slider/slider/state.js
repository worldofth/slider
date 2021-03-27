import Defaults from './defaults'

export function setupState(userConfig) {
    let initialConfig = {
        options: [{}, Defaults.options],
        classes: [{}, Defaults.classes]
    }

    this.config = getPluginSettings.call(this, 'config', userConfig, initialConfig)

    this.pluginState = this.plugins
        .filter(plugin => plugin.pluginState)
        .reduce((acc, plugin) => {
            acc[plugin.id] = Object.assign({}, plugin.pluginState)
            return acc
        }, {})

    this.events.resize.subscribe(checkBreakpoint.bind(this))

    setupResponsiveOptions.call(this)
    setupIntialDom.call(this)
    checkBreakpoint.call(this)
}

function getPluginSettings(key, userSettings, initialSettings) {
    let settings = this.plugins.filter(plugin => plugin[key]).map(plugin => plugin[key])

    if (userSettings) {
        settings.push(userSettings)
    }

    settings = settings.reduce((acc, setting) => {
        const keys = Object.keys(setting)
        keys.forEach(key => {
            if (!acc[key]) {
                acc[key] = [{}]
            }

            acc[key].push(setting[key])
        })

        return acc
    }, initialSettings)

    const settingKeys = Object.keys(settings)
    return settingKeys.reduce((acc, key) => {
        acc[key] = Object.assign.apply(null, settings[key])
        return acc
    }, {})
}

function setupResponsiveOptions() {
    const intialOptions = {
        0: Object.assign({}, this.config.options)
    }

    if (this.config.options.responsive) {
        delete intialOptions[0].responsive

        const responsiveKeys = Object.keys(this.config.options.responsive)
        this.config.responsiveOptions = responsiveKeys.reduce((acc, key) => {
            let parsedKey = key.replace(/[^0-9]/g, '')
            parsedKey = +parsedKey

            if (acc[parsedKey]) {
                return acc
            }

            acc[parsedKey] = Object.assign({}, acc[0], this.config.options.responsive[key])
            return acc
        }, intialOptions)
    } else {
        this.config.responsiveOptions = intialOptions
    }

    this.config.breakpoints = Object.keys(this.config.responsiveOptions)
    this.config.breakpoints.sort((a, b) => a - b)
    this.config.options = this.config.responsiveOptions[0]
}

function checkBreakpoint() {
    let checkBreakpoint = this.config.breakpoints.reduce(
        (acc, breakpoint) => (window.innerWidth >= +breakpoint ? breakpoint : acc),
        0
    )

    if (checkBreakpoint === this.state.currentBreakpoint) {
        return
    }

    this.state.currentBreakpoint = checkBreakpoint
    this.config.options = this.config.responsiveOptions[checkBreakpoint]
    this.bus.setup.next(this)
    this.bus.slideChange.next(0)
}

function setupIntialDom() {
    this.state.elements.viewport = this.state.elements.sliderEl.querySelector(
        '.' + this.config.classes.viewport
    )
    this.state.elements.track = this.state.elements.sliderEl.querySelector(
        '.' + this.config.classes.track
    )
    this.state.elements.slides = this.state.elements.track.children
    this.state.elements.slides = Array.prototype.slice.call(this.state.elements.slides)

    this.state.elements.slides.forEach(slide => {
        if (slide.classList.contains(this.config.classes.slide)) {
            return
        }

        slide.classList.add(this.config.classes.slide)
    })

    this.state.slideCount = this.state.elements.slides.length
}
