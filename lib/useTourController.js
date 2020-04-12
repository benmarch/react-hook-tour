import React, { useReducer, useDebugValue } from 'react'
import useStepChange from './useStepChange'
import {
    start,
    end,
    pause,
    resume,
    next,
    prev,
    addStep,
    removeStep,
    setCustomState,
    setCurrentStep,
    waitForStep,
} from './actions'
import reducer, { initialState } from './reducer'

export default tourConfig => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...tourConfig,
  })

  const tourController = {
    ...state,

    getSteps: () => state.steps,
    getCurrentStep: () => state.currentStep,
    getPreviouslyShownStep: () => state.getPreviouslyShownStep,
    getStepPointer: () => state.stepPointer,
    getStepOrder: () => state.stepOrder,
    getStatus: () => state.status,
    hasNextStep: () => state.hasNextStep,
    hasPreviousStep: () => state.hasPrevStep,
    getNavigationAction: () => state.navAction,

    start: start(state, dispatch),
    end: end(state, dispatch),
    pause: pause(state, dispatch),
    resume: resume(state, dispatch),
    next: next(state, dispatch),
    prev: prev(state, dispatch),
    addStep: addStep(state, dispatch),
    removeStep: removeStep(state, dispatch),
    setCustomState: setCustomState(state, dispatch),
    setCurrentStep: setCurrentStep(state, dispatch),
    waitForStep: waitForStep(state, dispatch)
  }
  
  useStepChange(tourController)

  return tourController
}
