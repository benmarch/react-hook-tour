import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { TourStatus } from '../lib/constants'
import smartScroll from '../lib/smartScroll'
import useBackdrop from '../lib/useBackdrop'
import useStepChange from '../lib/useStepChange'

jest.mock('../lib/smartScroll')
jest.mock('../lib/useBackdrop')

describe('useStepChange Hook', () => {
  const makeStep = (name, config) => {
    const step = {
      name,
      ref: { current: {} },
      getConfig: key => step[key],
      ...config,
    }
    return step
  }

  let backdrop
  let steps
  let stepOrder
  let tour
  
  beforeEach(() => {
    backdrop = {
      show: jest.fn(),
      hide: jest.fn(),
      setOptions: jest.fn(),
      position: jest.fn()
    }

    useBackdrop.mockReturnValue(backdrop)

    steps = {
      first: makeStep('first'),
      second: makeStep('second'),
      third: makeStep('third')
    }

    stepOrder = ['first', 'second', 'third']

    tour = {
      backdrop: {
        classPrefix: 'my-class'
      },
      getConfig: key => tour[key],
      getStatus: jest.fn(() => TourStatus.ON),
      getSteps: jest.fn(() => steps),
      getCurrentStep: jest.fn(() => steps.second),
      getPreviouslyShownStep: jest.fn(() => steps.first),
      getStepPointer: jest.fn(() => 1),
      getStepOrder: jest.fn(() => (stepOrder)),
      getPopoverRef: jest.fn(() => ({ current: {} }))
    }
  })

  it('should initialize a backdrop with the backdrop config', () => {
    // when
    renderHook(() => useStepChange(tour))

    // then
    expect(useBackdrop).toHaveBeenCalledWith({
      enabled: false,
      classPrefix: 'my-class'
    })
  })

  describe('State: there was a previous step but no current step', () => {
    beforeEach(() => {
      tour.getCurrentStep.mockReturnValue(null)
      tour.setCurrentStep = jest.fn()
    })

    it('should attempt to trigger the onHide event', async () => {
      // given
      const stepWithOnHide = makeStep('withOnHide', {
        onHide: jest.fn(async () => 'hidden!')
      })
      tour.getPreviouslyShownStep.mockReturnValue(stepWithOnHide)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(stepWithOnHide.onHide).toHaveBeenCalled()
    })

    describe('and the tour is ON', () => {
      it('should set the next step if the next step order is a string', () => {
        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.setCurrentStep).toHaveBeenCalledWith(steps.second)
      })

      it('should set the next step if the next step order is an object with name', () => {
        // given
        stepOrder[1] = {
          name: 'second'
        }

        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.setCurrentStep).toHaveBeenCalledWith(steps.second)
      })

      it('should set the next step if the next step order is an object with fetch and the step has been registered', () => {
        // given
        tour.waitForStep = jest.fn()
        stepOrder[1] = {
          name: 'second',
          fetch: jest.fn(),
          onNext: () => {}
        }
        
        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.setCurrentStep).toHaveBeenCalledWith(steps.second)
        expect(tour.waitForStep).not.toHaveBeenCalled()
        expect(stepOrder[1].fetch).not.toHaveBeenCalled()
      })

      it('should fetch the next step if the next step order is an object with fetch and the step has not been registered', () => {
        // given
        tour.waitForStep = jest.fn()
        stepOrder[1] = {
          name: 'fourth',
          fetch: jest.fn()
        }
        
        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.waitForStep).toHaveBeenCalledWith('fourth')
        expect(stepOrder[1].fetch).toHaveBeenCalled()
      })

      it('should not set the current step if there is no step', () => {
        // given
        tour.getStepPointer.mockReturnValue(6)

        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.setCurrentStep).not.toHaveBeenCalled()
      })
      
      it('should not set the current step if the step is not loaded and there is not fetch', () => {
        // given
        stepOrder[1] = {
          name: 'fourth',
        }

        // when
        renderHook(() => useStepChange(tour))

        // then
        expect(tour.setCurrentStep).not.toHaveBeenCalled()
      })
    })
  })

  describe('there was a previous step and there is a current step', () => {
    it('should hide the backdrop if the previous step had a backdrop but the current step does not', () => {
      // given
      const previousStep = makeStep('first', {
        hasBackdrop: true
      })
      const currentStep = makeStep('second', {
        hasBackdrop: false
      })
      tour.getPreviouslyShownStep.mockReturnValue(previousStep)
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.hide).toHaveBeenCalled()
    })

    it('should not hide the backdrop if the current step has a backdrop', () => {
      // given
      const previousStep = makeStep('first', {
        hasBackdrop: true
      })
      const currentStep = makeStep('second', {
        hasBackdrop: true
      })
      tour.getPreviouslyShownStep.mockReturnValue(previousStep)
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.hide).not.toHaveBeenCalled()
    })
  })

  describe('State: there is a current step and the tour is ON', () => {
    it('should attempt to trigger the onShow event', async () => {
      // given
      const stepWithOnShow = makeStep('withOnShow', {
        onShow: jest.fn(async () => 'shown!')
      })
      tour.getCurrentStep.mockReturnValue(stepWithOnShow)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(stepWithOnShow.onShow).toHaveBeenCalled()
    })

    it('should scroll the target and popover into view', () => {
      // given
      const currentStep = makeStep('second', {
        scrollOffsets: {
          top: 100
        }
      })
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(smartScroll).toHaveBeenCalledWith(currentStep.ref.current, tour.getPopoverRef().current, {
        scrollOffsets: currentStep.scrollOffsets
      })
    })

    it('should configure the backdrop for a modal step', () => {
      // given
      const currentStep = makeStep('second', {
        hasBackdrop: true,
        isModal: true,
        backdrop: {
          classPrefix: 'my-backdrop',
        }
      })
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.setOptions).toHaveBeenCalledWith({
        fullScreen: true,
        classPrefix: 'my-backdrop'
      })
    })

    it('should configure the backdrop for a non-modal step', () => {
      // given
      const currentStep = makeStep('second', {
        hasBackdrop: true,
        isModal: false,
        backdrop: {
          classPrefix: 'my-backdrop',
        }
      })
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.setOptions).toHaveBeenCalledWith({
        fullScreen: false,
        classPrefix: 'my-backdrop'
      })
    })

    it('should not configure a backdrop if the step does not have one configured', () => {
      // given
      const currentStep = makeStep('second', {
        hasBackdrop: false,
        isModal: true,
        backdropClassName: 'my-backdrop'
      })
      tour.getCurrentStep.mockReturnValue(currentStep)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.setOptions).not.toHaveBeenCalled()
    })
  })
  
  describe('State: backdrop is active by tour is not ON', () => {
    it('should hide the backdrop', () => {
      // given
      tour.getStatus.mockReturnValue(TourStatus.OFF)

      // when
      renderHook(() => useStepChange(tour))

      // then
      expect(backdrop.hide).toHaveBeenCalled()
    })
  })
})
