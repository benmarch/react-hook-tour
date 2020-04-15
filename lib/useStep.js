import { useContext, useEffect, useRef } from 'react'
import { TourContext } from './TourProvider'

/**
 * A hook that registers a new step with the tour.
 * 
 * @param {{}} stepConfig The configuration for the step
 * @returns {React.ref} A ref for placing on the target element
 * 
 */
export default stepConfig => {
  const tour = useContext(TourContext)

  const stepRef = useRef(null)
  stepConfig.ref = stepRef
  stepConfig.getConfig = key => {
    return stepConfig[key] || tour.getConfig(key)
  }

  useEffect(() => {
    tour.addStep(stepConfig)

    return () => {
      tour.removeStep(stepConfig)
    }
  }, [])

  return stepRef
}
