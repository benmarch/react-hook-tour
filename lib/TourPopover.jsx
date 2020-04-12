import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import useTour from './useTour'

export default props => {
  const { tour } = useTour()
  const step = tour.currentStep
  const [ popperElement, setPopperElement ] = React.useState(null)
  const [ arrowElement, setArrowElement ] = useState(null)
  const popper = usePopper(step.ref.current, popperElement, {
    placement: step.getConfig('placement'),
    modifiers: [
      { 
        name: 'arrow', 
        options: { 
          element: arrowElement 
        } 
      },
      {
        name: 'offset',
        options: {
          offset: [0, step.getConfig('offset') || 0]
        }
      }
    ],
  })

  const templateProps = {
    tour,
    step,
    updatePopover: popper.update,
    arrowRef: setArrowElement,
    arrowStyles: popper.styles.arrow,
    popoverConfig: popper.state,
  }

  let popoverTemplate = null
  if (step.getConfig('component')) {
    popoverTemplate = React.createElement(step.getConfig('component'), templateProps)
  } else if (step.getConfig('template')) {
    popoverTemplate = step.getConfig('component')
  }

  return (
    <div ref={setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
      {popoverTemplate}
    </div>
  )
}
