import anime from 'animejs';

export const Fade = {
  name: 'fade',
  config: {
    options: {
      fade: false,
      animationSpeed: 750,
      easing: 'cubicBezier(0.3, 0.15, 0.18, 1)',
    },
  },
  state: {
    currentAnimation: null,
    singleSlideMovePercent: 0,
    slideMoveOffset: 0,
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
  this.bus.events.disabled.subscribe(disabled.bind(this));
}

function disabled(isDisabled) {
  if (!isDisabled) {
    return;
  }

  build.call(this);
}

function build() {
  if (!this.config.options.fade || this.state.isDisabled) {
    this.elements.allSlides.forEach((el) => {
      el.removeAttribute('style');
    });
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').match) {
    this.config.options.animationSpeed = 1;
  }

  this.pluginState['fade'].singleSlideMovePercent = -100;
  this.pluginState['fade'].slideMoveOffset =
    this.config.options.slidesToShow *
    this.pluginState['fade'].singleSlideMovePercent;

  this.elements.allSlides.forEach((el) => {
    el.style.zIndex = 0;
    el.style.opacity = 0;
  });

  this.elements.slides[this.state.currentSlide].style.zIndex = 2;
  this.elements.slides[this.state.currentSlide].style.opacity = 1;
  this.elements.slides[this.state.currentSlide].style.transform = `translateX(${
    this.state.currentSlide * this.pluginState['fade'].singleSlideMovePercent +
    this.pluginState['fade'].slideMoveOffset
  }%)`;
}

function slideChange() {
  if (!this.config.options.fade || this.state.isDisabled) {
    return;
  }

  if (this.pluginState['fade'].currentAnimation) {
    animationEndCleanup.call(this);

    this.pluginState['fade'].currentAnimation.pause();
    this.pluginState['fade'].currentAnimation = null;
  }

  const currentSlides = getSlides.call(
    this,
    this.state.currentSlide,
    this.config.options.slidesToShow,
  );
  const previousSlides = getSlides.call(
    this,
    this.state.previousSlide,
    this.config.options.slidesToScroll,
  );

  currentSlides.forEach((el) => {
    el.style.transform = `translateX(${
      this.state.currentSlide *
        this.pluginState['fade'].singleSlideMovePercent +
      this.pluginState['fade'].slideMoveOffset
    }%)`;
    el.style.zIndex = 2;
    el.style.opacity = 0;
  });

  previousSlides.forEach((el) => {
    el.style.transform = `translateX(${
      this.state.previousSlide *
        this.pluginState['fade'].singleSlideMovePercent +
      this.pluginState['fade'].slideMoveOffset
    }%)`;
    el.style.zIndex = 1;
    el.style.opacity = 1;
  });

  this.pluginState['fade'].currentAnimation = anime({
    targets: currentSlides,
    duration: this.config.options.animationSpeed,
    easing: this.config.options.easing,
    opacity: 1,
  });

  this.pluginState['fade'].currentAnimation.finished.then(() => {
    animationEndCleanup.call(this);

    // this.bus.triggers.transitionEnd.next(this)
  });
}

function animationEndCleanup() {
  this.elements.slides.forEach((el, index) => {
    if (
      index >= this.state.currentSlide &&
      index <= this.state.currentSlide + this.config.options.slidesToShow
    ) {
      return;
    }
    el.style.transform = '';
    el.style.zIndex = 0;
    el.style.opacity = 0;
  });
}

function getSlides(slidePosition, length) {
  const output = [];
  const slideLength = this.elements.slides.length;
  for (let i = slidePosition; i < slidePosition + length; i++) {
    output.push(
      this.elements.slides[((i % slideLength) + slideLength) % slideLength],
    );
  }
  return output;
}
