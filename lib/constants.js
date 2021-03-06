// action types:
export const START = 'START'
export const END = 'END'
export const PAUSE = 'PAUSE'
export const RESUME = 'RESUME'
export const SET_STEP_POINTER = 'SET_STEP_POINTER'
export const SET_CURRENT_STEP = 'SET_CURRENT_STEP'
export const ADD_STEP = 'ADD_STEP'
export const REMOVE_STEP = 'REMOVE_STEP'
export const SET_ORDER = 'SET_ORDER'
export const SET_CUSTOM_STATE = 'SET_CUSTOM_STATE'
export const WAIT_FOR = 'WAIT_FOR'
export const SET_POPOVER_REF = 'SET_POPOVER_REF'

export const defaultTourConfig = {
  name: '',
  stepOrder: null,
  isModal: false,
  hasBackdrop: false,
  placement: 'bottom',
  offset: 0,
  skid: 0,
  popover: {
    Component: null,
    template: null,
    className: 'tour-popover',
    modalStyles: null,
  },
  backdrop: {
    classPrefix: 'tour-backdrop',  
  },  
  onStart: null,
  onEnd: null,
  onPause: null,
  onResume: null,
  onNext: null,
  onPrev: null,
  onStepAdded: null,
  onStepRemoved: null,
}

export const TourStatus = {
  OFF: 0,
  ON: 1,
  PAUSED: 2,
  WAITING: 3
}

export const StepConfigType = {
  NAME: Symbol('NAME'),           // step config is just a string representing the step name
  PREDEFINED: Symbol('PREDEF'),       // a predefined step config (has not been "used" yet) 
  FULL: Symbol('FULL'),           // represents a fully configured and "used" step
  ASYNC: Symbol('ASYNC'),         // configures an asynchronous step, contains a "fetch" method
  INVALID: Symbol('INVALID'),     // invalid config
}

