import {
  Arrows,
  HorizontalSlide,
  Dots,
  Accessibility,
  Autoplay,
  Fade,
  NavFor,
  Swipe,
  Classes,
  hiddenTransition,
  Progress,
} from './plugins';

export const defaultOptions = {
  slidesToShow: 1,
  slidesToScroll: 1,
  isInfinite: false,
};

export const defaultClasses = {
  slider: 'c-slider',
  viewport: 'c-slider__viewport',
  track: 'c-slider__track',
  slide: 'c-slider__slide',
  slideClone: 'c-slide__slide-clone',
};

export const DefaultPlugins = [
  Arrows,
  HorizontalSlide,
  Dots,
  Accessibility,
  Autoplay,
  Fade,
  NavFor,
  Swipe,
  Classes,
  hiddenTransition,
  Progress,
];
