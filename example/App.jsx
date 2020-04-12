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
      offset: 10
    }}>
      <TourPage />
    </TourProvider>
  )
}
