import React, { useEffect } from 'react'
import { TourStatus } from './constants'

export default tour => {
  useEffect(() => {
    (async () => {
      const status = tour.getStatus()
      const steps = tour.getSteps()
      const currentStep = tour.getCurrentStep()
      const previousStep = tour.getPreviouslyShownStep()
      const stepPointer = tour.getStepPointer()
      const stepOrder = tour.getStepOrder()
      const navAction = tour.getNavigationAction()
  
      if (previousStep && previousStep.ref.current) {
        if (navAction === 'prev' && previousStep.onPrev) {
          await previousStep.onPrev()
        }

        if (navAction === 'next' && previousStep.onNext) {
          await previousStep.onNext()
        }

        if (previousStep.onHide) {
          await previousStep.onHide()
        }
      }

      if (status === TourStatus.ON && !currentStep) {
        const nextStep = stepOrder[stepPointer]

        if (nextStep) {
          if (steps[nextStep]) {
            tour.setCurrentStep(steps[nextStep])
          } else if (steps[nextStep.name]) {
            tour.setCurrentStep(steps[nextStep.name])
          } else if (nextStep.fetch) {
            tour.waitForStep(nextStep.name)
            nextStep.fetch(tour)
          }
        }
      }
   
      if (currentStep && currentStep.ref.current && status === TourStatus.ON) {  
        if (currentStep.onShow) {
          // temporary
          setTimeout(() => {
            currentStep.onShow() 
          }, 50)
        }
      }
    })()
    
  }, [tour.getPreviouslyShownStep(), tour.getCurrentStep(), tour.getStepPointer(), tour.getStatus()])
}
