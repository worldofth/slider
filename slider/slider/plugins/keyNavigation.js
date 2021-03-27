import { fromEvent } from 'rxjs'
import { filter, map } from 'rxjs/operators'

export default {
    id: 'keyNavigation',
    config: {
        options: {
            keyNavigation: true
        }
    },
    slideChangeEvents
}

function slideChangeEvents() {
    if (!this.config.options.keyNavigation) {
        return
    }

    const keyCodes = ['ArrowLeft', 'ArrowRight']

    return fromEvent(document, 'keyup').pipe(
        filter(evt => ~keyCodes.indexOf(evt.code)),
        filter(() => !this.config.options.disabled),
        map(evt =>
            evt.code === 'ArrowLeft'
                ? -this.config.options.slidesToScroll
                : this.config.options.slidesToScroll
        )
    )
}
