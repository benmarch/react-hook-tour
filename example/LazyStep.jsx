import React from 'react'
import { useTour } from '../lib'

/**
 * This step is not loaded with the initial page. 
 * The tour waits for it to load before positioning the popover
 */
export default props => {
  const { registerStep } = useTour()

  const lazyStep = registerStep({
    name: 'lazy',
    title: 'Lazy Step',
    content: 'I loaded late...',
    onNext() {
      console.log('Lazy Next')
    },
    onPrev() {
      console.log('Lazy Prev')
    },
    onShow() {
      console.log('Lazy Shown')
    },
    onHide() {
      console.log('Lazy Hidden')
    }
  })

  return (
    <div ref={lazyStep}>Lazy Step target</div>
  )
}
