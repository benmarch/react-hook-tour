import React, { useRef } from 'react'
import useTourController from './useTourController'
import { TourStatus } from './constants'
import TourPopover from './TourPopover'

export const TourContext = React.createContext()

export default props => {
  const tourController = useTourController(props.config)

  const shouldShowPopover = tourController.getStatus() === TourStatus.ON && tourController.getCurrentStep() 

  return (
    <TourContext.Provider value={tourController}>
      {props.children}
      {shouldShowPopover && <TourPopover />}
    </TourContext.Provider>
  )
}
