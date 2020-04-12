import { useEffect } from 'react'
import { TourStatus } from './constants'

const hideStep = (step) => {
  if (step && step.ref.current) {
    step.ref.current.style.border = 'none'
  }  
}

const showStep = (step) => {
  if (step && step.ref.current) {
    step.ref.current.style.border = '1px solid red'        
  }
}

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

        hideStep(previousStep)
      }
  
      if (currentStep && currentStep.ref.current && status === TourStatus.ON) {  
        showStep(currentStep)

        if (currentStep.onShow) {
          // temporary
          setTimeout(() => {
            currentStep.onShow() 
          }, 50)
        }
      }
      
      if (status === TourStatus.PAUSED) {      
        hideStep(currentStep)
      }
    })()
    
  }, [tourState.previouslyShownStep, tourState.currentStep, tourState.status])
}
