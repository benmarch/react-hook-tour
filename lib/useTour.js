import { useContext } from 'react'
import { TourContext } from './TourProvider'

/**
 * A hook to provide access to the current tour controller
 */
export default () => {
  return useContext(TourContext)
}
