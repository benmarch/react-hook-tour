import './App.scss'
import React from 'react'
import { TourProvider } from '../lib'
import TourPage from './TourPage'
import PopoverTemplate from './PopoverTemplate'

const stepOrder = [
  'welcome',
  'pageHeader',
  'title',
  'menuButton',
  'logo',
  {
    name: 'lazy',
    fetch: (tour) => {
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
]

export default props => {
  return (
    <TourProvider config={{
      name: 'Example Tour',
      stepOrder,
      component: PopoverTemplate,
      offset: 10,
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
    }}>
      <TourPage />
    </TourProvider>
  )
}
