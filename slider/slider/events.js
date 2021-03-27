import { Subject, fromEvent, merge } from 'rxjs'
import { debounceTime, map, scan } from 'rxjs/operators'

export function setupBus() {
    this.bus = {
        busSubscribe: new Subject(),
        setup: new Subject(),
        prebuild: new Subject(),
        build: new Subject(),
        eventsUnSub: new Subject(),
        eventsSub: new Subject(),
        postSetup: new Subject(),
        preUpdate: new Subject(),
        update: new Subject(),
        postUpdate: new Subject(),
        applyAnimation: new Subject(),
        reduceAnimation: new Subject(),
        removeAnimation: new Subject(),
        slideChange: new Subject(),
        transitionEnd: new Subject(),
        disabled: new Subject()
    }
}

export function setupEarlyEvents() {
    this.events = {
        resize: fromEvent(window, 'resize').pipe(debounceTime(200)),
        changeSlide: new Subject().pipe(map((change) => change || 1))
    }
}

export function setupEvents() {
    this.events.mouseOver = fromEvent(this.state.elements.viewport, 'mouseover')
    this.events.mouseOut = fromEvent(this.state.elements.viewport, 'mouseout')

    this.events = this.plugins
        .filter((plugin) => plugin.events)
        .map((plugin) => plugin.events.call(this))
        .reduce((acc, events) => {
            const keys = Object.keys(events)
            if (!keys.length) {
                return acc
            }

            keys.forEach((key) => {
                if (acc[key]) {
                    return
                }

                acc[key] = events[key]
            })

            return acc
        }, this.events)

    setupSlideChange.call(this)
    setupTransitionEnd.call(this)
}

function setupSlideChange() {
    const baseObservables = {
        click: fromEvent(this.state.elements.sliderEl, 'click')
    }

    let changeEvents = reducePluginEvents.call(this, 'slideChangeEvents', baseObservables)

    changeEvents.push(this.events.changeSlide)

    merge
        .apply(null, changeEvents)
        .pipe(
            scan((acc, next) => {
                if (acc !== this.state.currentSlide) {
                    acc = this.state.currentSlide
                }

                return Math.max(
                    Math.min(acc + next, this.state.maxSlidePosition),
                    this.state.minSlidePosition
                )
            }, 0)
        )
        .subscribe((change) => {
            this.bus.slideChange.next(change)
        })
}

function setupTransitionEnd() {
    const transitionEvents = reducePluginEvents.call(this, 'transitionEndEvent')
    if (!transitionEvents.length) {
        return
    }

    merge.apply(null, transitionEvents).subscribe(() => {
        this.bus.transitionEnd.next()
    })
}

function reducePluginEvents(fncName, ...params) {
    return this.plugins
        .filter((plugin) => plugin[fncName])
        .map((plugin) => plugin[fncName].apply(this, params))
        .filter((evt) => !!evt)
}
