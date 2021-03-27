import Slider from './slider/slider'

function init() {
    console.log(Slider)
}

if (document.readyState === 'complete') {
    init()
} else {
    window.addEventListener('DOMContentLoaded', init)
}
