import React from 'react'
import { useTour } from '../lib'

export default props => {
  const { tour, registerStep } = useTour()

  const controlsStep = registerStep({
    name: 'controls'
  })
  const pageHeaderStep = registerStep({
    name: 'pageHeader'
  })
  const titleStep = registerStep({
    name: 'title'
  })
  const menuButtonStep = registerStep({
    name: 'menuButton',
    onShow: () => {
      alert('menu shown!')
    }
  })
  const subheadStep = registerStep({
    name: 'subhead'
  })
  const configOptionsStep = registerStep({
    name: 'configOptions'
  })
  
  return (
    <div>
      <header className="header" ref={pageHeaderStep}>
        <h1 className="title" ref={titleStep}>Example Tour</h1>
        <button className="menu" ref={menuButtonStep}>Menu</button>
      </header>

      <h2 className="subhead" ref={subheadStep}>
        Config Options
      </h2>

      <table className="config-options" ref={configOptionsStep}>
        <thead>
          <tr>
            <th>Option</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td>
            <td>Gives the tour a name</td>
          </tr>
        </tbody>
      </table>
      
      <div className="tour-status">
        {tour.status}<br />
        {!!tour.currentStep && tour.currentStep.name}
      </div>

      <div className="controls" ref={controlsStep}>
        <button onClick={tour.start}>Start</button>
        <button onClick={tour.end}>End</button>
        <button onClick={tour.pause}>Pause</button>
        <button onClick={tour.resume}>Resume</button>
        <button onClick={tour.prev}>Previous</button>
        <button onClick={tour.next}>Next</button>
      </div>
    </div>
  )
}
