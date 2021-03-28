import { Slider } from './slider/slider'
// import anime from 'animejs'

function init() {
    console.log(
        Slider('.js-slider', {
            options: {
                slidesToShow: 1,
                isInfinite: true,
                horizontalSlide: true,
                arrows: true,
                referenceArrows: true,
                responsive: {
                    '1024px': {
                        slidesToShow: 2,
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
