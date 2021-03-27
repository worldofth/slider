export default {
    id: 'navFor',
    config: {
        options: {
            navFor: null
        }
    },
    pluginState: {
        navForFirstCall: true
    },
    busSubscribe
}

function busSubscribe() {
    this.bus.postUpdate.subscribe(update.bind(this))
}

function update() {
    if (!this.config.options.navFor || !this.state.initialised) {
        return
    }

    if (this.pluginState.navFor.navForFirstCall) {
        this.pluginState.navFor.navForFirstCall = false
        return
    }

    if (typeof this.config.options.navFor === 'function') {
        this.config.options.navFor = this.config.options.navFor()
    }

    let navFor = this.config.options.navFor

    if (Array.isArray(navFor)) {
        navFor.forEach(updateNavFor.bind(this))
    } else {
        updateNavFor.call(this, navFor)
    }
}

function updateNavFor(navFor) {
    if (!navFor) {
        return
    }

    if (
        navFor.config.options.infiniteSlide &&
        this.pluginState.infiniteSlide &&
        this.pluginState.infiniteSlide.appliedReducedAnimation &&
        navFor.pluginState.infiniteSlide.appliedReducedAnimation
    ) {
        return
    }

    let change = this.state.currentSlide - navFor.state.currentSlide
    if (change) {
        navFor.events.changeSlide.next(change)
    }
}
