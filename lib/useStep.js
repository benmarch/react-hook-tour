import { useContext, useEffect, useRef, useState } from 'react'
import { TourContext } from './TourProvider'
import { StepConfigType } from './constants'
import { getStepConfigType, get } from './utils'

/**
 * A hook that registers a new step with the tour.
 * 
 * @param {{}} stepConfig The configuration for the step
 * @returns {React.ref} A ref for placing on the target element
 * 
 */
export default stepConfig => {
  const [hasRegistered, setHasRegistered] = useState(false)
  const tour = useContext(TourContext)

  let step = {}
  switch (getStepConfigType(stepConfig)) {
    case StepConfigType.INVALID: {
      throw new Error('Attempted to use invalid step: ' + JSON.stringify(stepConfig, null, 4))
    }
    case StepConfigType.ASYNC: {
      throw new Error('Attempted to use an async step after initial config: ' + JSON.stringify(stepConfig, null, 4))
    }
    case StepConfigType.FULL: {
      if (!hasRegistered) {
        throw new Error('Attempted to reuse a step: ' + JSON.stringify(stepConfig, null, 4))
      }   
      break  
    }
    case StepConfigType.NAME: {
      if (tour.getSteps()[stepConfig]) {
        step = tour.getSteps()[stepConfig]
      } else {
        throw new Error('Attempted to use a non-existent step. Please configure this step in the tour config or in useStep(): ' + stepConfig)
      }     
      break 
    }
    case StepConfigType.PREDEFINED: {
      step = {
        ...(tour.getSteps()[stepConfig.name] || {}),
        ...stepConfig  
      }
      break    
    }
  }

  const stepRef = useRef(null)
  step.ref = stepRef
  step.getConfig = (key, defaultVal) => get(step, key, tour.getConfig(key, defaultVal))

  useEffect(() => {
    tour.addStep(step)
    setHasRegistered(true)

    return () => {
      tour.removeStep(step)
    }
  }, [])

  return stepRef
}
