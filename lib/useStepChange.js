import { useEffect } from 'react'
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
  
      // previous step is hidden now
      if (previousStep && previousStep.getConfig('onHide') && !currentStep) {
        await previousStep.getConfig('onHide')()
      }

      // if the pointer changed, set the current step
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
   
      // current step is shown now
      if (currentStep && currentStep.getConfig('onShow') && status === TourStatus.ON) {  
        // temporary
        setTimeout(() => {
          currentStep.getConfig('onShow')() 
        }, 50)
      }
    })()
    
  }, [tour.getPreviouslyShownStep(), tour.getCurrentStep(), tour.getStepPointer(), tour.getStatus()])
}
