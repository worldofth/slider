import { of } from 'rxjs'

export default {
    id: 'example',
    config: {
        options: {},
        classes: {},
        exampleConfig: {} // custom config
    },
    pluginState: {
        // plugin specific state
        exampleState: true, // can be accesed this.pluginState.example.exampleState
        exampleSubscription: null
    },
    busSubscribe,
    events: function() {
        // this == slider

        // add extra events to the events object of the slider
        return {
            example: of(1)
        }
    },
    slideChangeEvents: () => {
        // this == slider

        return of(1)
        // need to return an observable that maps to a slide position
    },
    transitionEndEvent: () => {
        // this == slider

        return of(1)
        // returns an observable for transition end events
    }
}

// subsribe to tracks on the bus
function busSubscribe() {
    // bus events pass a reference of the slider
    // allowing you to set the context of your calls to the slider or the context of init
    // the passed slider ref is most useful when subscribing to events outside of the slider
    // this.bus.setup.subscribe(slider => ...)

    // exmaple
    this.bus.eventsUnSub.subscribe(eventsUnSub.bind(this))
    this.bus.eventsSub.subscribe(eventsSub.bind(this))

    // Tracks on the bus
    // --------------------
    // setup - called after initial dom has been gathered
    // build - called after setup, used for adding extra dom to the slider
    // postSetup - used subscribe to events, and turn off features based on current config
    // preUpdate - called before update
    // update - called every slide change, before animation
    // eventsUnSub - unsubscribe from custom events, so we don't subsribe multiple times
    // eventsSub - (re) subscribe to custom events, so we don't subsribe multiple times
    // postUpdate - called after update
    // applyAnimation - animation tracks to turn on and off animation
    // reduceAnimation - reduce animation sets it to a duration of 1ms so we can still trigger transiiton end
    // removeAnimation - turns off animation so we don't trigger transition end
    // slideChange - allows you to manully change the slide to the specific position
    // transitionEnd - slide change after animation
}

function eventsUnSub() {
    this.pluginState.example.exampleSubscription &&
        this.pluginState.example.exampleSubscription.unsubscribe()
}

function eventsSub() {
    this.pluginState.example.exampleSubscription = this.events.example.subscribe(console.log)
}
