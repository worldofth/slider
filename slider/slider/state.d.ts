import { Subject } from 'rxjs/internal/Subject'
import { SliderPlugin } from './plugins/plugin'
import { SliderClasses, Options, SliderConfig, ResponsiveOptions } from './index'

export interface SliderObj {
    config: ConfigObj,
    state: StateObj,
    elements: ElementObj,
    bus: BusObj,
    plugins: SliderPlugin[],
    pluginState: Object
}

export interface ConfigObj {
    options: Options,
    responsiveOptions: ResponsiveOptions,
    breakpoints: String[],
    classes: SliderClasses
}

export interface StateObj {
    isInitilised: boolean,
    currentSlide: Number,
    relativeCurrentSlide: Number,
    previousSlide: Number,
    relativePreviousSlide: Number,
    slideCount: Number,
    totalSlideCount: Number,
    currentBreakpoint: Number,
    maxSlidePosition: Number,
    maxInfiniteSlidePosition: Number,
    minSlidePosition: Number,
    minInfiniteSlidePosition: Number,
    slidePositionOffset: Number
}

export interface ElementObj {
    container: Element,
    viewport: Element,
    track: Element,
    slides: Element,
    allSlides: Element
}

export interface BusObj {
    triggers: TiggersObj,
    events: EventsObj
}

export interface TiggersObj {
    incrementSlide: Subject,
    changeSlide: Subject,
    setup: Subject
}

export interface EventsObj {
    slideChange: Subject
}

/**
 *
 * @param config - passing the slider config
 * @param doneCallback - done callback, can be called multiple times for breakpoint changes
 */
export declare function setupConfig(config: SliderConfig , doneCallback: Function): void;

/**
 * creates the responsive options state and sets up the breakpoint list from largest to smallest
 * calls update breakpoints, which in turns calls the setup function
 */
export declare function setupResponsiveOptions(doneCallback: Function): void;

/**
 * Goes through the breakpoint keys from largest to smallest
 * if the breakpoint has changes we change the config.options and call setup
 * if this is the first time this is run, it will call the setup function
 */
export declare function updateBreakpoints(doneCallback: Function): void;
