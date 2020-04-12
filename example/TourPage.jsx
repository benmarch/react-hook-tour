import React from 'react'
import { useTour } from '../lib'
import LazyStep from './LazyStep'

export default props => {
  const { tour, registerStep } = useTour()

  const welcomeStep = registerStep({
    name: 'welcome',
    isModal: true,
    title: 'Welcome to React Hook Tour!',
    content: 'Take a tour to learn how it works...',
    onNext() {
      console.log('Welcome Next')
    }
  })
  const controlsStep = registerStep({
    name: 'controls',
    placement: 'top',
    title: 'Controls',
    content: 'These are the controls',
    onPrev() {
      console.log('Controls Prev')
    }
  })
  const pageHeaderStep = registerStep({
    name: 'pageHeader',
    title: 'Page Header',
    content: 'Contains the header information for the page',
    onNext() {
      console.log('Page Header Next')
    },
    onPrev() {
      console.log('Page Header Prev')
    }
  })
  const titleStep = registerStep({
    name: 'title',
    title: 'Page Title',
    content: 'This is the title of the page',
    onNext() {
      console.log('Page Title Next')
    },
    onPrev() {
      console.log('Page Title Prev')
    }
  })
  const menuButtonStep = registerStep({
    name: 'menuButton',
    placement: 'right',
    title: 'Menu Button',
    content: 'Click here for additional information',
  })
  const logoStep = registerStep({
    name: 'logo',
    placement: 'left',
    title: 'Logo',
    content: 'This is nothing',
    onNext() {
      console.log('Logo Next')
    },
    onPrev() {
      console.log('Logo Prev')
    }
    
  })
  const subheadStep = registerStep({
    name: 'subhead',
    title: 'Configuration Options',
    content: 'Below here, find all the configuration options for the tour',
  })
  const configOptionsStep = registerStep({
    name: 'configOptions',
    title: 'Configuration Options',
    content: 'Options will indicate whether they can be used on the tour, the steps, or both',
  })
  
  return (
    <div>
      <div className="welcome" ref={welcomeStep}></div>
      <header className="header" ref={pageHeaderStep}>
        <h1 className="title" ref={titleStep}>Example Tour</h1>
        <button className="menu" ref={menuButtonStep}>Menu</button>
        <button className="menu" style={{position: 'absolute', right: 0}} ref={logoStep}>Logo</button>
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
        {tour.getStatus()}<br />
        {!!tour.getCurrentStep() && tour.getCurrentStep().name}
      </div>

      <div className="controls" ref={controlsStep}>
        <button onClick={tour.start}>Start</button>
        <button onClick={tour.end}>End</button>
        <button onClick={tour.pause}>Pause</button>
        <button onClick={tour.resume}>Resume</button>
        <button onClick={tour.prev}>Previous</button>
        <button onClick={tour.next}>Next</button>
      </div>

      {tour.getCustomState().showLazy && <LazyStep />}
    </div>
  )
}
