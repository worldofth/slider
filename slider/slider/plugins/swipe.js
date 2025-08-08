import { fromEvent, merge } from 'rxjs';

export const Swipe = {
  name: 'swipe',
  config: {
    options: {
      swipe: true,
    },
  },
  state: {
    diff: 0,
  },
  setupEvents: {
    order: 0,
    fnc: setupEvents,
  },
};

function setupEvents() {
  if (!this.config.options.swipe) {
    return;
  }

  const down = merge(
    // fromEvent(this.elements.viewport, 'mousedown'),
    fromEvent(this.elements.viewport, 'touchstart'),
  );

  const move = merge(
    // fromEvent(window, 'mousemove'),
    fromEvent(window, 'touchmove'),
  );

  const up = merge(
    fromEvent(window, 'dragend'),
    // fromEvent(window, 'mouseup'),
    fromEvent(window, 'touchend'),
    fromEvent(window, 'touchcancel'),
  );

  let downX = 0;
  let isDown = false;
  let currentSlide;
  let viewportWidth;

  down.subscribe((downEvt) => {
    downX = getXCoord(downEvt);
    isDown = true;

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

    viewportWidth = this.elements.viewport.offsetWidth;
  });

  move.subscribe((moveEvt) => {
    if (!isDown) {
      return;
    }

    this.pluginState['swipe'].diff = getXCoord(moveEvt) - downX;

    if (this.config.options.horizontalSlide) {
      this.elements.track.style.transform = `translateX(${
        currentSlide *
          this.pluginState['HorizontalSlide'].singleSlideMove *
          viewportWidth +
        this.pluginState['swipe'].diff +
        'px'
      })`;
    }
  });

  up.subscribe((upEvt) => {
    isDown = false;

    const upX = getXCoord(upEvt);
    if (upX) {
      this.pluginState['swipe'].diff = getXCoord(upEvt) - downX;
    }

    const diff = this.pluginState['swipe'].diff;

    if (Math.abs(diff) > 50) {
      const increment = diff < 0 ? 1 : -1;

      this.bus.triggers.incrementSlide.next(increment);
      this.state.slideChangeTrigger = 'swipe';
    }
  });
}

function getXCoord(evt) {
  if (evt.touches && evt.touches.length) {
    return evt.touches[0].clientX;
  }

  return evt.clientX;
}
