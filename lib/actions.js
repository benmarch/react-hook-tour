import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_CURRENT_STEP,
  SET_STEP_POINTER,  
  WAIT_FOR,
  SET_CUSTOM_STATE,
  TourStatus, 
}  from './constants'

export default (selectors, dispatch) => {
  const start = async () => {
    if (selectors.getStatus() === TourStatus.OFF) {
      if (selectors.getConfig('onStart')) {
        await selectors.getConfig('onStart')()
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
  
  const end = async () => {
    if (selectors.getStatus() !== TourStatus.OFF) {
      if (selectors.getConfig('onEnd')) {
        await selectors.getConfig('onEnd')()
      }
      dispatch({
        type: END
      })
    }
  }
  
  const pause = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      if (selectors.getConfig('onPause')) {
        await selectors.getConfig('onPause')()
      }
      dispatch({
        type: PAUSE
      })
    }
  }
  
  const resume = async () => {
    if (selectors.getStatus() === TourStatus.PAUSED) {
      if (selectors.getConfig('onResume')) {
        await selectors.getConfig('onResume')()
      }
      dispatch({
        type: RESUME
      })
    }
  }
  
  const next = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      if (selectors.getConfig('onNext')) {
        await selectors.getConfig('onNext')()
      }
      dispatch({
        type: SET_STEP_POINTER,
        data: {
          index: selectors.getStepPointer() + 1,
          action: 'next'
        },
      })
    }
  }
  
  const prev = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      if (selectors.getConfig('onPrev')) {
        await selectors.getConfig('onPrev')()
      }
      dispatch({
        type: SET_STEP_POINTER,
        data: {
          index: selectors.getStepPointer() - 1,
          action: 'prev'
        },
      })
    }
  }
  
  const addStep = async (stepConfig) => {
    if (selectors.getConfig('onStepAdded')) {
      await selectors.getConfig('onStepAdded')(stepConfig)
    }
    dispatch({
      type: ADD_STEP,
      data: stepConfig,
    })
  }
  
  const removeStep = async (stepConfig) => {
    if (selectors.getConfig('onStepRemoved')) {
      await selectors.getConfig('onRemoved')(stepConfig)
    }
    dispatch({
      type: REMOVE_STEP,
      data: stepConfig,
    })
  } 

  const setCurrentStep = step => {
    dispatch({
      type: SET_CURRENT_STEP,
      data: step
    })
  }

  const waitForStep = stepName => {
    dispatch({
      type: WAIT_FOR,
      data: stepName
    })
  }
  
  const setCustomState = (customState) => {
    dispatch({
      type: SET_CUSTOM_STATE,
      data: customState,
    })
  }

  return {
    start,
    end,
    pause,
    resume,
    next,
    prev,
    addStep,
    removeStep,
    setCurrentStep,
    waitForStep,
    setCustomState,
  }
}

