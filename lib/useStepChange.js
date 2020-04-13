import { useEffect, useMemo, useState } from 'react'
import useBackdrop from './useBackdrop'
import { TourStatus } from './constants'

export default tour => {
  const backdrop = useBackdrop(tour)

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
      
      // transition from backdrop to no backdrop
      if (previousStep && currentStep && previousStep.getConfig('hasBackdrop') && !currentStep.getConfig('hasBackdrop')) {
        backdrop.hide()        
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
      if (currentStep && status === TourStatus.ON) {  
        // temporary
        setTimeout(async () => {
          if (currentStep.getConfig('onShow')) {
            await currentStep.getConfig('onShow')() 
          }        
          
          if (backdrop && currentStep.getConfig('hasBackdrop') && currentStep.ref.current) {  
            if (currentStep.getConfig('isModel')) {
              backdrop.setOptions({
                fullScreen: true,
                classPrefix: currentStep.getConfig('backdropClassName') || 'tour-backdrop'
              })
            } else {
              backdrop.setOptions({
                fullScreen: false,
                classPrefix: currentStep.getConfig('backdropClassName') || 'tour-backdrop'
              })
            }            
            backdrop.position(currentStep.ref.current)    
            backdrop.show()
          }
        }, 50)
      }

      // hide the backdrop
      if (status !== TourStatus.ON && backdrop) {
        backdrop.hide()
      }
    })()    
  }, [tour.getPreviouslyShownStep(), tour.getCurrentStep(), tour.getStepPointer(), tour.getStatus(), backdrop])
}
