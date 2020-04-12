import React from 'react'
import useTourController from './useTourController'

export const TourContext = React.createContext()

export default props => {
  const tourController = useTourController(props.config)

  return (
    <TourContext.Provider value={tourController}>
      {props.children}
    </TourContext.Provider>
  )
}
