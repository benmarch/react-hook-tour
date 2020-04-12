import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_STEP,
  TourStatus, 
}  from './constants'

export const start = (state, dispatch) => async () => {
  if (state.status === TourStatus.OFF) {
    if (state.onStart) {
      await state.onStart()
    }
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
      type: SET_STEP,
      data: {
        step: state.nextStep,
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
      type: SET_STEP,
      data: {
        step: state.prevStep,
        action: 'prev'
      },
    })
  }
}

export const addStep = (state, dispatch) => async (stepConfig) => {
  if (!state.steps[stepConfig.name]) {
    if (state.onStepAdded) {
      await state.onStepAdded(stepConfig)
    }
    dispatch({
      type: ADD_STEP,
      data: stepConfig,
    })
  }
}

export const removeStep = (state, dispatch) => async (stepConfig) => {
  if (state.steps[stepConfig.name]) {
    if (state.onStepRemoved) {
      await state.onStepRemoved(stepConfig)
    }
    dispatch({
      type: REMOVE_STEP,
      data: stepConfig,
    })
  }
} 
