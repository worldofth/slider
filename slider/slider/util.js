export function createElement(html) {
    if (typeof html === 'string') {
        const div = document.createElement('div')
        div.innerHTML = html
        return div.firstElementChild
    }

    return html
}

export function getCurrentSlide() {
    return this.state.elements.slides[this.state.currentSlide]
}

export function getPreviousSlide() {
    return this.state.elements.slides[this.state.previousSlide]
}

export function busTrack(eventName) {
    if (!this.bus[eventName]) {
        console.warn(`No Event found using the name: ${eventName}`)
        return
    }

    return this.bus[eventName]
}
