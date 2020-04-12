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
  const triggerEvent = async eventName => {
    if (selectors.getConfig(eventName)) {
      await selectors.getConfig(eventName)()
    }
    
    const currentStep = selectors.getCurrentStep()
    if (currentStep && currentStep[eventName]) {
      await currentStep[eventName]()
    }
  }

  const start = async () => {
    if (selectors.getStatus() === TourStatus.OFF) {
      await triggerEvent('onStart')

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
      await triggerEvent('onEnd')

      dispatch({
        type: END
      })
    }
  }
  
  const pause = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      await triggerEvent('onPause')

      dispatch({
        type: PAUSE
      })
    }
  }
  
  const resume = async () => {
    if (selectors.getStatus() === TourStatus.PAUSED) {
      await triggerEvent('onResume')

      dispatch({
        type: RESUME
      })
    }
  }
  
  const next = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      await triggerEvent('onNext')

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
      await triggerEvent('onPrev')

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
    await triggerEvent('onStepAdded')

    dispatch({
      type: ADD_STEP,
      data: stepConfig,
    })
  }
  
  const removeStep = async (stepConfig) => {
    await triggerEvent('onStepRemoved')

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

