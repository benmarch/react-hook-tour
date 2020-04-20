import { 
  ADD_STEP,
  REMOVE_STEP,
  START,
  END,
  PAUSE,
  RESUME,
  SET_CURRENT_STEP,
  SET_STEP_POINTER,  
  WAIT_FOR,
  SET_CUSTOM_STATE,
  SET_POPOVER_REF,
  SET_ORDER,
  TourStatus, 
}  from '../lib/constants'
import generateActions from '../lib/actions'

describe('Tour Actions', () => {
  let currentStep
  let selectors
  let dispatch
  let actions

  beforeEach(() => {
    currentStep = {
      onStart: jest.fn(() => {})
    }

    selectors = {
      getStatus: jest.fn(() => TourStatus.OFF),
      getCurrentStep: () => currentStep,
      getConfig: jest.fn(() => {}),
      getStepPointer: jest.fn(() => 1),
      hasNextStep: jest.fn(() => true),
      hasPreviousStep: jest.fn(() => true),
      getNextStepIndex: jest.fn(() => 2),
      getPrevStepIndex: jest.fn(() => 0)
    }

    dispatch = jest.fn(() => 'called')

    actions = {
      ...generateActions(selectors, dispatch).public,
      ...generateActions(selectors, dispatch).protected
    }
  })

  describe('generateActions()', () => {
    it('should return a map of actions', () => {
      const actions = generateActions({}, () => {})

      expect(actions).toBeDefined()
    })
  })

  describe('start()', () => {    
    it('should dispatch the START action', async () => {
      // when
      await actions.start()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: START
      })
    })

    it('should dispatch the SET_STEP_POINTER action', async () => {
      // when
      await actions.start()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_STEP_POINTER,
        data: {
          index: 0,
          action: 'start'
        }
      })
    })

    it('should trigger the onStart event', async () => {
      // given
      selectors.getConfig.mockReturnValue(() => {})

      // when
      await actions.start()

      // then
      expect(currentStep.onStart).toHaveBeenCalled()
      expect(selectors.getConfig).toHaveBeenCalledWith('onStart')
    })

    it('should not do anything if the tour is already on', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.start()

      // then
      expect(dispatch).not.toHaveBeenCalledWith({
        type: START
      })
    })
  })

  describe('end()', () => {
    it('should dispatch the END action', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.end()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: END
      })
    })

    it('should trigger the onEnd event', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.end()

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onEnd')
    })

    it('should not do anything if the tour is OFF', async () => {
      // when
      await actions.end()

      // then
      expect(dispatch).not.toHaveBeenCalledWith({
        type: END
      })
    })
  })

  describe('pause()', () => {
    it('should dispatch the PAUSE action', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)    

      // when
      await actions.pause()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: PAUSE
      })
    })

    it('should trigger the onPause event', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.pause()

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onPause')
    })

    it('should not do anything if the tour is OFF', async () => {
      // when
      await actions.pause()

      // then
      expect(dispatch).not.toHaveBeenCalledWith({
        type: PAUSE
      })
    })
  })

  describe('resume()', () => {
    it('should dispatch the RESUME action', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.PAUSED)

      // when
      await actions.resume()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: RESUME
      })
    })

    it('should trigger the onResume event', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.PAUSED)

      // when
      await actions.resume()

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onResume')
    })

    it('should not do anything if the tour is ON', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.resume()

      // then
      expect(dispatch).not.toHaveBeenCalledWith({
        type: RESUME
      })
    })
  })

  describe('next()', () => {
    it('should dispatch the SET_STEP_POINTER action', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.next()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_STEP_POINTER,
        data: {
          index: 2,
          action: 'next'
        },
      })
    })

    it('should trigger the onNext event', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.next()

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onNext')
    })

    it('should not do anything if the tour is OFF', async () => {
      // when
      await actions.next()

      // then
      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  describe('prev()', () => {
    it('should dispatch the SET_STEP_POINTER action', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.prev()

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_STEP_POINTER,
        data: {
          index: 0,
          action: 'prev'
        },
      })
    })

    it('should trigger the onPrev event', async () => {
      // given
      selectors.getStatus.mockReturnValueOnce(TourStatus.ON)

      // when
      await actions.prev()

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onPrev')
    })

    it('should not do anything if the tour is OFF', async () => {
      // when
      await actions.prev()

      // then
      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  describe('setCustomState()', () => {
    it('should dispatch the SET_CUSTOM_STATE action', async () => {
      // given    
      const customState = {}

      // when
      await actions.setCustomState(customState)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CUSTOM_STATE,
        data: customState
      })
    })
  })
  
  describe('addStep()', () => {
    it('should dispatch the ADD_STEP action', async () => {
      // given    
      const stepConfig = {}

      // when
      await actions.addStep(stepConfig)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: ADD_STEP,
        data: stepConfig
      })
    })

    it('should trigger the onStepAdded event', async () => {
      // given
      const stepConfig = {}

      // when
      await actions.addStep(stepConfig)

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onStepAdded')
    })
  })

  describe('removeStep()', () => {
    it('should dispatch the REMOVE_STEP action', async () => {
      // given    
      const stepConfig = {}

      // when
      await actions.removeStep(stepConfig)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: REMOVE_STEP,
        data: stepConfig
      })
    })

    it('should trigger the onStepRemoved event', async () => {
      // given
      const stepConfig = {}

      // when
      await actions.removeStep(stepConfig)

      // then      
      expect(selectors.getConfig).toHaveBeenCalledWith('onStepRemoved')
    })
  })

  describe('setCurrentStep()', () => {
    it('should dispatch the SET_CURRENT_STEP action', async () => {
      // given    
      const step = {}

      // when
      await actions.setCurrentStep(step)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CURRENT_STEP,
        data: step
      })
    })
  })

  describe('waitForStep()', () => {
    it('should dispatch the WAIT_FOR action', async () => {
      // given    
      const stepName = 'myStep'

      // when
      await actions.waitForStep(stepName)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: WAIT_FOR,
        data: stepName
      })
    })
  })
  
  describe('setPopoverRef()', () => {
    it('should dispatch the SET_POPOVER_REF action', async () => {
      // given    
      const ref = {}

      // when
      await actions.setPopoverRef(ref)

      // then
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_POPOVER_REF,
        data: ref
      })
    })
  })
})
