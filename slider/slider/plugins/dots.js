import { fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'

export const Dots = {
    name: 'Dots',
    config: {
        options: {
            dots: false,
            referenceDotContainer: false,
            dotDataAttribs: true,
            dotFormat: (x) => x
        },
        classes: {
            dotList: 'c-slider__dots',
            dot: 'c-slider__dot',
            activeDot: 'active'
        }
    },
    state: {
        dotsObservable: null
    },
    build: {
        order: 0,
        fnc: build
    },
    setupEvents: {
        order: 0,
        fnc: setupEvents
    },
    teardownEvents,
    subscribeToEvents
}

function subscribeToEvents() {
    this.bus.events.slideChange.subscribe(slideChange.bind(this))
}

function build() {
    if (this.config.options.referenceDotContainer) {
        this.elements.dotList = this.elements.container.querySelector(
            '.' + this.config.classes.dotList
        )
    }

    if (!this.config.options.dots) {
        if (this.elements.dotList) {
            this.elements.dotList.hidden = true
        }
        return
    }

    if (this.elements.dotList) {
        this.elements.dotList.hidden = false
    } else {
        let dotList = document.createElement('div')
        dotList.classList.add(this.config.classes.dotList)
        this.elements.container.appendChild(dotList)

        this.elements.dotList = dotList
    }

    this.elements.dotList.innerHTML = ''
    let slideCount = this.state.slideCount
    const dots = []
    for (let i = 0; i < slideCount; i++) {
        const dotButton = document.createElement('button')
        dotButton.classList.add(this.config.classes.dot)
        dotButton.innerHTML = this.config.options.dotFormat(i + 1)
        dotButton.dataset.index = i
        dots.push(dotButton)
        this.elements.dotList.appendChild(dotButton)
    }

    this.elements.dots = dots
    updateDotState.call(this)
}

function setupEvents() {
    if (!this.config.options.dots) {
        return
    }

    this.pluginState['Dots'].dotsObservable = fromEvent(this.elements.dotList, 'click')
        .pipe(filter((evt) => evt.target.classList.contains(this.config.classes.dot)))
        .subscribe((evt) => {
            const index = evt.target.dataset.index
            this.bus.triggers.changeSlide.next(index)
        })
}

function teardownEvents() {
    if (this.pluginState['Dots'].dotsObservable) {
        this.pluginState['Dots'].dotsObservable.unsubscribe()
    }
}

function slideChange() {
    if (!this.config.options.dots) {
        return
    }

    updateDotState.call(this)
}

function updateDotState() {
    this.elements.dots.forEach((dot) => {
        if (dot.dataset.index == this.state.currentSlide) {
            if (this.config.options.dotDataAttribs) {
                dot.dataset[this.config.classes.activeDot] = true
            } else {
                dot.classList.add(this.config.classes.activeDot)
            }
        } else {
            if (this.config.options.dotDataAttribs) {
                dot.removeAttribute('data-' + this.config.classes.activeDot)
            } else {
                dot.classList.remove(this.config.classes.activeDot)
            }
        }
    })
}
