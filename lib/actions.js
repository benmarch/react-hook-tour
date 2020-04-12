import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_CURRENT_STEP,
  SET_STEP_POINTER,
  SET_CUSTOM_STATE,
  WAIT_FOR,
  TourStatus, 
}  from './constants'

export const start = (state, dispatch) => async () => {
  if (state.status === TourStatus.OFF) {
    if (state.onStart) {
      await state.onStart()
    }
    dispatch({
      type: SET_STEP_POINTER,
      data: {
        index: 0,
        action: 'start'
      }
    })
    dispatch({
      type: START
    })
  }
}

export const end = (state, dispatch) => async () => {
  if (state.status !== TourStatus.OFF) {
    if (state.onEnd) {
      await state.onEnd()
    }
    dispatch({
      type: END
    })
  }
}

export const pause = (state, dispatch) => async () => {
  if (state.status === TourStatus.ON) {
    if (state.onPause) {
      await state.onPause()
    }
    dispatch({
      type: PAUSE
    })
  }
}

export const resume = (state, dispatch) => async () => {
  if (state.status === TourStatus.PAUSED) {
    if (state.onResume) {
      await state.onResume()
    }
    dispatch({
      type: RESUME
    })
  }
}

export const next = (state, dispatch) => async () => {
  if (state.status === TourStatus.ON) {
    if (state.onNext) {
      await state.onNext()
    }
    dispatch({
      type: SET_STEP_POINTER,
      data: {
        index: state.stepPointer + 1,
        action: 'next'
      },
    })
  }
}

export const prev = (state, dispatch) => async () => {
  if (state.status === TourStatus.ON) {
    if (state.onPrev) {
      await state.onPrev()
    }
    dispatch({
      type: SET_STEP_POINTER,
      data: {
        index: state.stepPointer - 1,
        action: 'prev'
      },
    })
  }
}

export const addStep = (state, dispatch) => async (stepConfig) => {
  if (state.onStepAdded) {
    await state.onStepAdded(stepConfig)
  }
  dispatch({
    type: ADD_STEP,
    data: stepConfig,
  })
}

export const removeStep = (state, dispatch) => async (stepConfig) => {
  if (state.onStepRemoved) {
    await state.onStepRemoved(stepConfig)
  }
  dispatch({
    type: REMOVE_STEP,
    data: stepConfig,
  })
} 

export const setCustomState = (state, dispatch) => (customState) => {
  dispatch({
    type: SET_CUSTOM_STATE,
    data: customState,
  })
}

export const waitForStep = (state, dispatch) => stepName => {
  dispatch({
    type: WAIT_FOR,
    data: stepName
  })
}

export const setCurrentStep = (state, dispatch) => step => {
  dispatch({
    type: SET_CURRENT_STEP,
    data: step
  })
}
