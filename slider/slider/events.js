import { Subject, fromEvent, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export function setupEvents() {
  setupBus.call(this);
  setupPluginSubscribeEvents.call(this);
  slideChangeEvents.call(this);
}

function setupBus() {
  this.bus.events.slideChange = new Subject();
  this.bus.events.resize = fromEvent(window, 'resize').pipe(debounceTime(200));
  this.bus.events.disabled = new Subject();
  this.bus.events.infiniteLoop = new Subject();
  this.bus.events.transitionEnd = new Subject();

  this.bus.triggers.incrementSlide = new Subject();
  this.bus.triggers.changeSlide = new Subject();
  this.bus.triggers.setup = new Subject();
  this.bus.triggers.transitionEnd = new Subject();
  this.bus.triggers.focusIn = new Subject();
  this.bus.triggers.focusOut = new Subject();

  this.bus.triggers.transitionEnd.subscribe((evt) => {
    this.bus.events.transitionEnd.next(evt);
  });
}

function setupPluginSubscribeEvents() {
  this.plugins.forEach((plugin) => {
    plugin.subscribeToEvents && plugin.subscribeToEvents.call(this);
  });
}

function slideChangeEvents() {
  const incrementSlide = this.bus.triggers.incrementSlide.pipe(
    map((change) => {
      if (this.config.options.isInfinite) {
        let currentPosition =
          Math.abs(
            change + this.state.currentSlide + this.state.maxSlidePosition + 1,
          ) %
          (this.state.maxSlidePosition + 1);

        currentPosition = Math.max(
          Math.min(currentPosition, this.state.maxSlidePosition),
          this.state.minSlidePosition,
        );

        this.state.previousSlide = this.state.currentSlide;

        this.state.currentSlide = currentPosition;

        let relativeCurrentPosition =
          change * this.config.options.slidesToScroll +
          this.state.relativeCurrentSlide;

        relativeCurrentPosition = Math.max(
          Math.min(
            relativeCurrentPosition,
            this.state.maxInfiniteSlidePosition,
          ),
          this.state.minInfiniteSlidePosition,
        );

        this.state.relativePreviousSlide = this.state.relativeCurrentSlide;

        this.state.relativeCurrentSlide = relativeCurrentPosition;
      } else {
        let currentPosition = change + this.state.currentSlide;
        currentPosition = Math.max(
          Math.min(currentPosition, this.state.maxSlidePosition),
          this.state.minSlidePosition,
        );
        this.state.previousSlide = this.state.currentSlide;
        this.state.currentSlide = currentPosition;
      }
    }),
  );

  const changeSlide = this.bus.triggers.changeSlide.pipe(
    map((newPosition) => {
      this.state.previousSlide = this.state.currentSlide;
      this.state.relativePreviousSlide = this.state.relativeCurrentSlide;

      newPosition = Math.max(
        Math.min(newPosition, this.state.maxSlidePosition),
        this.state.minSlidePosition,
      );
      this.state.currentSlide = newPosition;
      this.state.relativeCurrentSlide =
        newPosition * this.config.options.slidesToScroll;
    }),
  );

  merge(incrementSlide, changeSlide).subscribe(() => {
    if (this.config.options.isInfinite) {
      if (
        this.state.relativeCurrentSlide >= this.state.maxInfiniteSlidePosition
      ) {
        this.state.relativePreviousSlide =
          this.state.minInfiniteSlidePosition + this.state.scrollVsShowDiff;
        this.state.relativeCurrentSlide = 0;

        this.bus.events.infiniteLoop.next();
      } else if (
        this.state.relativeCurrentSlide < this.state.minSlidePosition
      ) {
        this.state.relativePreviousSlide = this.state.maxInfiniteSlidePosition;
        this.state.relativeCurrentSlide =
          this.state.maxInfiniteSlidePosition -
          this.config.options.slidesToScroll;

        this.bus.events.infiniteLoop.next();
      }
    }

    requestAnimationFrame(() => {
      this.bus.events.slideChange.next(this);
    });
  });
}
