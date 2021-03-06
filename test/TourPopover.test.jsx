import React from 'react'
import { usePopper } from 'react-popper'
import { render } from '@testing-library/react'
import { TourStatus } from '../lib/constants'
import { get } from '../lib/utils'
import TourPopover from '../lib/TourPopover'

jest.mock('react-popper')

describe('TourPopover Component', () => {
  let step
  let tour
  let ref

  beforeEach(() => {
    ref = {
      current: {}
    }

    step = {
      getConfig: jest.fn((key, defaultVal) => get(step, key, defaultVal)),
      popover: {},
      ref,
    }

    tour = {
      getStatus: () => TourStatus.OFF, // prevents the TourProvider from displaying another instance of TourPopover
      getCurrentStep: () => step,
      setPopoverRef: jest.fn()
    }

    usePopper.mockReturnValue({
      update: jest.fn(),
      styles: {
        popper: {
          color: 'red'
        }
      },
      attributes: {
        popper: {
          'data-test': 'test'
        }        
      },
      state: {},
    })
  })

  it('should use a popper that points to the current step when not a modal', () => {
    // given
    step.isModal = false

    // when
    render(<TourPopover tour={tour} />)

    // then
    expect(usePopper.mock.calls[0][0]).toBe(ref.current)
    expect(usePopper.mock.calls[0][2].strategy).toBe('absolute')
  })

  it('should use a popper that points to a virtual element when a modal', () => {
    // given
    step.isModal = true

    // when
    render(<TourPopover tour={tour} />)

    // then
    expect(usePopper.mock.calls[0][0]).toHaveProperty('getBoundingClientRect')
    expect(usePopper.mock.calls[0][2].strategy).toBe('fixed')
  })

  it('should use the configured skid and offset', () => {
    // given
    step.offset = 100   
    step.skid = 200 

    // when
    render(<TourPopover tour={tour} />)

    // then
    expect(usePopper.mock.calls[0][2].modifiers[1].options.offset).toEqual([200, 100])
  })

  it('should register the popperElement with the tour', async () => {
    // when
    render(<TourPopover tour={tour} />)

    expect(tour.setPopoverRef).toHaveBeenCalledWith({
      current: expect.anything()
    })
  })

  it('should render the PopoverComponent with the proper props', () => {
    // given 
    step.title = 'Title'
    step.popover.Component = props => props.step.title

    // when
    const { getByText } = render(<TourPopover tour={tour} />)

    // then
    expect(getByText('Title').textContent).toBe('Title')
  })

  it('should render the popoverTemplate', () => {
    // given 
    step.popover.template = <div>Template</div>

    // when
    const { getByText } = render(<TourPopover tour={tour} />)

    // then
    expect(getByText('Template').textContent).toBe('Template')
  })

  it('should use the modal styles when modal', () => {
    // given 
    step.isModal = true

    // when
    const { getByTestId } = render(<TourPopover tour={tour} />)

    // then
    expect(getByTestId('popover').style.position).toBe('fixed')
  })

  it('should use the popper styles when not modal', () => {
    // given 
    step.isModal = false

    // when
    const { getByTestId } = render(<TourPopover tour={tour} />)

    // then
    expect(getByTestId('popover').style.color).toBe('red')
  })

  it('should use the popper attributes', () => {
    // given 
    step.isModal = false

    // when
    const { getByTestId } = render(<TourPopover tour={tour} />)

    // then
    expect(getByTestId('popover').dataset.test).toBe('test')
  })

  it('should use the configured className', () => {
    // given 
    step.popover.className = 'POP'

    // when
    const { getByTestId } = render(<TourPopover tour={tour} />)

    // then
    expect(getByTestId('popover').classList).toContain('POP')
  })
})
