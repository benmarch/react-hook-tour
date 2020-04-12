import React from 'react'
import { useTour } from '../lib'

export default props => {
  const { registerStep } = useTour()

  const lazyStep = registerStep({
    name: 'lazy',
    title: 'Lazy Step',
    content: 'I loaded late...'
  })

  return (
    <div ref={lazyStep}>Lazy Step target</div>
  )
}
