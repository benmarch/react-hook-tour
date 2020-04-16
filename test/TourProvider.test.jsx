import React from 'react'
import { render, act } from '@testing-library/react'
import generateActions from '../lib/actions'
import { generateSelectors } from '../lib/reducer'
import useStepChange from '../lib/useStepChange'
import TourPopover from '../lib/TourPopover'
import TourProvider, { TourContext } from '../lib/TourProvider'

jest.mock('../lib/useStepChange')
jest.mock('../lib/TourPopover')

describe('TourProvider Component', () => {
  let tourConfig

  beforeEach(() => {
    tourConfig = {
      stepOrder: ['first', 'second', 'third']
    }

    TourPopover.mockImplementation(() => 'popover')
  })

  it('should initialize all steps based on the stepOrder', () => {
    // given
    tourConfig.stepOrder = [{name: 'first'}, 'second', {name: 'third', fetch: () => {}}]
  
    // when
    let tourController
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )

    // then
    expect(tourController.getSteps()).toEqual({
      first: {
        name: 'first'
      }
    })
  })

  it('should throw if provided an invalid step config', () => {
    // given
    jest.spyOn(global.console, 'error').mockImplementation(() => {})
    tourConfig.stepOrder = [{name: 'first'}, 'second', {}]
  
    // when
    const shouldThrow = () => render(<TourProvider config={tourConfig}></TourProvider>)    

    // then
    expect(shouldThrow).toThrow('Step configuration at position 2 is not valid.')
  })

  it('should use the tourConfig to initialize the reducer state', () => {
    // given
    tourConfig.configOption = 1

    // when
    let tourController
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )

    // then    
    expect(tourController.getConfig('configOption')).toBe(1)
  })

  it('should share the state between the selectors and actions', () => {
    // given
    const customState = {
      custom: 'state'
    }

    // when
    let tourController
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )
    act(() => {
      tourController.setCustomState(customState)
    })

    // then
    expect(tourController.getCustomState()).toEqual(customState)
  })

  it('should use the useStepChangeHook', () => {
    // when
    let tourController
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )

    // then
    expect(useStepChange).toHaveBeenCalledWith(tourController)
  })

  it('should provide the tourController to the children', () => {
    // given
    const selectors = generateSelectors({})
    const actions = generateActions({}, ()=>{})

    // when
    let tourController
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )

    // then
    expect(Object.keys(tourController)).toEqual(expect.arrayContaining(Object.keys(selectors.public)))
    expect(Object.keys(tourController)).toEqual(expect.arrayContaining(Object.keys(selectors.protected)))
    expect(Object.keys(tourController.public)).toEqual(expect.arrayContaining(Object.keys(selectors.public)))    
    expect(Object.keys(tourController.public)).not.toEqual(expect.arrayContaining(Object.keys(selectors.protected)))

    expect(Object.keys(tourController)).toEqual(expect.arrayContaining(Object.keys(actions.public)))
    expect(Object.keys(tourController)).toEqual(expect.arrayContaining(Object.keys(actions.protected)))
    expect(Object.keys(tourController.public)).toEqual(expect.arrayContaining(Object.keys(actions.public)))    
    expect(Object.keys(tourController.public)).not.toEqual(expect.arrayContaining(Object.keys(actions.protected)))
  })

  it('should not show the popover if the tour is OFF', () => {
    // when
    const { queryByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then
    expect(queryByText('popover')).toEqual(null)
  })

  it('should not show the popover if the tour is ON but there is no current step', () => {
    // when
    const { queryByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then

    expect(queryByText('popover')).toEqual(null)
  })

  it('should not show the popover if the tour is PAUSED', async () => {
    // when
    let tourController
    const { queryByText } = render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )
    await act(async () => {
      await tourController.start()
      tourController.setCurrentStep({name: 'first'})      
      await tourController.pause()
    })

    // then
    expect(queryByText('popover')).toEqual(null)
  })

  it('should show the popover if the tour is ON and there is a current step', async () => {
    // when
    let tourController
    const { getByText } = render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            tourController = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )
    await act(async () => {
      await tourController.start()
      tourController.setCurrentStep({name: 'first'})      
    })

    // then
    expect(getByText('popover')).toBeDefined()
  })
})
