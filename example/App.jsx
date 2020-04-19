import './App.scss'
import React from 'react'
import { TourProvider } from '../lib'
import TourPage from './TourPage'
import PopoverTemplate from './PopoverTemplate'

// Define the tour configuration. 
// **NOTE:** All steps must be listed here either as strings or placeholder step configs 
const tourConfig = {
  name: 'Example Tour',
  offset: 10,
  popover: {
    Component: PopoverTemplate,  
  },
  scrollOffsets: {
    top: 100,
    left: 100,
    right: 100,
    bottom: 100,
  },
  stepOrder: [
    'welcome',
    {
      name: 'pageHeader',
      hasBackdrop: true,
      title: 'Page Header',
      content: 'Contains the header information for the page',
      onNext() {
        console.log('Page Header Next')
      },
      onPrev() {
        console.log('Page Header Prev')
      }
    },
    'title',
    'menuButton',
    'scroll',
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
