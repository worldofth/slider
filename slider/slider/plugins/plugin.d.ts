export interface SliderPlugin {
    name: String
    config?: {
        options?: any
        classes?: any
    }
    build?: {
        order: number
        fnc: Function
    }
    setupEvents?: {
        order: number
        fnc: Function
    }
    subscribeToEvents?: Function,
    teardownEvents?: Function
}
