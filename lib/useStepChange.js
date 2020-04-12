import React, { useEffect } from 'react'
import { TourStatus } from './constants'

export default tourState => {
  useEffect(() => {
    (async () => {
      const status = tourState.status
      const currentStep = tourState.currentStep
      const previousStep = tourState.previouslyShownStep
  
      if (previousStep && previousStep.ref.current) {
        if (tourState.isPrev && previousStep.onPrev) {
          await previousStep.onPrev()
        }

        if (tourState.isNext && previousStep.onNext) {
          await previousStep.onNext()
        }

        if (previousStep.onHide) {
          await previousStep.onHide()
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
    
  }, [tourState.previouslyShownStep, tourState.currentStep, tourState.status])
}
