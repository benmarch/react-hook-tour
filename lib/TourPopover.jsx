import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import useTour from './useTour'

export default props => {
  const { tour } = useTour()
  const [popperElement, setPopperElement] = React.useState(null)
  const [arrowElement, setArrowElement] = useState(null)
  const { styles, attributes } = usePopper(tour.currentStep.ref.current, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  })

  return (
    <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
      Popper element
      <div ref={setArrowElement} style={styles.arrow}>^</div>
    </div>
  )
}
