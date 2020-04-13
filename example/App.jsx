import './App.scss'
import React from 'react'
import { TourProvider } from '../lib'
import TourPage from './TourPage'
import PopoverTemplate from './PopoverTemplate'

// Define the tour configuration. 
// **NOTE:** All steps must be listed here either as strings or placeholder step configs 
const tourConfig = {
  name: 'Example Tour',
  PopoverComponent: PopoverTemplate,
  offset: 10,
  stepOrder: [
    'welcome',
    'pageHeader',
    'title',
    'menuButton',
    'logo',
    {
      name: 'lazy',
      fetch: (tour) => {
        // this is contrived logic to delay showing and hiding the step
        setTimeout(() => {
          tour.setCustomState({
            showLazy: true
          })
  
          setTimeout(() => {
            tour.setCustomState({
              showLazy: false
            })
          }, 5000)
        }, 1000)    
      }
    },
    'subhead',
    'configOptions',
    'controls',
  ],
  onStart() {
    console.log('Tour start')
  },
  onPause() {
    console.log('Tour pause')
  },
  onResume() {
    console.log('Tour resume')
  },
  onEnd() {
    console.log('Tour end')
  },
  onNext() {
    console.log('Tour next')
  },
}

export default props => {
  return (
    <TourProvider config={tourConfig}>
      <TourPage />
    </TourProvider>
  )
}
