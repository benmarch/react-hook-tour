import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_CURRENT_STEP,
  SET_ORDER,
  SET_CUSTOM_STATE,
  SET_STEP_POINTER,
  WAIT_FOR,
  SET_POPOVER_REF,
  TourStatus,
  StepConfigType,
}  from './constants'
import { getStepConfigType, get } from './utils'

export const initialState = {
  status: TourStatus.OFF,         // current status of the tour (see TourStatus)
  steps: {},                      // maps the step name to the step config
  stepOrder: [],                  // sets the overall order of steps
  stepPointer: 0,                 // refers to the index in stepOrder of the current step
  currentStep: null,              // the stepConfig of the current step
  previouslyShownStep: null,      // the stepConfig of the previously shown and then hidden step (used for cleaning up and firing events)
  hasNextStep: false,             // is there a valid next step
  hasPrevStep: false,             // is there a valid previous step
  navAction: 'none',              // the latest action to navigate within the tour (start|end|pause|resume|next|prev)
  waitingFor: '',                 // the name of a step that the tour is waiting for to load before resuming
  popoverRef: null,               // a reference to the popover element
  tourConfig: {},                 // the tourConfig object passed into TourProvider
  customState: {},                // arbitrary state that users can manipulate (useful for testing or triggering updates)
}

/**
 * Checks whether a step in the step order actually exists
 * 
 * @param {{}} state 
 * @param {number} stepIndex The index in the stepOrder to check
 */
const hasStep = (state, stepIndex) => {
  const step = state.stepOrder[stepIndex]

  switch (getStepConfigType(step)) {    
    case StepConfigType.NAME: {
      return !!state.steps[step]
    }
    case StepConfigType.PREDEFINED:
    case StepConfigType.FULL: {
      return !!state.steps[step.name]
    }
    case StepConfigType.ASYNC: {
      return true
    }
  }

  return false
}

export default (state, action) => {
  switch (action.type) {
    case ADD_STEP: {
      const newState = {
        ...state,
        steps: {
          ...state.steps,
          [action.data.name]: action.data,
        },
      }

      if (state.waitingFor === action.data.name) {
        newState.status = TourStatus.ON
        newState.waitingFor = ''
      }

      return newState
    }
    case REMOVE_STEP: {
      delete state.steps[action.data.name]
      return state
    }
    case START: {
      return {
        ...state,
        status: TourStatus.ON,
        navAction: 'start',
      }
    }
    case END: {
      return {
        ...state,
        status: TourStatus.OFF,
        currentStep: null,
        previouslyShownStep: state.currentStep,
        hasNextStep: false,
        hasPrevStep: false,     
        navAction: 'end',      
      }
    }
    case PAUSE: {
      return {
        ...state,
        status: TourStatus.PAUSED,
        navAction: 'pause',
      }
    }
    case RESUME: {
      return {
        ...state,
        status: TourStatus.ON,
        navAction: 'resume',
      }
    }
    case SET_STEP_POINTER: {
      return {
        ...state,
        stepPointer: action.data.index,
        previouslyShownStep: state.currentStep,
        currentStep: null,
        hasNextStep: hasStep(state, action.data.index + 1),
        hasPrevStep: hasStep(state, action.data.index - 1),
        navAction: action.data.action,
      }
    }
    case SET_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.data,
      }
    }
    case SET_ORDER: {
      return {
        ...state,                
        stepOrder: action.data,
      }
    }
    case SET_CUSTOM_STATE: {
      return {
        ...state,
        customState: {
          ...state.customState,
          ...action.data,
        }
      }
    }
    case WAIT_FOR: {
      return {
        ...state,
        status: TourStatus.PAUSED,
        waitingFor: action.data,
      }
    }
    case SET_POPOVER_REF: {
      return {
        ...state,
        popoverRef: action.data,
      }
    }
    default: {
      return state
    }
  }
}

export const generateSelectors = (state) => ({
  public: {
    getCurrentStep: () => state.currentStep,
    getStatus: () => state.status,
    hasNextStep: () => state.hasNextStep,
    hasPreviousStep: () => state.hasPrevStep,
    getNavigationAction: () => state.navAction,
    getCustomState: () => state.customState,
    getConfig: (key, defaultVal) => get(state.tourConfig, key, defaultVal),
  },
  protected: {
    getSteps: () => state.steps,
    getPreviouslyShownStep: () => state.previouslyShownStep,
    getStepPointer: () => state.stepPointer,
    getStepOrder: () => state.stepOrder,
    getPopoverRef: () => state.popoverRef,
  },  
})
