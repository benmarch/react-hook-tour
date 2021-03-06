import './PopoverTemplate.scss'
import React, { useEffect } from 'react'

export default props => {
  const { tour, step, updatePopover, popoverConfig, arrowRef, arrowStyles } = props

  // allows the popover to recalculate position after the template loads
  useEffect(() => {
    if (updatePopover) {
      updatePopover()
    }
  }, [updatePopover])

  // The arrow styles only contain the bare minimum styles to align the arrow.
  // We have to extend them to orient it properly.
  // There are additional styles in the scss file.
  const adjustedArrowStyles = {
    ...arrowStyles,
    display: step.isModal ? 'none' : 'block',
  }

  if (popoverConfig) {
    switch (popoverConfig.placement) {
      case 'bottom': {
        adjustedArrowStyles.marginTop = '1px'
        adjustedArrowStyles.transform += ' translateY(-50%) rotate(-135deg)'
        break
      }
      case 'top': {
        adjustedArrowStyles.top = '100%'      
        adjustedArrowStyles.backgroundColor = '#fff'
        adjustedArrowStyles.transform += ' translateY(-50%) rotate(45deg)'
        break
      }
      case 'left': {
        adjustedArrowStyles.left = '100%'
        adjustedArrowStyles.backgroundColor = '#fff'
        adjustedArrowStyles.transform += ' translateX(-50%) rotate(-45deg)'
        break
      }
      case 'right': {            
        adjustedArrowStyles.backgroundColor = '#fff'
        adjustedArrowStyles.transform += ' translateX(-50%) rotate(135deg)'
        break
      }
    }
  } 

  return (
    <>
      <div className="popover-arrow" ref={arrowRef} style={adjustedArrowStyles}></div>
      <div className="popover-inner">
        <header className="popover-inner__header">
          <span className="popover-inner__title">{step.title}</span>
        </header>
        <div className="popover-inner__body">
          {step.content}
        </div>
        <div className="popover-inner__controls">
          {tour.hasPreviousStep() && <button onClick={tour.prev}>&lt; Prev</button>}
          {tour.hasNextStep() && <button onClick={tour.next}>Next &gt;</button>}
          <button onClick={tour.end}>End</button>
        </div>
      </div>
    </>
  )
}
