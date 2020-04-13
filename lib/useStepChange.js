import { useEffect, useMemo, useState } from 'react'
import useBackdrop from './useBackdrop'
import smartScroll from './smartScroll'
import { TourStatus } from './constants'

/**
 * This hook manages transitions between steps. 
 * It fetches the data for the next step, and fires events **in the proper order**.
 * It also configures the backdrop if it's used.
 */
export default tour => {
  const backdrop = useBackdrop({
    enabled: false,
    classPrefix: tour.getConfig('backdropClassName') || 'tour-backdrop'
  })

  useEffect(() => {
    (async () => {
      const status = tour.getStatus()
      const steps = tour.getSteps()
      const currentStep = tour.getCurrentStep()
      const previousStep = tour.getPreviouslyShownStep()
      const stepPointer = tour.getStepPointer()
      const stepOrder = tour.getStepOrder()    
      const popoverRef = tour.getPopoverRef() || {}
  
      // handle the previous step being hidden
      if (previousStep && previousStep.getConfig('onHide') && !currentStep) {
        await previousStep.getConfig('onHide')()
      }
      
      // hide the backdrop when transitioning from a step with a backdrop to a step without a backdrop
      if (previousStep && currentStep && previousStep.getConfig('hasBackdrop') && !currentStep.getConfig('hasBackdrop')) {
        backdrop.hide()        
      }

      // set the current step if pointer has changed
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
   
      // handle the next step being shown
      if (currentStep && status === TourStatus.ON) {  
        if (currentStep.getConfig('onShow')) {
          await currentStep.getConfig('onShow')() 
        }        

        if (currentStep.ref.current && popoverRef.current) {        
          smartScroll(currentStep.ref.current, popoverRef.current, {
            scrollOffsets: currentStep.getConfig('scrollOffsets')
          })
        }
        
        // configure the backdrop for this step
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
      }

      // hide the backdrop when the tour is paused or ended
      if (status !== TourStatus.ON && backdrop) {
        backdrop.hide()
      }
    })()    
  }, [
    tour.getPreviouslyShownStep(), 
    tour.getCurrentStep(), 
    tour.getStepPointer(), 
    tour.getStatus(), 
    tour.getPopoverRef(),
    backdrop,
  ])
}
