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
} from './actions'
import reducer, { initialState } from './reducer'

export default tourConfig => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...tourConfig,
  })
  
  useStepChange(state)

  return {
    ...state,
    start: start(state, dispatch),
    end: end(state, dispatch),
    pause: pause(state, dispatch),
    resume: resume(state, dispatch),
    next: next(state, dispatch),
    prev: prev(state, dispatch),
    addStep: addStep(state, dispatch),
    removeStep: removeStep(state, dispatch),
  }
}
