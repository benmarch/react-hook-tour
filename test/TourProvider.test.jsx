import React from 'react'
import { render } from '@testing-library/react'
import { TourStatus } from '../lib/constants'
import useTourController from '../lib/useTourController'
import TourPopover from '../lib/TourPopover'
import TourProvider, { TourContext } from '../lib/TourProvider'

jest.mock('../lib/useTourController')
jest.mock('../lib/TourPopover')

describe('TourProvider Component', () => {
  it('should pass the config to the useTourController hook', () => {
    // given
    const tourConfig = {}
    useTourController.mockReturnValue({
      getStatus: () => TourStatus.OFF,
      getCurrentStep: () => null
    })

    // when
    render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then
    expect(useTourController).toHaveBeenCalledWith(tourConfig)
  })

  it('should provide the tourController to the children', () => {
    // given
    const tourConfig = {}
    const tourController = {
      getStatus: () => TourStatus.OFF,
      getCurrentStep: () => null
    }
    useTourController.mockReturnValue(tourController)

    // when
    let context
    render(
      <TourProvider config={tourConfig}>
        <TourContext.Consumer>
          {value => {
            context = value
            return null
          }}
        </TourContext.Consumer>
      </TourProvider>
    )

    // then
    expect(context).toBe(tourController)
  })

  it('should not show the popover if the tour is OFF', () => {
    // given    
    const tourConfig = {}
    useTourController.mockReturnValue({
      getStatus: () => TourStatus.OFF,
      getCurrentStep: () => null
    })
    TourPopover.mockImplementation(() => 'popover')

    // when
    const { queryByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then

    expect(queryByText('popover')).toEqual(null)
  })

  it('should not show the popover if the tour is ON but there is no current step', () => {
    // given    
    const tourConfig = {}
    useTourController.mockReturnValue({
      getStatus: () => TourStatus.ON,
      getCurrentStep: () => null
    })
    TourPopover.mockImplementation(() => 'popover')

    // when
    const { queryByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then

    expect(queryByText('popover')).toEqual(null)
  })

  it('should not show the popover if the tour is PAUSED', () => {
    // given    
    const tourConfig = {}
    useTourController.mockReturnValue({
      getStatus: () => TourStatus.PAUSED,
      getCurrentStep: () => ({})
    })
    TourPopover.mockImplementation(() => 'popover')

    // when
    const { queryByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then

    expect(queryByText('popover')).toEqual(null)
  })

  it('should show the popover if the tour is ON and there is a current step', () => {
    // given    
    const tourConfig = {}
    useTourController.mockReturnValue({
      getStatus: () => TourStatus.ON,
      getCurrentStep: () => ({})
    })
    TourPopover.mockImplementation(() => 'popover')

    // when
    const { getByText } = render(
      <TourProvider config={tourConfig}></TourProvider>
    )

    // then
    expect(getByText('popover')).toBeDefined()
  })
})
