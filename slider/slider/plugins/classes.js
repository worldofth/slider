export const Classes = {
  name: 'Classes',
  config: {
    options: {
      classes: false,
      hasNextClasses: false,
      currentClass: 'is-current',
      previousClass: 'is-previous',
      nextClass: 'is-next',
      prevNextClass: 'is-previous-next',
      infiniteUpdateClass: 'is-infinite-loop',
      cleanUpClass: 'is-clean-up',
      classesByShow: false,
    },
  },
  state: {
    nextSlide: 0,
    nextPreviousSlide: 0,
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
  this.bus.events.infiniteLoop.subscribe(infiniteLoop.bind(this));
  this.bus.events.transitionEnd.subscribe(transitionEnd.bind(this));
}

function disabled(isDisabled) {
  if (!isDisabled) {
    return;
  }

  build.call(this);
}

function infiniteLoop() {
  this.elements.container.classList.add(
    this.config.options.infiniteUpdateClass,
  );
}

function transitionEnd() {
  this.elements.container.classList.add(this.config.options.cleanUpClass);

  this.elements.allSlides.forEach((slide) => {
    if (slide.classList.contains(this.config.options.previousClass)) {
      slide.classList.remove(this.config.options.previousClass);
    }
  });

  requestAnimationFrame(() => {
    this.elements.container.classList.remove(this.config.options.cleanUpClass);
  });
}

function build() {
  slideChange.call(this);
  transitionEnd.call(this);
}

function slideChange() {
  if (!this.config.options.classes || this.state.isDisabled) {
    this.elements.allSlides.forEach((slide) => {
      slide.classList.remove(this.config.options.currentClass);
      slide.classList.remove(this.config.options.previousClass);
    });
    return;
  }

  let currentSlide;
  if (this.config.options.isInfinite) {
    currentSlide =
      this.state.relativeCurrentSlide / this.config.options.slidesToScroll +
      this.state.slidePositionOffset;
  } else {
    currentSlide = this.state.currentSlide;
  }

  let nextSlide;
  let nextPreviousSlide;
  if (this.config.options.hasNextClasses) {
    nextSlide = currentSlide + this.config.options.slidesToScroll;
    nextPreviousSlide = currentSlide - this.config.options.slidesToScroll;

    if (this.config.options.isInfinite) {
      // ignoring cloned items

      if (nextSlide < 0) {
        nextSlide = this.config.options.slidesToScroll - nextSlide;
      }

      if (nextPreviousSlide < 0) {
        nextPreviousSlide =
          this.config.options.slidesToScroll - nextPreviousSlide;
      }

      nextSlide = nextSlide % this.state.slideCount;
      nextPreviousSlide = nextPreviousSlide % this.state.slideCount;
    } else {
      nextSlide = Math.min(Math.max(0, nextSlide), this.state.slideCount - 1);
      nextPreviousSlide = Math.min(
        Math.max(0, nextPreviousSlide),
        this.state.slideCount - 1,
      );
    }

    this.pluginState['Classes'].nextSlide = nextSlide;
    this.pluginState['Classes'].nextPreviousSlide = nextPreviousSlide;
  }

  this.elements.allSlides.forEach((slide) => {
    if (slide.classList.contains(this.config.options.currentClass)) {
      slide.classList.remove(this.config.options.currentClass);
      slide.classList.add(this.config.options.previousClass);
    }

    if (this.config.options.hasNextClasses) {
      if (slide.classList.contains(this.config.options.nextClass)) {
        slide.classList.remove(this.config.options.nextClass);
      }

      if (slide.classList.contains(this.config.options.prevNextClass)) {
        slide.classList.remove(this.config.options.prevNextClass);
      }
    }
  });

  let offset = this.config.options.slidesToScroll;

  if (this.config.options.classesByShow) {
    offset = this.config.options.slidesToShow;
  }

  for (let index = currentSlide; index < currentSlide + offset; index++) {
    const element = this.elements.allSlides[index];
    element.classList.add(this.config.options.currentClass);
  }

  this.elements.container.classList.remove(
    this.config.options.infiniteUpdateClass,
  );

  if (this.config.options.hasNextClasses) {
    this.elements.slides[this.pluginState['Classes'].nextSlide].classList.add(
      this.config.options.nextClass,
    );
    this.elements.slides[
      this.pluginState['Classes'].nextPreviousSlide
    ].classList.add(this.config.options.prevNextClass);
  }
}
