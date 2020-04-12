import React from 'react'
import { TourProvider } from '../lib'
import TourPage from './TourPage'

const stepOrder = [
  'pageHeader',
  'title',
  'menuButton',
  'subhead',
  'configOptions',
  'controls',
]

export default props => {
  return (
    <TourProvider config={{
      name: 'Example Tour',
      stepOrder
    }}>
      <TourPage />
    </TourProvider>
  )
}
