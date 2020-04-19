import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { TourContext } from '../lib/TourProvider'
import { get } from '../lib/utils'
import useStep from '../lib/useStep'

describe('useStep Hook', () => {
  let stepConfig
  let tour
  let wrapper
  let existingStep
  let addedSteps
  let removedSteps
  
  beforeEach(() => {
    stepConfig = {
      name: 'newStep',
      configOnStepOnly: 'step',
      configOnStepAndTour: 'both - step'
    }

    existingStep = {
      name: 'existingStep'
    }

    addedSteps = {}
    removedSteps = {}

    tour = {
      addStep: jest.fn(step => addedSteps[step.name] = step),
      removeStep: jest.fn(step => removedSteps[step.name] = step),
      configOnTourOnly: 'tour',
      configOnStepAndTour: 'both - tour',
      getConfig: jest.fn((key, defaultVal) => get(tour, key, defaultVal)),
      getSteps: jest.fn(() => ({
        existingStep
      }))
    }  

    wrapper = ({ children }) => (
      <TourContext.Provider value={tour}>{children}</TourContext.Provider>
    )
  })

  it('should create a ref, assign it to the stepConfig, and return it', () => {    
    // when
    const { result } = renderHook(() => useStep(stepConfig), { wrapper })

    // then
    expect(addedSteps.newStep.ref).toBe(result.current)
  })

  it('should use an existing step if it has been pre-registered', () => {
    // when
    const { result } = renderHook(() => useStep('existingStep'), { wrapper })

    // then
    expect(result.current).toBe(existingStep.ref)
  })

  it('should assign a getConfig() method to the stepConfig', () => {
    // when
    renderHook(() => useStep(stepConfig), { wrapper })

    // then
    expect(addedSteps.newStep.getConfig).toEqual(expect.any(Function))
  })

  it('should throw if an invalid configuration is passed', () => {
    // when
    const { result } = renderHook(() => useStep({}), { wrapper })

    // then
    expect(result.error.message).toContain('invalid step')
  })

  it('should throw if an async configuration is passed', () => {
    // when
    const { result } = renderHook(() => useStep({fetch: () => {}}), { wrapper })

    // then
    expect(result.error.message).toContain('async step')
  })

  it('should throw if an already "used" configuration is passed', () => {
    // when
    const { result } = renderHook(() => useStep({ref: {}}), { wrapper })

    // then
    expect(result.error.message).toContain('reuse a step')
  })

  it('should throw if a step does not exist', () => {
    // when
    const { result } = renderHook(() => useStep('does not exist'), { wrapper })

    // then
    expect(result.error.message).toContain('non-existent step')
  })

  it('should merge a step config with the preconfiguration', () => {
    // when
    const { result } = renderHook(() => useStep({name: 'existingStep', newConfig: 'new'}), { wrapper })

    // then
    expect(addedSteps.existingStep.newConfig).toBe('new')
  })

  it('should add the step to the tour', () => {
    // when
    renderHook(() => useStep(stepConfig), { wrapper })

    // then
    expect(tour.addStep).toHaveBeenCalled()
    expect(addedSteps.newStep).toMatchObject(stepConfig)
    expect(tour.removeStep).not.toHaveBeenCalledWith(stepConfig)
  })

  it('should remove the step from the tour on cleanup', () => {
    // given
    const { unmount } = renderHook(() => useStep(stepConfig), { wrapper })

    // when
    unmount()

    // then
    expect(tour.addStep).toHaveBeenCalled()
    expect(tour.removeStep).toHaveBeenCalled()
    expect(removedSteps.newStep).toMatchObject(stepConfig)
  })

  describe('getConfig()', () => {
    it('should return a config value from the stepConfig if it is defined', () => {
      // when
      renderHook(() => useStep(stepConfig), { wrapper })

      // then      
      expect(addedSteps.newStep.getConfig).toEqual(expect.any(Function))
      expect(addedSteps.newStep.getConfig('configOnStepOnly')).toBe('step')
      expect(addedSteps.newStep.getConfig('configOnStepAndTour')).toBe('both - step')
      expect(addedSteps.newStep.getConfig('configOnNeitherStepOrTour')).toBeUndefined()
    })

    it('should return a config value from the tour if it is defined', () => {
      // when
      renderHook(() => useStep(stepConfig), { wrapper })

      // then      
      expect(addedSteps.newStep.getConfig).toEqual(expect.any(Function))
      expect(addedSteps.newStep.getConfig('configOnTourOnly')).toBe('tour')
      expect(addedSteps.newStep.getConfig('configOnStepAndTour')).toBe('both - step')    
    })
  })
})
