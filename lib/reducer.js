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
  TourStatus,
}  from './constants'

export const initialState = {
  status: TourStatus.OFF,
  steps: {},
  stepOrder: [],
  stepPointer: 0,
  currentStep: null,
  previouslyShownStep: null,
  hasNextStep: false,
  hasPrevStep: false,
  navAction: 'none',
  customState: {},
  waitingFor: '',
}

const hasStep = (state, stepIndex) => {
  const step = state.stepOrder[stepIndex]

  if (!step) {
    return false
  }
  
  if (typeof step === 'string') {
    return state.steps[step]
  }

  if (typeof step === 'object') {
    return !!step.fetch
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
    default: {
      return state
    }
  }
}

export const generateSelectors = (state) => ({
  getSteps: () => state.steps,
  getCurrentStep: () => state.currentStep,
  getPreviouslyShownStep: () => state.previouslyShownStep,
  getStepPointer: () => state.stepPointer,
  getStepOrder: () => state.stepOrder,
  getStatus: () => state.status,
  hasNextStep: () => state.hasNextStep,
  hasPreviousStep: () => state.hasPrevStep,
  getNavigationAction: () => state.navAction,
  getCustomState: () => state.customState,
  getConfig: key => state[key],
})
