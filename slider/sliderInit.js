import { CaseStudySliders } from '../case-study/case-study'

let Slider

export const commonSliderClasses = {
    slider: 'c-slider',
    viewport: 'c-slider__viewport',
    track: 'c-slider__track',
    slide: 'c-slider__slide',
    slideClone: 'c-slider__slide--clone',
    nextArrow: 'c-slider__arrow--next',
    prevArrow: 'c-slider__arrow--prev',
    dotList: 'c-slider__dots',
    dot: 'c-slider__dot'
}

export function SliderInit() {
    const genericSliderEls = document.querySelectorAll('.js-slider')
    const caseStudyEls = document.querySelectorAll('.js-case-study-sliders')

    if (genericSliderEls.length || caseStudyEls.length) {
        const init = () => {
            genericSlider(Slider, genericSliderEls)
            CaseStudySliders(Slider, caseStudyEls, commonSliderClasses)
        }

        if (Slider) {
            init()
        } else {
            import('./slider/index')
                .then((m) => m.Slider)
                .then((fnc) => {
                    Slider = fnc
                    init()
                })
        }
    }
}

function genericSlider(Slider, els) {
    if (!els || !els.length) {
        return
    }
    const sliders = Array.from(els)
    sliders.forEach((el) => {
        let { dots, slidesToShow, slidesToScroll, autoplay } = el.dataset
        dots = dots !== 'false'
        autoplay = autoplay === 'true'
        slidesToShow = +slidesToShow || 1
        slidesToScroll = +slidesToScroll || 1
        let responsive = {}
        if (slidesToShow === 4) {
            slidesToShow = 2
            slidesToScroll = 2

            responsive = {
                '1024px': {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            }
        }

        Slider(el, {
            options: {
                slidesToShow,
                slidesToScroll,
                arrows: false,
                referenceArrows: true,
                autoplay,
                dots,
                referenceDotContainer: true,
                infiniteSlide: true,
                horizontalSlide: true,
                pauseOnHover: true,
                dotFormat: () => '<span></span>',
                responsive
            },
            classes: commonSliderClasses
        })
    })
}
