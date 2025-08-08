export const NavFor = {
  name: 'navfor',
  config: {
    options: {
      navFor: [],
    },
  },
  subscribeToEvents,
};

function subscribeToEvents() {
  this.bus.triggers.incrementSlide.subscribe(incrementSlide.bind(this));
  this.bus.triggers.changeSlide.subscribe(changeSlide.bind(this));
}

function incrementSlide(change) {
  if (
    !this.config.options.navFor ||
    (this.config.options.navFor && !this.config.options.navFor.length)
  ) {
    return;
  }

  this.config.options.navFor.forEach((slider) => {
    if (this.state.isDisabled) {
      return;
    }

    if (!slider || !slider.bus) {
      return;
    }

    if (slider.state.isDisabled) {
      return;
    }
    slider.bus.triggers.incrementSlide.next(change);
    slider.state.slideChangeTrigger = 'navFor';
  });
}

function changeSlide(change) {
  if (
    !this.config.options.navFor ||
    (this.config.options.navFor && !this.config.options.navFor.length)
  ) {
    return;
  }

  this.config.options.navFor.forEach((slider) => {
    if (this.state.isDisabled) {
      return;
    }

    if (!slider || !slider.bus) {
      return;
    }

    if (slider.state.isDisabled) {
      return;
    }
    slider.bus.triggers.changeSlide.next(change);
    slider.state.slideChangeTrigger = 'navFor';
  });
}
