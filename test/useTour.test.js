import { useContext, useRef, useEffect } from 'react'
import { TourContext } from '../lib/TourProvider'
import useTour from '../lib/useTour'

jest.mock('react')

describe('useTour Hook', () => {
  it('should use the TourContext', async () => {
    // when
    useTour()

    // then
    expect(useContext).toHaveBeenCalledWith(TourContext)
  })

  it('should return the tour controller and registerStep function', () => {
    // given
    const tourController = {}
    useContext.mockReturnValueOnce(tourController)
    
    // when
    const { tour, registerStep } = useTour()

    // then
    expect(tour).toBe(tourController)
    expect(registerStep).toEqual(expect.any(Function))
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
      useContext.mockReturnValueOnce(tour)

      const { registerStep: rs } = useTour()
      registerStep = rs
    })

    it('should create a ref, assign it to the stepConfig, and return it', () => {
      // when
      const ref = registerStep(stepConfig)

      // then
      expect(useRef).toHaveBeenCalledWith(null)
      expect(stepConfig.ref).toBe(ref)
    })

    it('should assign a getConfig() method to the stepConfig', () => {
      // when
      registerStep(stepConfig)

      // then      
      expect(stepConfig.getConfig).toEqual(expect.any(Function))
    })

    it('should add the step to the tour in a useEffect hook', () => {
      // when
      registerStep(stepConfig)
      const effect = useEffect.mock.calls[0][0]

      // then
      expect(effect).toEqual(expect.any(Function))
      expect(tour.addStep).not.toHaveBeenCalled()
      
      // when
      effect()

      // then
      expect(tour.addStep).toHaveBeenCalledWith(stepConfig)
    })

    it('should remove the step from the tour in a useEffect hook', () => {
      // when
      registerStep(stepConfig)
      const effect = useEffect.mock.calls[0][0]

      // then
      expect(effect).toEqual(expect.any(Function))
      expect(tour.removeStep).not.toHaveBeenCalled()
      
      // when
      const cleanupEffect = effect()

      // then
      expect(cleanupEffect).toEqual(expect.any(Function))
      expect(tour.removeStep).not.toHaveBeenCalled()

      // when 
      cleanupEffect()

      // then
      expect(tour.removeStep).toHaveBeenCalledWith(stepConfig)
    })

    describe('getConfig()', () => {
      it('should return a config value from the stepConfig if it is defined', () => {
        // when
        registerStep(stepConfig)

        // then      
        expect(stepConfig.getConfig).toEqual(expect.any(Function))
        expect(stepConfig.getConfig('configOnStepOnly')).toBe('step')
        expect(stepConfig.getConfig('configOnStepAndTour')).toBe('both - step')
        expect(stepConfig.getConfig('configOnNeitherStepOrTour')).toBeUndefined()
      })

      it('should return a config value from the tour if it is defined', () => {
        // when
        registerStep(stepConfig)

        // then      
        expect(stepConfig.getConfig).toEqual(expect.any(Function))
        expect(stepConfig.getConfig('configOnTourOnly')).toBe('tour')
        expect(stepConfig.getConfig('configOnStepAndTour')).toBe('both - step')    
      })
    })
  })
})
