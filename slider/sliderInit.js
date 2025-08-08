export function SliderInit() {
    const genericSliderEls = document.querySelectorAll('.js-slider')

    if (genericSliderEls.length) {
        import('./slider/index')
            .then((m) => m.Slider)
            .then((Slider) => {
                genericSlider(Slider, genericSliderEls)
            })
    }
}

function genericSlider(Slider, els) {
    if (!els || !els.length) {
        return
    }
    const sliders = Array.from(els)
    window.sliders = sliders.map((el) => {
        let { dots, slidesToShow, slidesToScroll, autoplay, arrows, isInfinite, mobileDisable } = el.dataset
        dots = dots === 'true'
        autoplay = autoplay === 'true'
        arrows = arrows === 'true'
        mobileDisable = mobileDisable === 'true'
        isInfinite = isInfinite !== 'false'
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

        if (slidesToShow === 3) {
            slidesToShow = 1
            slidesToScroll = 1

            responsive = {
                '768px': {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }
        }

        if (mobileDisable) {
            if (!responsive['768px']) {
                responsive['768px'] = {}
            }

            responsive['768px'].disabled = false
        }

        return Slider(el, {
            options: {
                slidesToShow,
                slidesToScroll,
                horizontalSlide: true,
                arrows,
                autoplay,
                referenceArrows: true,
                isInfinite,
                dots,
                referenceDotContainer: true,
                disabled: mobileDisable,
                dotFormat: (x) => `<span class="u-visually-hidden">slide ${x}</span>`,
                responsive
            }
        })
    })
}
