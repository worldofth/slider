import anime from 'animejs';

export const hiddenTransition = {
  name: 'hiddenTransition',
  config: {
    options: {
      hiddenTransition: false,
      animationSpeed: 750,
      animatingClass: 'is-animating',
    },
  },
  state: {
    animation: null,
    looped: false,
    obj: null,
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
  if (!this.config.options.hiddenTransition || this.state.isDisabled) {
    return;
  }

  this.pluginState['hiddenTransition'].obj = {
    el: 0,
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').match) {
    this.config.options.animationSpeed = 1;
  }
}

function slideChange() {
  if (!this.config.options.hiddenTransition || this.state.isDisabled) {
    return;
  }

  if (this.pluginState['hiddenTransition'].animation) {
    this.pluginState['hiddenTransition'].animation.pause();
    this.pluginState['hiddenTransition'].animation = null;
    this.elements.container.classList.remove(
      this.config.options.animatingClass,
    );
  }

  this.elements.container.classList.add(this.config.options.animatingClass);

  this.pluginState['hiddenTransition'].animation = anime({
    targets: this.pluginState['hiddenTransition'].obj,
    duration: this.config.options.animationSpeed,
    easing: this.config.options.easing,
    el: [0, 1],
  });

  this.pluginState['hiddenTransition'].animation.finished.then(() => {
    this.bus.triggers.transitionEnd.next(this);
    this.elements.container.classList.remove(
      this.config.options.animatingClass,
    );
  });
}
