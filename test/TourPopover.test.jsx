import React, { createRef } from 'react'
import { usePopper } from 'react-popper'
import { render } from '@testing-library/react'
import useTour from '../lib/useTour'
import TourPopover from '../lib/TourPopover'

jest.mock('react-popper')
jest.mock('../lib/useTour')

describe('TourPopover Component', () => {
  let step
  let tour
  let ref

  beforeEach(() => {
    ref = {
      current: {}
    }

    step = {
      getConfig: jest.fn(key => step[key]),
      ref,
    }

    tour = {
      getCurrentStep: () => step,
      setPopoverRef: jest.fn()
    }

    useTour.mockReturnValue({tour})
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
    render(<TourPopover />)

    // then
    expect(usePopper.mock.calls[0][0]).toBe(ref.current)
    expect(usePopper.mock.calls[0][2].strategy).toBe('absolute')
  })

  it('should use a popper that points to a virtual element when a modal', () => {
    // given
    step.isModal = true

    // when
    render(<TourPopover />)

    // then
    expect(usePopper.mock.calls[0][0]).toHaveProperty('getBoundingClientRect')
    expect(usePopper.mock.calls[0][2].strategy).toBe('fixed')
  })

  it('should use the configured offset', () => {
    // given
    step.offset = 100    

    // when
    render(<TourPopover />)

    // then
    expect(usePopper.mock.calls[0][2].modifiers[1].options.offset).toEqual([0, 100])
  })

  it('should register the popperElement with the tour', async () => {
    // when
    render(<TourPopover />)

    expect(tour.setPopoverRef).toHaveBeenCalledWith({
      current: expect.anything()
    })
  })

  it('should render the PopoverComponent with the proper props', () => {
    // given 
    step.title = 'Title'
    step.PopoverComponent = props => props.step.title

    // when
    const { getByText } = render(<TourPopover />)

    // then
    expect(getByText('Title').textContent).toBe('Title')
  })

  it('should render the popoverTemplate', () => {
    // given 
    step.popoverTemplate = <div>Template</div>

    // when
    const { getByText } = render(<TourPopover />)

    // then
    expect(getByText('Template').textContent).toBe('Template')
  })

  it('should use the modal styles when modal', () => {
    // given 
    step.isModal = true

    // when
    const { getByTestId } = render(<TourPopover />)

    // then
    expect(getByTestId('popover').style.position).toBe('fixed')
  })

  it('should use the popper styles when not modal', () => {
    // given 
    step.isModal = false

    // when
    const { getByTestId } = render(<TourPopover />)

    // then
    expect(getByTestId('popover').style.color).toBe('red')
  })

  it('should use the popper attributes', () => {
    // given 
    step.isModal = false

    // when
    const { getByTestId } = render(<TourPopover />)

    // then
    expect(getByTestId('popover').dataset.test).toBe('test')
  })

  it('should use the configured className', () => {
    // given 
    step.popoverClassName = 'POP'

    // when
    const { getByTestId } = render(<TourPopover />)

    // then
    expect(getByTestId('popover').classList).toContain('POP')
  })
})
