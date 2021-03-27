import { Slider } from './slider/slider'

function init() {
    console.log(
        Slider('.js-slider', {
            options: {
                arrows: true,
                // buildArrows: true,
                referenceArrows: true,
                responsive: {
                    '1024px': {
                        testing: 'hello world'
                    }
                }
            }
        })
    )
}

if (document.readyState === 'complete') {
    init()
} else {
    window.addEventListener('DOMContentLoaded', init)
}
