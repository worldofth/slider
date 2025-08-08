// [+] if slide change by autoplay, take off live region stuff but keep changeing the text
// [+] if focusin pause (in accessibility add a new bus trigger for focusin and out)
// [+] if hover pause
// [+] on unpause reset scan to 0
// [+] intersection observer pauser

import { BehaviorSubject, fromEvent, interval, NEVER } from 'rxjs';
import { switchMap, scan, filter } from 'rxjs/operators';

export const Autoplay = {
  name: 'autoplay',
  config: {
    options: {
      autoplay: false,
      autoplaySpeed: 4500,
      disablePausers: false,
      autoplayReverse: false,
    },
  },
  state: {
    paused: false,
    pauser: null,
    resetTicker: false,
    autoplayObservable: false,
    intersectionObserver: false,
    hasIntersected: false,
  },
  setupEvents: {
    order: 0,
    fnc: setupEvents,
  },
  teardownEvents,
  subscribeToEvents,
};

function subscribeToEvents() {
  this.bus.events.disabled.subscribe(disabled.bind(this));
}

function disabled(isDisabled) {
  if (!isDisabled) {
    return;
  }

  setupEvents.call(this);
}

function setupEvents() {
  if (!this.config.options.autoplay || this.state.isDisabled) {
    if (this.pluginState['autoplay'].autoplayObservable) {
      this.pluginState['autoplay'].pauser.next(true);
    }
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').match) {
    if (this.pluginState['autoplay'].autoplayObservable) {
      teardownEvents.call(this);
    }
    return;
  }

  const intervalLength = 10;
  const intervalObs = interval(intervalLength);

  this.pluginState['autoplay'].pauser = new BehaviorSubject(true);

  this.pluginState['autoplay'].pauser.subscribe((pause) => {
    if (!pause) {
      this.pluginState['autoplay'].resetTicker = true;
    }
  });

  this.pluginState['autoplay'].autoplayObservable = this.pluginState[
    'autoplay'
  ].pauser
    .pipe(
      switchMap((paused) => {
        if (this.pluginState['paused'] != paused) {
          this.pluginState['autoplay'].resetTicker = true;
        }

        this.pluginState['paused'] = paused;

        return paused ? NEVER : intervalObs;
      }),
      scan((acc) => {
        if (this.pluginState['autoplay'].resetTicker) {
          this.pluginState['autoplay'].resetTicker = false;
          return this.config.options.autoplaySpeed - 10;
        }

        acc += intervalLength;
        return acc;
      }, 0),
      filter(
        (timeElapsed) => timeElapsed % this.config.options.autoplaySpeed === 0,
      ),
    )
    .subscribe(() => {
      this.state.slideChangeTrigger = 'autoplay';

      if (this.config.options.autoplayReverse) {
        this.bus.triggers.incrementSlide.next(
          this.config.options.slidesToScroll * -1,
        );
      } else {
        this.bus.triggers.incrementSlide.next(
          this.config.options.slidesToScroll,
        );
      }
    });

  // focus pausers
  this.bus.triggers.focusIn.subscribe(() => {
    this.pluginState['autoplay'].pauser.next(true);
  });
  this.bus.triggers.focusOut.subscribe(() => {
    this.pluginState['autoplay'].pauser.next(false);
  });

  // hover pausers
  fromEvent(this.elements.container, 'mouseenter').subscribe(() => {
    if (!this.config.options.disablePausers) {
      this.pluginState['autoplay'].pauser.next(true);
    }
  });

  fromEvent(this.elements.container, 'mouseleave').subscribe(() => {
    if (!this.config.options.disablePausers) {
      this.pluginState['autoplay'].pauser.next(false);
    }
  });

  // intersection observer pausers
  setupInsersectionObserver.call(this, (el, entry) => {
    if (el !== this.elements.container) {
      return;
    }

    if (entry.isIntersecting && !this.pluginState['autoplay'].hasIntersected) {
      this.pluginState['autoplay'].hasIntersected = true;
      this.pluginState['autoplay'].pauser.next(false);
    } else if (
      !entry.isIntersecting &&
      this.pluginState['autoplay'].hasIntersected
    ) {
      this.pluginState['autoplay'].hasIntersected = false;
      this.pluginState['autoplay'].pauser.next(true);
    }
  });

  this.pluginState['autoplay'].intersectionObserver.observe(
    this.elements.container,
  );
}

function setupInsersectionObserver(cb) {
  this.pluginState['autoplay'].intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        cb(target, entry);
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList(),
    },
  );
}

function teardownEvents() {
  if (this.pluginState['autoplay'].autoplayObservable) {
    this.pluginState['autoplay'].autoplayObservable.unsubscribe();
  }
}

function buildThresholdList(numSteps = 100) {
  var thresholds = [];

  for (var i = 1.0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}
