import { useContext, useEffect, useRef } from 'react'
import { TourContext } from './TourProvider'

/**
 * Generates a function that allows steps to be registered with a tour.
 * The register function takes a stepConfig object and returns a ref.
 */
const createRegisterStep = tour => stepConfig => {
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

/**
 * The primary export of react-hook-tour.
 * Provides access to the current tour, and allows for steps to be registered
 */
export default () => {
  const tour = useContext(TourContext)

  return {
    tour,
    registerStep: createRegisterStep(tour),
  }
}
