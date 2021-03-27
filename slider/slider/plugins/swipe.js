import { fromEvent, merge } from 'rxjs'
import { mergeMap, map, takeUntil, debounceTime, filter } from 'rxjs/operators'

export default {
    id: 'swipe',
    config: {
        options: {
            swipe: true
        }
    },
    slideChangeEvents
}

function slideChangeEvents() {
    if (!this.config.options.swipe) {
        return
    }

    const down = merge(
        // fromEvent(this.state.elements.viewport, 'mousedown'),
        fromEvent(this.state.elements.viewport, 'touchstart')
    )

    const move = merge(
        // fromEvent(window, 'mousemove'),
        fromEvent(window, 'touchmove')
    )

    const up = merge(
        fromEvent(window, 'dragend'),
        // fromEvent(window, 'mouseup'),
        fromEvent(window, 'touchend'),
        fromEvent(window, 'touchcancel')
    )

    return down.pipe(
        mergeMap(downEvt => {
            const downX = getXCoord(downEvt)

            return move.pipe(
                map(moveEvt => {
                    const moveX = getXCoord(moveEvt)
                    const diff = moveX - downX
                    return diff < 0
                        ? this.config.options.slidesToScroll
                        : -this.config.options.slidesToScroll
                }),
                takeUntil(up)
            )
        }),
        filter(() => !this.config.options.disabled),
        debounceTime(50)
    )
}

function getXCoord(evt) {
    if (evt.touches && evt.touches.length) {
        return evt.touches[0].clientX
    }

    return evt.clientX
}
