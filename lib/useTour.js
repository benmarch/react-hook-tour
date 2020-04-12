import { useContext, useEffect, useRef } from 'react'
import { TourContext } from './TourProvider'

export default () => {
  const tour = useContext(TourContext)

  const registerStep = stepConfig => {
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

  return {
    tour,
    registerStep,
  }
}
