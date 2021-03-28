import { Slider } from './slider/slider'
// import anime from 'animejs'

function init() {
    console.log(
        Slider('.js-slider', {
            options: {
                slidesToShow: 1,
                horizontalSlide: true,
                referenceArrows: true,
                referenceDotContainer: true,
                arrows: true,
                responsive: {
                    '1024px': {
                        dots: true,
                        slidesToShow: 2,
                        isInfinite: true,
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
