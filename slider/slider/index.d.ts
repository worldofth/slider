import { SliderPlugin } from './plugins/plugin'
import { SliderObj } from './state'

export declare type Selector = String | Element

export interface Options {
    slidesToShow?: number
    slidesToScroll?: number
}

export interface SlideOptions extends options {
    reponsive?: ResponsiveOptions
}

export interface ResponsiveOptions<Options> {
    [MinWidth: String]: Options
}

export interface SliderClasses {
    slider?: String
    viewport?: String
    track?: String
    slide?: String
    slideClone?: String
}

export interface SliderConfig {
    options?: SlideOptions
    classes?: SliderClasses
    plugins?: SliderPlugin[]
}

export declare function Slider(selector: Selector, config: SliderConfig): SliderObj
