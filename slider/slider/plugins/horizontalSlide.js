import anime from 'animejs';

export const HorizontalSlide = {
  name: 'HorizontalSlide',
  config: {
    options: {
      horizontalSlide: false,
      animationSpeed: 750,
      easing: 'cubicBezier(0.3, 0.15, 0.18, 1)',
    },
  },
  state: {
    currentAnimation: null,
    singleSlideMovePercent: 0,
    singleSlideMove: 0,
    looped: false,
  },
  build: {
    order: 0,
    fnc: build,
  },
  subscribeToEvents,
};

function subscribeToEvents() {
  this.bus.events.slideChange.subscribe(slideChange.bind(this));
  this.bus.events.infiniteLoop.subscribe(infiniteLoop.bind(this));
  this.bus.events.disabled.subscribe(disabled.bind(this));
}

function disabled(isDisabled) {
  if (!isDisabled) {
    return;
  }

  build.call(this);
}

function build() {
  if (!this.config.options.horizontalSlide || this.state.isDisabled) {
    this.elements.track.removeAttribute('style');
    return;
  }

  this.pluginState['HorizontalSlide'].singleSlideMovePercent =
    (this.config.options.slidesToScroll / this.config.options.slidesToShow) *
    -100;

  this.pluginState['HorizontalSlide'].singleSlideMove =
    (this.config.options.slidesToScroll / this.config.options.slidesToShow) *
    -1;

  let currentSlide;
  if (this.config.options.isInfinite) {
    currentSlide =
      this.state.relativeCurrentSlide + this.state.slidePositionOffset;
  } else {
    currentSlide = this.state.currentSlide % this.state.scrollVsShowDiff;
  }

  this.elements.track.style.transform = `translateX(${
    currentSlide * this.pluginState['HorizontalSlide'].singleSlideMovePercent
  }%)`;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').match) {
    this.config.options.animationSpeed = 1;
  }
}

function infiniteLoop() {
  if (!this.config.options.horizontalSlide) {
    return;
  }

  this.pluginState['HorizontalSlide'].looped = true;
}

function slideChange() {
  if (!this.config.options.horizontalSlide || this.state.isDisabled) {
    return;
  }

  if (this.pluginState['HorizontalSlide'].currentAnimation) {
    this.pluginState['HorizontalSlide'].currentAnimation.pause();
    this.pluginState['HorizontalSlide'].currentAnimation = null;
  }

  let currentSlide;
  if (this.config.options.isInfinite) {
    currentSlide =
      this.state.relativeCurrentSlide / this.config.options.slidesToScroll +
      this.state.slidePositionOffset;
  } else {
    currentSlide = Math.min(
      this.state.currentSlide,
      this.state.slideCount - 1 - this.state.scrollVsShowDiff,
    );
  }

  let previousSlide;
  if (this.config.options.isInfinite) {
    previousSlide =
      this.state.relativePreviousSlide / this.config.options.slidesToScroll +
      this.state.slidePositionOffset;
  } else {
    previousSlide = Math.min(
      this.state.previousSlide,
      this.state.slideCount - 1 - this.state.scrollVsShowDiff,
    );
  }

  const viewportWidth = this.elements.viewport.offsetWidth;
  let offset = 0;
  if (this.pluginState['swipe'].diff) {
    offset = this.pluginState['swipe'].diff;
  }

  this.pluginState['HorizontalSlide'].currentAnimation = anime({
    targets: this.elements.track,
    duration: this.config.options.animationSpeed,
    easing: this.config.options.easing,
    translateX: [
      previousSlide *
        this.pluginState['HorizontalSlide'].singleSlideMove *
        viewportWidth +
        offset +
        'px',
      currentSlide *
        this.pluginState['HorizontalSlide'].singleSlideMove *
        viewportWidth +
        'px',
    ],
    complete: () => {
      this.elements.track.style.transform = `translateX(${
        currentSlide *
          this.pluginState['HorizontalSlide'].singleSlideMovePercent +
        '%'
      })`;

      this.pluginState['swipe'].diff = 0;
    },
  });

  this.pluginState['HorizontalSlide'].currentAnimation.finished.then(() => {
    this.bus.triggers.transitionEnd.next(this);
  });
}

function getCurrentTranslate() {
  if (this.pluginState['HorizontalSlide'].looped) {
    this.pluginState['HorizontalSlide'].looped = false;
    let currentSlide =
      this.state.relativePreviousSlide / this.config.options.slidesToScroll +
      this.state.slidePositionOffset;
    return (
      currentSlide * this.pluginState['HorizontalSlide'].singleSlideMovePercent
    );
  }

  const currentTranslateMatch =
    this.elements.track.style.transform.match(/translateX\(+(.+)+\)/);
  return (currentTranslateMatch && currentTranslateMatch[1]) || 0;
}
