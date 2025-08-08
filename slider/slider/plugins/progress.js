export const Progress = {
  name: 'progress',
  config: {
    options: {
      progressBar: false,
    },
    classes: {
      progressBar: 'c-slider__progress',
    },
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
  if (this.config.options.progressBar) {
    this.elements.progressBar = this.elements.container.querySelector(
      '.' + this.config.classes.progressBar,
    );
  }

  if (!this.config.options.progressBar || this.state.isDisabled) {
    if (this.elements.progressBar) {
      this.elements.progressBar.hidden = true;
    }
    return;
  }

  if (this.elements.progressBar) {
    this.elements.progressBar.hidden = false;
  }

  updateProgressState.call(this);
}

function slideChange() {
  if (!this.config.options.progressBar) {
    return;
  }

  updateProgressState.call(this);
}

function updateProgressState() {
  const progressPercent = this.state.currentSlide / (this.state.slideCount - 1);
  this.elements.progressBar.style.setProperty(
    '--progress-percent',
    progressPercent,
  );
}
