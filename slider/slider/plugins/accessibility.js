import { fromEvent } from 'rxjs';

// assume this is always used and on
// add in inert for slides https://github.com/WICG/inert

export const Accessibility = {
  name: 'accessibility',
  config: {
    options: {
      accessibility: true,
      liveRegion: true,
      itemName: 'Slide item',
    },
    classes: {
      visuallyHidden: 'u-visually-hidden',
    },
  },
  pluginState: {
    focusinSlider: false,
  },
  build: {
    order: 1,
    fnc: build,
  },
  setupEvents: {
    order: 0,
    fnc: setupEvents,
  },
  subscribeToEvents,
};

function subscribeToEvents() {
  this.bus.events.slideChange.subscribe(slideChange.bind(this));
  this.bus.events.transitionEnd.subscribe(transitionEnd.bind(this));
  this.bus.events.disabled.subscribe(disabled.bind(this));
}

function disabled(isDisabled) {
  if (!isDisabled) {
    return;
  }

  this.elements.allSlides.forEach((slide) => {
    slide.removeAttribute('aria-hidden');
    slide.removeAttribute('tabindex');
    slide.removeAttribute('focusable');
    slide.inert = false;
  });

  if (this.elements.liveRegion) {
    this.elements.liveRegion.remove();
  }
}

function setupEvents() {
  fromEvent(this.elements.container, 'focusin').subscribe(() => {
    if (this.state.isDisabled) {
      return;
    }

    if (!this.pluginState['accessibility'].focusinSlider) {
      this.pluginState['accessibility'].focusinSlider = true;
      this.bus.triggers.focusIn.next(this);
    }
  });

  fromEvent(document, 'focusin').subscribe((evt) => {
    if (this.state.isDisabled) {
      return;
    }

    if (!this.pluginState['accessibility'].focusinSlider) {
      return;
    }

    if (!evt.target.closest('.' + this.config.classes.slider)) {
      this.pluginState['accessibility'].focusinSlider = false;
      this.bus.triggers.focusOut.next(this);
      this.elements.slides[this.state.currentSlide].removeAttribute('tabindex');
    }
  });
}

function build() {
  if (this.state.isDisabled || !this.config.options.accessibility) {
    return;
  }

  updateSlideAttributes.call(this);

  if (this.config.options.liveRegion) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add(this.config.classes.visuallyHidden);
    this.elements.container.insertBefore(
      liveRegion,
      this.elements.container.firstElementChild,
    );
    this.elements.liveRegion = liveRegion;
  } else if (this.elements.liveRegion) {
    this.elements.liveRegion.remove();
  }
}

function slideChange() {
  if (this.state.isDisabled || !this.config.options.accessibility) {
    return;
  }

  if (this.config.options.liveRegion) {
    if (this.state.slideChangeTrigger === 'autoplay') {
      this.elements.liveRegion.removeAttribute('aria-live');
      this.elements.liveRegion.removeAttribute('aria-atomic');
    } else {
      this.elements.liveRegion.setAttribute('aria-live', 'polite');
      this.elements.liveRegion.setAttribute('aria-atomic', 'true');
    }

    let currentSlide = this.state.currentSlide;
    if (this.config.options.isInfinite) {
      currentSlide = this.state.relativeCurrentSlide + 1;
    }

    if (this.config.options.slidesToShow > 1) {
      let lastShowingSlide =
        (currentSlide + this.config.options.slidesToShow - 1) %
        (this.state.slideCount + 1);
      if (lastShowingSlide < currentSlide) {
        lastShowingSlide++;
      }

      this.elements.liveRegion.textContent =
        this.config.options.itemName +
        ' ' +
        currentSlide +
        ' to ' +
        lastShowingSlide +
        ' of ' +
        this.state.slideCount;
    } else {
      this.elements.liveRegion.textContent =
        this.config.options.itemName +
        ' ' +
        currentSlide +
        ' of ' +
        this.state.slideCount;
    }
  }
}

function updateSlideAttributes() {
  let currentSlide;

  if (this.config.options.isInfinite) {
    currentSlide = this.state.relativeCurrentSlide;
  } else {
    currentSlide = this.state.currentSlide;
  }

  this.elements.allSlides.forEach((slide) => {
    if (slide.inert) {
      return;
    }

    slide.setAttribute('aria-hidden', true);
    slide.setAttribute('tabindex', '-1');
    slide.setAttribute('focusable', false);
    slide.inert = true;
  });

  let currentPos = 0;
  let offset = 0;
  if (this.config.options.isInfinite) {
    offset = this.config.options.slidesToShow;
  }
  for (let i = 0; i < this.config.options.slidesToShow; i++) {
    currentPos = currentSlide + i + offset;
    if (currentPos >= this.state.totalSlideCount) {
      break;
    }

    this.elements.allSlides[currentPos].inert = false;
    this.elements.allSlides[currentPos].removeAttribute('focusable');
    this.elements.allSlides[currentPos].removeAttribute('aria-hidden');
  }
}

function transitionEnd() {
  if (this.state.isDisabled || !this.config.options.accessibility) {
    return;
  }

  updateSlideAttributes.call(this);

  if (['autoplay', 'navFor'].includes(this.state.slideChangeTrigger)) {
    return;
  }

  this.elements.slides[this.state.currentSlide].focus();
}
