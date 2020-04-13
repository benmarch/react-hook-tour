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

/**
 * Generates actions for a new Tour
 */
export default (selectors, dispatch) => {
  /**
   * Triggers lifecycle events on the tour and on the current step
   * 
   * @param {string} eventName Name of event to trigger
   * @return {Promise<void>}
   */
  const triggerEvent = async eventName => {
    if (selectors.getConfig(eventName)) {
      await selectors.getConfig(eventName)()
    }
    
    const currentStep = selectors.getCurrentStep()
    if (currentStep && currentStep[eventName]) {
      await currentStep[eventName]()
    }
  }

  /**
   * Starts the tour
   */
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
  
  /**
   * Ends and resets the tour
   */
  const end = async () => {
    if (selectors.getStatus() !== TourStatus.OFF) {
      await triggerEvent('onEnd')

      dispatch({
        type: END
      })
    }
  }
  
  /**
   * Pauses the tour
   */
  const pause = async () => {
    if (selectors.getStatus() === TourStatus.ON) {
      await triggerEvent('onPause')

      dispatch({
        type: PAUSE
      })
    }
  }
  
  /**
   * Resumes the tour on the step it left off at when paused
   */
  const resume = async () => {
    if (selectors.getStatus() === TourStatus.PAUSED) {
      await triggerEvent('onResume')

      dispatch({
        type: RESUME
      })
    }
  }
  
  /**
   * Moves to the next step
   */
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
  
  /**
   * Moves to the previous step
   */
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

  /**
   * Allows for arbitrary state variable to be stored on the tour object
   * @param {{}} customState 
   */
  const setCustomState = (customState) => {
    dispatch({
      type: SET_CUSTOM_STATE,
      data: customState,
    })
  }
  
  /**
   * @protected
   * 
   * Adds a step to the tour. Used internally.
   * 
   * @param {{}} stepConfig 
   */
  const addStep = async (stepConfig) => {
    await triggerEvent('onStepAdded')

    dispatch({
      type: ADD_STEP,
      data: stepConfig,
    })
  }
  
  /**
   * @protected
   * 
   * Removes a step from the tour. Used internally.
   * 
   * @param {{}} stepConfig 
   */
  const removeStep = async (stepConfig) => {
    await triggerEvent('onStepRemoved')

    dispatch({
      type: REMOVE_STEP,
      data: stepConfig,
    })
  } 

  /**
   * @protected
   * 
   * Sets the current step of the tour. Used internally.
   * 
   * @param {{}} stepConfig 
   */
  const setCurrentStep = step => {
    dispatch({
      type: SET_CURRENT_STEP,
      data: step
    })
  }

  /**
   * @protected
   * 
   * Tells the tour to pause until a step becomes available. Used internally.
   * 
   * @param {{}} stepConfig 
   */
  const waitForStep = stepName => {
    dispatch({
      type: WAIT_FOR,
      data: stepName
    })
  }

  return {
    start,
    end,
    pause,
    resume,
    next,
    prev,
    setCustomState,
    addStep,
    removeStep,
    setCurrentStep,
    waitForStep,    
  }
}

