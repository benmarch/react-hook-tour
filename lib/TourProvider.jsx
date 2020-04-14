import React from 'react'
import useTourController from './useTourController'
import { TourStatus } from './constants'
import TourPopover from './TourPopover'

export const TourContext = React.createContext()

export default props => {
  const tourController = useTourController(props.config)
  const shouldShowPopover = tourController.getStatus() === TourStatus.ON && !!tourController.getCurrentStep() 

  return (    
    <TourContext.Provider value={tourController}>
      <div style={{position: 'relative'}}>
        {props.children}
        {shouldShowPopover && <TourPopover />}
      </div>      
    </TourContext.Provider>
  )
}
