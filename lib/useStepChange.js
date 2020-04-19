import { useEffect } from 'react'
import useBackdrop from './useBackdrop'
import smartScroll from './smartScroll'
import { TourStatus, StepConfigType } from './constants'
import { getStepConfigType } from './utils'

/**
 * This hook manages transitions between steps. 
 * It fetches the data for the next step, and fires events **in the proper order**.
 * It also configures the backdrop if it's used.
 */
export default tour => {
  const backdrop = useBackdrop({
    ...tour.getConfig('backdrop'),
    enabled: false,
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

        switch (getStepConfigType(nextStep)) {
          case StepConfigType.NAME: {
            if (steps[nextStep]) {
              tour.setCurrentStep(steps[nextStep])
            }
            break
          }
          case StepConfigType.PREDEFINED:
          case StepConfigType.FULL: {
            if (steps[nextStep.name]) {
              tour.setCurrentStep(steps[nextStep.name])
            }
            break
          }
          case StepConfigType.ASYNC: {
            if (getStepConfigType(steps[nextStep.name]) === StepConfigType.FULL) {
              tour.setCurrentStep(steps[nextStep.name])
            } else {
              tour.waitForStep(nextStep.name)
              nextStep.fetch(tour)
            }
            break
          }
        }
      }
   
      // handle the next step being shown
      if (currentStep && status === TourStatus.ON) {  
        if (currentStep.getConfig('onShow')) {
          await currentStep.getConfig('onShow')() 
        }        

        // if the step or the popover is outside the viewport, scroll them into view
        if (currentStep.ref.current && popoverRef.current) {        
          smartScroll(currentStep.ref.current, popoverRef.current, {
            scrollOffsets: currentStep.getConfig('scrollOffsets')
          })
        }
        
        // configure the backdrop for this step
        if (backdrop && currentStep.getConfig('hasBackdrop') && currentStep.ref.current) {                
          backdrop.setOptions({            
            fullScreen: !!currentStep.getConfig('isModal'),
            ...(currentStep.getConfig('backdrop')),
          })           
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
