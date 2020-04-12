import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_STEP,
  SET_ORDER,
  TourStatus,
}  from './constants'

export const initialState = {
  status: TourStatus.OFF,
  steps: {},
  stepOrder: [],
  currentStep: null,
  nextStep: null,
  prevStep: null,
  previouslyShownStep: null,
  isNextAction: false,
  isPrevAction: false,
}

const getNextStep = (state) => {
  if (state.currentStep) {
    let stepIndex = state.stepOrder.indexOf(state.currentStep.name)
    
    do {
      stepIndex += 1
      if (state.steps[state.stepOrder[stepIndex]]) {
        return state.steps[state.stepOrder[stepIndex]]
      }
    } while (stepIndex < state.stepOrder.length)      
  }    
}

const getPreviousStep = (state) => {
  if (state.currentStep) {
    let stepIndex = state.stepOrder.indexOf(state.currentStep.name)
    
    do {
      stepIndex -= 1
      if (state.steps[state.stepOrder[stepIndex]]) {
        return state.steps[state.stepOrder[stepIndex]]
      }
    } while (stepIndex >= 0)      
  }    
}

export default (state, action) => {
  switch (action.type) {
    case ADD_STEP: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.data.name]: action.data,
        },
      }
    }
    case REMOVE_STEP: {
      delete state.steps[action.data.name]
      return state
    }
    case START: {
      const newState = {
        ...state,
        status: TourStatus.ON,
        currentStep: state.steps[state.stepOrder[0]],
        previouslyShownStep: null,
      }

      newState.nextStep = getNextStep(newState)
      newState.prevStep = getPreviousStep(newState)
      
      return newState
    }
    case END: {
      return {
        ...state,
        status: TourStatus.OFF,
        currentStep: null,
        nextStep: null,
        prevStep: null, 
        previouslyShownStep: state.currentStep,
      }
    }
    case PAUSE: {
      return {
        ...state,
        status: TourStatus.PAUSED,
      }
    }
    case RESUME: {
      return {
        ...state,
        status: TourStatus.ON,
      }
    }
    case SET_STEP: {
      const newState = {
        ...state,
        currentStep: action.data.step,
        previouslyShownStep: state.currentStep,
        isNextAction: action.data.action === 'next',
        isPrevAction: action.data.action === 'prev'
      }

      newState.nextStep = getNextStep(newState)
      newState.prevStep = getPreviousStep(newState)

      return newState
    }
    case SET_ORDER: {
      return {
        ...state,
        stepOrder: action.data,
      }
    }
    default: {
      return state
    }
  }
}
