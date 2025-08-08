import { fromEvent } from 'rxjs';

export const Arrows = {
  name: 'arrows',
  config: {
    options: {
      arrows: false,
      buildArrows: false,
      referenceArrows: false,
      arrowDataAttribs: true,
      prevArrow: `<button class="c-slider__arrow" data-arrow="prev">previous</button>`,
      nextArrow: `<button class="c-slider__arrow" data-arrow="next">next</button>`,
    },
    classes: {
      nextArrow: '[data-arrow="next"]',
      prevArrow: '[data-arrow="prev"]',
    },
  },
  state: {
    prevArrowObservable: null,
    nextArrowObservable: null,
    testEl: null,
  },
  build: {
    order: 0,
    fnc: build,
  },
  setupEvents: {
    order: 0,
    fnc: setupEvents,
  },
  teardownEvents,
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

function setupEvents() {
  if (!this.config.options.arrows) {
    return;
  }

  // on prev arrow click decrements the slider by slides to scroll
  this.pluginState['arrows'].prevArrowObservable = fromEvent(
    this.elements.prevArrow,
    'click',
  ).subscribe(() => {
    if (this.state.isDisabled) {
      return;
    }

    this.bus.triggers.incrementSlide.next(-1);
    this.state.slideChangeTrigger = 'arrow';
  });

  // on next arrow click increments the slider by slides to scroll
  this.pluginState['arrows'].nextArrowObservable = fromEvent(
    this.elements.nextArrow,
    'click',
  ).subscribe(() => {
    if (this.state.isDisabled) {
      return;
    }

    this.state.slideChangeTrigger = 'arrow';
    this.bus.triggers.incrementSlide.next(1);
  });
}

function teardownEvents() {
  if (this.pluginState['arrows'].prevArrowObservable) {
    this.pluginState['arrows'].prevArrowObservable.unsubscribe();
  }

  if (this.pluginState['arrows'].nextArrowObservable) {
    this.pluginState['arrows'].nextArrowObservable.unsubscribe();
  }
}

function build() {
  if (this.config.options.referenceArrows) {
    let nextArrow = this.config.classes.nextArrow;
    let prevArrow = this.config.classes.prevArrow;

    if (!this.config.options.arrowDataAttribs) {
      nextArrow = '.' + nextArrow;
      prevArrow = '.' + prevArrow;
    }

    this.elements.nextArrow = this.elements.container.querySelector(nextArrow);
    this.elements.prevArrow = this.elements.container.querySelector(prevArrow);
  }

  if (!this.config.options.arrows || this.state.isDisabled) {
    if (this.elements.nextArrow) {
      this.elements.nextArrow.hidden = true;
    }

    if (this.elements.prevArrow) {
      this.elements.prevArrow.hidden = true;
    }
    return;
  }

  if (
    this.config.options.buildArrows &&
    this.config.options.nextArrow &&
    this.config.options.prevArrow
  ) {
    if (this.elements.nextArrow) {
      this.elements.nextArrow.remove();
    }

    if (this.elements.prevArrow) {
      this.elements.prevArrow.remove();
    }

    let nextArrow = document.createElement('div');
    nextArrow.innerHTML = this.config.options.nextArrow;
    nextArrow = nextArrow.firstElementChild;

    let prevArrow = document.createElement('div');
    prevArrow.innerHTML = this.config.options.prevArrow;
    prevArrow = prevArrow.firstElementChild;

    this.elements.nextArrow = this.elements.viewport.appendChild(nextArrow);
    this.elements.prevArrow = this.elements.viewport.insertBefore(
      prevArrow,
      this.elements.track,
    );
  }

  if (this.elements.nextArrow.hidden) {
    this.elements.nextArrow.hidden = false;
  }

  if (this.elements.prevArrow.hidden) {
    this.elements.prevArrow.hidden = false;
  }

  this.pluginState['arrows'].testEl = this.elements.prevArrow;

  updateArrowState.call(this);
}

function slideChange() {
  if (!this.config.options.arrows) {
    return;
  }

  updateArrowState.call(this);
}

function updateArrowState() {
  if (this.config.options.isInfinite) {
    this.elements.prevArrow.removeAttribute('disabled');
    this.elements.nextArrow.removeAttribute('disabled');
    return;
  }

  let offset = 0;
  if (!this.config.options.isInfinite) {
    offset =
      this.config.options.slidesToShow - this.config.options.slidesToScroll;
  }

  if (this.state.currentSlide === this.state.minSlidePosition) {
    this.elements.prevArrow.disabled = true;
  } else {
    this.elements.prevArrow.removeAttribute('disabled');
  }

  if (this.state.currentSlide === this.state.maxSlidePosition - offset) {
    this.elements.nextArrow.disabled = true;
  } else {
    this.elements.nextArrow.removeAttribute('disabled');
  }
}
