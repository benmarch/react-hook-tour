import React, { useReducer, useEffect } from 'react'
import generateActions from './actions'
import reducer, { initialState, generateSelectors } from './reducer'
import { getStepConfigType } from './utils'
import { TourStatus, StepConfigType } from './constants'
import useStepChange from './useStepChange'
import TourPopover from './TourPopover'

export const TourContext = React.createContext()

export default props => {
  const tourConfig = props.config
  
  // initialize steps
  const steps = {}
  tourConfig.stepOrder.forEach((stepConfig, i) => {
    switch (getStepConfigType(stepConfig)) {
      case StepConfigType.INVALID: {
        throw new Error(`Step configuration at position ${i} is not valid.`)
      }
      case StepConfigType.PREDEF: {
        steps[stepConfig.name] = stepConfig
        break
      }
    }
  })

  // The reducer manages the state of the tour.
  // The selectors allow state to be retrieved.
  // The actions allow state to be manipulated.
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    steps,
    stepOrder: tourConfig.stepOrder,
    tourConfig
  })
  const selectors = generateSelectors(state)
  const allSelectors = {
    ...selectors.public,
    ...selectors.protected,
  }
  const actions = generateActions(allSelectors, dispatch)
  const allActions = {
    ...actions.public,
    ...actions.protected,
  }

  // construct the Tour
  const tourController = {
    ...allSelectors,
    ...allActions,
    public: {
      ...selectors.public,
      ...actions.public
    }
  }

  useEffect(() => {
    if (tourConfig.debug && console) {
      console.log({
        'react-hook-tour': {
          state,
          tourController
        }
      })
    }
  }, [state])

  // listen for step transitions and properly handle them
  useStepChange(tourController)

  const shouldShowPopover = tourController.getStatus() === TourStatus.ON && !!tourController.getCurrentStep() 

  return (    
    <TourContext.Provider value={tourController}>
      <div style={{position: 'relative'}}>
        {props.children}
        {shouldShowPopover && <TourPopover tour={tourController} />}
      </div>      
    </TourContext.Provider>
  )
}
