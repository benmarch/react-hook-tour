import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { TourContext } from '../lib/TourProvider'
import useTour from '../lib/useTour'

describe('useTour Hook', () => {
  it('should return the tour controller from context and registerStep function', () => {
    // given
    const tourController = {}
    const wrapper = ({ children }) => (
      <TourContext.Provider value={tourController}>{children}</TourContext.Provider>
    )
    // when
    const { result } = renderHook(() => useTour(), { wrapper })

    expect(result.current.tour).toBe(tourController)
    expect(result.current.registerStep).toEqual(expect.any(Function))
  })

  describe('registerStep()', () => {
    let stepConfig
    let tour
    let registerStep
    
    beforeEach(() => {
      stepConfig = {
        name: 'newStep',
        configOnStepOnly: 'step',
        configOnStepAndTour: 'both - step'
      }

      tour = {
        addStep: jest.fn(),
        removeStep: jest.fn(),
        configOnTourOnly: 'tour',
        configOnStepAndTour: 'both - tour',
        getConfig: key => tour[key]
      }  

      const wrapper = ({ children }) => (
        <TourContext.Provider value={tour}>{children}</TourContext.Provider>
      )
      const { result } = renderHook(() => useTour(), { wrapper })
      registerStep = result.current.registerStep
    })

    it('should create a ref, assign it to the stepConfig, and return it', () => {      
      // when
      const { result } = renderHook(() => registerStep(stepConfig))

      // then
      expect(stepConfig.ref).toBe(result.current)
    })

    it('should assign a getConfig() method to the stepConfig', () => {
      // when
      renderHook(() => registerStep(stepConfig))

      // then
      expect(stepConfig.getConfig).toEqual(expect.any(Function))
    })

    it('should add the step to the tour', () => {
      // when
      renderHook(() => registerStep(stepConfig))

      // then
      expect(tour.addStep).toHaveBeenCalledWith(stepConfig)
      expect(tour.removeStep).not.toHaveBeenCalledWith(stepConfig)
    })

    it('should remove the step from the tour on cleanup', () => {
      // given
      const { unmount } = renderHook(() => registerStep(stepConfig))

      // when
      unmount()

      // then
      expect(tour.removeStep).toHaveBeenCalledWith(stepConfig)
    })

    describe('getConfig()', () => {
      it('should return a config value from the stepConfig if it is defined', () => {
        // when
        renderHook(() => registerStep(stepConfig))

        // then      
        expect(stepConfig.getConfig).toEqual(expect.any(Function))
        expect(stepConfig.getConfig('configOnStepOnly')).toBe('step')
        expect(stepConfig.getConfig('configOnStepAndTour')).toBe('both - step')
        expect(stepConfig.getConfig('configOnNeitherStepOrTour')).toBeUndefined()
      })

      it('should return a config value from the tour if it is defined', () => {
        // when
        renderHook(() => registerStep(stepConfig))

        // then      
        expect(stepConfig.getConfig).toEqual(expect.any(Function))
        expect(stepConfig.getConfig('configOnTourOnly')).toBe('tour')
        expect(stepConfig.getConfig('configOnStepAndTour')).toBe('both - step')    
      })
    })
  })
})
