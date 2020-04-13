import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import useTour from './useTour'

const modalVirtualElement = {
  getBoundingClientRect() {
    return {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
  }
}

export default props => {
  const { tour } = useTour()
  const step = tour.getCurrentStep()

  const [ popperElement, setPopperElement ] = React.useState(null)
  const [ arrowElement, setArrowElement ] = useState(null)

  const popper = usePopper(step.getConfig('isModal') === true ? modalVirtualElement : step.ref.current, popperElement, {
    placement: step.getConfig('placement'),
    strategy: step.getConfig('isModal') ? 'fixed' : 'absolute',
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

  const popoverStyles = step.getConfig('isModal') ? {
    position: 'absolute',
    top: '50vh',
    left: '50vw',
    transform: 'translate(-50%, -50%)'
  } : popper.styles.popper

  return (
    <div ref={setPopperElement} className={step.getConfig('popoverClassName') || 'tour-popover'} style={popoverStyles} {...popper.attributes.popper}>
      {popoverTemplate}
    </div>
  )
}
