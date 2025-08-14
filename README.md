# slider

This slider is built upon a plugin based architecture allowing you to compose behaviour together.

## Main features
- Plugin based architecture
- Event Bus using observables (rxjs)
- Responsive
- accessible

Basic start:
html
```html
    <div class="c-slider js-slider">
        <div class="c-slider__viewport">
            <ul class="c-slider__track">
                <li class="c-slider__slide">Slide 1</li>
                <li class="c-slider__slide">Slide 2</li>
                <li class="c-slider__slide">Slide 3</li>
            </ul>
        </div>
    </div>
```
js
```js
    import { Slider } from './path/to/slider';

    const mySlider = Slider('.js-slider', {

        options: {

            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true,

            autoplay: true

        }
    });
```

## Interface

All of the plugin options can also be found in the various plugins which also allows you to see what they are used for in the plugin file.
```js
    import { Slider } from './path/to/slider/index.js'

    const element = document.querySelector('.js-slider')

    const mySlider = Slider(element, {

        options: {
            // Core options

            slidesToShow: 1,
            slidesToScroll: 1,

            isInfinite: false,
            disabled: false,

            // Plugin Options
            // Accessibility options

            accessibility: true,
            liveRegion: true,

            itemName: 'Slide item',


            // Arrow options
            arrows: false,
            buildArrows: false, // allows you to turn on and off building arrows
            referenceArrows: false, // set to reference the arrows
            arrowDataAttribs: true,
            prevArrow: `<button class="c-slider__arrow" data-arrow="prev">previous</button>`, // the templates if you are building

            nextArrow: `<button class="c-slider__arrow" data-arrow="next">next</button>`,

            // Autoplay options

            autoplay: false,
            autoplaySpeed: 4500,
            disablePausers: false,

            autoplayReverse: false,

            // Classes options - alternate to animations allowing you to use custom css animations instead

            classes: false,
            hasNextClasses: false,
            currentClass: 'is-current',
            previousClass: 'is-previous',
            nextClass: 'is-next',
            prevNextClass: 'is-previous-next',
            infiniteUpdateClass: 'is-infinite-loop',
            cleanUpClass: 'is-clean-up',

            classesByShow: false,
            // used by classes to control when the animaton changes

            hiddenTransition: false,
            animationSpeed: 750,

            animatingClass: 'is-animating',

            // Dots options

            dots: false,
            referenceDotContainer: false,
            dotDataAttribs: true,

            dotFormat: (x) => x,

            // Fade options

            fade: false,
            animationSpeed: 750,

            easing: 'cubicBezier(0.3, 0.15, 0.18, 1)',

            // HorizontalSlide options

            horizontalSlide: false,
            animationSpeed: 750,

            easing: 'cubicBezier(0.3, 0.15, 0.18, 1)',

            // NavFor options
            navFor: [], // used to control other sliders, so you can have 1 slider that takes all the change events and pass them to other sliders

            // Swipe options
            swipe: true,

            // Responsive options

            responsive: {
                '768px': { // this is the same as (min-width: 768px)
                    // any option here including disable if you want to disable the slider on specific breakpoints
                    slidesToShow: 3 // so from 768px and up it will show 3 slides in the viewport
                }
            }
        },

        // Custom Classes
        classes: {
            slider: 'c-slider',
            viewport: 'c-slider__viewport',
            track: 'c-slider__track',
            slide: 'c-slider__slide',

            slideClone: 'c-slide__slide-clone',

        }
    })
```
above are the defaults which you can change, most i leave as false and put the responsibility of conflicting config on the programmer.

## HTML structure and css

### HTML

I like to add the full HTML and not build too many node elements via javascript. So for instance i like referencing arrows and dots container as it allows me to better control the layout and positioning of these elements. For instance the __controls wrapper is not referenced in the javascript but it allows me to next arrows next to slider or put arrows left and right of the dots without having to fight to position it.
```html
    <div class="c-slider js-slider" aria-labelby="sliderIdHeader">
        <!-- Accessibility skip link (optional) -->
        <a href="#endSliderId" id="startSliderId" class="c-slider__skip-btn">Start of slider, skip slider</a>

        <!-- Accessibility heading (optional) -->
        <h2 id="sliderIdHeader" class="u-visually-hidden">Slider Title</h2>

        <!-- Main slider viewport -->
        <div class="c-slider__viewport">
            <ul class="c-slider__track" data-unstyled>
                <li class="c-slider__slide">Slide 1</li>
                <li class="c-slider__slide">Slide 2</li>
                <li class="c-slider__slide">Slide 3</li>
            </ul>

            <!-- Controls container -->
            <div class="c-slider__controls">
                <!-- Dot navigation -->
                <div class="c-slider__dots" hidden></div>

                <!-- Previous arrow -->
                <button class="c-slider__arrow" data-arrow="prev" hidden>
                    <span class="u-visually-hidden">previous slide</span>
                    <!-- Icon content -->
                </button>

                <!-- Next arrow -->
                <button class="c-slider__arrow" data-arrow="next" hidden>
                    <span class="u-visually-hidden">next slide</span>
                    <!-- Icon content -->
                </button>
            </div>
        </div>

        <!-- Accessibility skip link (optional) -->
        <a href="#startSliderId" id="endSliderId" class="c-slider__skip-btn">End of slider, skip slider</a>
    </div>
```

#### Wrapper `<div class="c-slider js-slider" aria-labelby="sliderIdHeader">`

this wrapper i normally don't do too much styling with, as it's more a relative position to position elements like the arrows and dots against or the controls wrapper.

When the slider has been inited i add a data-init="true" to this element allowing me to change and setup styling like i sometimes fallback the track to be overflow: auto to make it side scroll, but remove that style when data init is added.

This also is where i add aria labels and roles, like for instance me linking the aria-labelby to the visually hidden h2 (i do this instead of an aria-label because it can be translated by a tool where aria-label can't)

#### Viewport `c-slider__viewport`

The viewport allows you to control the viewable area of the slider, so this generally where i add the overflow clip/hidden, or if you can view the items outside of this area i will move this overflow: clip/hidden to a wrapper that touches the edge of the page instead.

#### Track `c-slider__track`

This is where i store the slides and where i utilise flexbox to make each slide 100% width but can't shrink allowing it to create the number of visible slides in a flexbox context. This is also a unordered list so a screen reader will state how many slides there are.

CSS
```css
    .c-slider {
        position: relative;
    }

    .c-slider__viewport {
        overflow: clip;
    }

    .c-slider__track {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .c-slider__slide {
        flex: 0 0 100%;
    }
```

allows you to add a data attribute to control the flex width
```scss
    .c-slider {
        @for $i from 2 through 6 {
            &[data-slides-to-show="#{$i}"] &__track > * {
                flex: 0 0 #{math.div(100%, $i)};
            }
        }
    }
```
add a side scroll until the slider is initialised
```scss
    .c-slider {
        &__track {
            display: flex;
            overflow-x: auto;

            > * {
                flex: 0 0 100%;
            }
        }

        &[data-init] &__track {
            overflow-x: visible;
        }
    }
```
## The event bus

There are two sections on the event, the events and the triggers. The events are items you subscribe to when something changes like a slide change, if the slider is disabled. The triggers are the items you will submit an event to, to change something in the slider like incrementing the slider or changing to a specific slide.
```js
    bus: {
        events: {
            slideChange, // triggered when a slide has been changed
            resize, // triggered when the window has resized, used for the responsive option
            disabled, // when the slider is toggled disabled to uninit and reinit items
            infiniteLoop, // when we hit the infinite loop and we need to go to the start or end of the loop
            transitionEnd // when the animation has ended and we need to clean up
        },
        triggers: {
            incrementSlide, // increments the slide, triggers the slideChange Event
            changeSlide, // sets the current clide, triggers the slideChange Event
            setup, // used during setup to allow plugins to init
            transitionEnd, // triggers the transition env event
            focusIn, // used for pausing autoplay
            focusOut // used for pausing autoplay
        }
    }
```
## Useful tips

you can gain access to the bus to subscribe to and trigger events allowing for one off bespoke functionality
```js
    const mySlider = Slider(element, options)

    // subscribe to the slide change event and log the current slide index
    mySlider.bus.slideChange.subscribe(() => {
        console.log(mySlider.state.currentSlide)
    })

    mySlider.bus.triggers.incrementSlide.next(2) // increments the slider 2

    mySlider.bus.triggers.changeSlide.next(2) // sets the current slide to 2
```

Nav for example, allowing a slider with no controls to be changed and controlled by another slider
```js
    const BackgroundSliderWithNoControls = Slider(element, {
        ...options,
        arrows: false,
        dots: false,
        autoplay: false
    })

    const ContentSliderWidthControls = Slider(element, {
        ...options,
        navFor: [BackgroundSliderWithNoControls]
    })
```
