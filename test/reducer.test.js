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
import reducer, { initialState, generateSelectors } from '../lib/reducer'

describe('Tour Reducer', () => {
  describe('selectors', () => {
    let selectors
    
    beforeEach(() => {
      selectors = {
        ...generateSelectors(initialState).public,
        ...generateSelectors(initialState).protected
      }
    })

    describe('getSteps()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getSteps()

        // then
        expect(result).toBe(initialState.steps)
      })
    })

    describe('getCurrentStep()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getCurrentStep()

        // then
        expect(result).toBe(initialState.currentStep)
      })
    })

    describe('getPreviouslyShownStep()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getPreviouslyShownStep()

        // then
        expect(result).toBe(initialState.previouslyShownStep)
      })
    })

    describe('getStepPointer()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getStepPointer()

        // then
        expect(result).toBe(initialState.stepPointer)
      })
    })

    describe('getStepOrder()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getStepOrder()

        // then
        expect(result).toBe(initialState.stepOrder)
      })
    })

    describe('getStatus()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getStatus()

        // then
        expect(result).toBe(initialState.status)
      })
    })

    describe('hasNextStep()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.hasNextStep()

        // then
        expect(result).toBe(initialState.hasNextStep)
      })
    })

    describe('hasPreviousStep()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.hasPreviousStep()

        // then
        expect(result).toBe(initialState.hasPrevStep)
      })
    })

    describe('getNavigationAction()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getNavigationAction()

        // then
        expect(result).toBe(initialState.navAction)
      })
    })

    describe('getCustomState()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getCustomState()

        // then
        expect(result).toBe(initialState.customState)
      })
    })

    describe('getPopoverRef()', () => {      
      it('should return the expected value', () => {
        // when
        const result = selectors.getPopoverRef()

        // then
        expect(result).toBe(initialState.popoverRef)
      })
    })

    describe('getConfig()', () => {      
      it('should return the expected value', () => {
        // given
        initialState.randomKey = 'random value'

        // when
        const result = selectors.getConfig('randomKey')

        // then
        expect(result).toBe(initialState.randomKey)
      })
    })
  })

  describe('reducer', () => {
    let state

    beforeEach(() => {
      state = {
        ...initialState,
        steps: {},
        stepOrder: [],
        customState: {}
      }
    })

    it('should return the previous state if the action type is not recognized', () => {
      // given
      const previousState = {
        ...state,
        status: TourStatus.ON
      }
      const action = {
        type: 'NONSENSE'
      }

      // when
      const newState = reducer(previousState, action)

      // then
      expect(newState).toBe(previousState)
    })

    describe('ADD_STEP', () => {
      it('should add a step to the state', () => {
        // given        
        const action = {
          type: ADD_STEP,
          data: {
            name: 'newStep'
          }
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.steps.newStep).toBe(action.data)
        expect(newState.status).toBe(TourStatus.OFF)
      })

      it('should resume the tour if the step is waited for', () => {
        // given     
        state.waitingFor = 'newStep'   
        const action = {
          type: ADD_STEP,
          data: {
            name: 'newStep'
          }
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.steps.newStep).toBe(action.data)
        expect(newState.status).toBe(TourStatus.ON)
        expect(newState.waitingFor).toBe('')
      })
    })

    describe('REMOVE_STEP', () => {
      it('should remove a step if it exists', () => {
        // given
        state.steps['myStep'] = {}
        const action = {
          type: REMOVE_STEP,
          data: {
            name: 'myStep'
          }
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.steps['myStep']).toBeUndefined()
      })

      it('should do nothing if the step does not exist', () => {
        // given
        state.steps['myStep'] = {}
        const action = {
          type: REMOVE_STEP,
          data: {
            name: 'notMyStep'
          }
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.steps['myStep']).toBeDefined()
      })
    })

    describe('START', () => {
      it('should properly update the state', () => {
        // given        
        const action = {
          type: START          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.status).toBe(TourStatus.ON)
        expect(newState.navAction).toBe('start')
      })
    })

    describe('END', () => {
      it('should properly update the state', () => {
        // given        
        const currentStep = {}
        state.currentStep = currentStep
        const action = {
          type: END          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.status).toBe(TourStatus.OFF)
        expect(newState.currentStep).toBe(null)
        expect(newState.previouslyShownStep).toBe(currentStep)
        expect(newState.hasNextStep).toBe(false)
        expect(newState.hasPrevStep).toBe(false)
        expect(newState.navAction).toBe('end')
      })
    })

    describe('PAUSE', () => {
      it('should properly update the state', () => {
        // given        
        const action = {
          type: PAUSE          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.status).toBe(TourStatus.PAUSED)
        expect(newState.navAction).toBe('pause')
      })
    })

    describe('RESUME', () => {
      it('should properly update the state', () => {
        // given        
        const action = {
          type: RESUME          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.status).toBe(TourStatus.ON)
        expect(newState.navAction).toBe('resume')
      })
    })

    describe('SET_STEP_POINTER', () => {
      it('should properly update the state (not including hasNextStep, hasPrevStep)', () => {
        // given        
        const currentStep = {}
        state.currentStep = currentStep
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'next'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.stepPointer).toBe(1)
        expect(newState.previouslyShownStep).toBe(currentStep)
        expect(newState.currentStep).toBe(null)
        expect(newState.navAction).toBe('next')
      })

      it('should determine that hasNextStep is true when the next step order is a string', () => {
        // given        
        state.stepOrder = ['first', 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'next'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasNextStep).toBe(true)
      })

      it('should determine that hasNextStep is true when the next step order is an object and has a fetch function', () => {
        // given        
        state.stepOrder = ['first', 'second', {fetch: () => {}}]
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'next'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasNextStep).toBe(true)
      })
      it('should determine that hasNextStep is false when the next step order is an object and does not have a fetch function', () => {
        // given        
        state.stepOrder = ['first', 'second', {name: 'third'}]
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'next'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasNextStep).toBe(false)
      })

      it('should determine that hasNextStep is false when the current step is the last step', () => {
        // given        
        state.stepOrder = ['first', 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 2,
            action: 'next'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasNextStep).toBe(false)
      })

      it('should determine that hasPrevStep is true when the previous step order is a string', () => {
        // given        
        state.stepOrder = ['first', 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'prev'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasPrevStep).toBe(true)
      })

      it('should determine that hasPrevStep is true when the previous step order is an object and has a fetch function', () => {
        // given        
        state.stepOrder = [{fetch: () => {}}, 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'prev'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasPrevStep).toBe(true)
      })

      it('should determine that hasPrevStep is false when the previous step order is an object and does not have a fetch function', () => {
        // given        
        state.stepOrder = [{name: 'first'}, 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 1,
            action: 'prev'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasPrevStep).toBe(false)
      })

      it('should determine that hasPrevStep is false when the current step is the first step', () => {
        // given        
        state.stepOrder = ['first', 'second', 'third']
        state.steps = {
          first: {
            name: 'first'
          },
          second: {
            name: 'second'
          },
          third: {
            name: 'third'
          }
        }
        const action = {
          type: SET_STEP_POINTER,
          data: {
            index: 0,
            action: 'prev'
          }          
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.hasPrevStep).toBe(false)
      })
    })

    describe('SET_CURRENT_STEP', () => {
      it('should properly update the state', () => {
        // given     
        const currentStep = {}   
        const action = {
          type: SET_CURRENT_STEP,
          data: currentStep         
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.currentStep).toBe(currentStep)        
      })
    })

    describe('SET_ORDER', () => {
      it('should properly update the state', () => {
        // given     
        const stepOrder = []   
        const action = {
          type: SET_ORDER,
          data: stepOrder         
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.stepOrder).toBe(stepOrder)        
      })
    })

    describe('SET_CUSTOM_STATE', () => {
      it('should properly update the state', () => {
        // given     
        state.customState = {
          old: 'old'
        }
        const customState = {
          new: 'new'
        }   
        const action = {
          type: SET_CUSTOM_STATE,
          data: customState         
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.customState).toEqual({
          old: 'old',
          new: 'new'
        })        
      })
    })

    describe('WAIT_FOR', () => {
      it('should properly update the state', () => {
        // given     
        const action = {
          type: WAIT_FOR,
          data: 'lazyStep'         
        }

        // when
        const newState = reducer(state, action)

        // then
        expect(newState.status).toBe(TourStatus.PAUSED)
        expect(newState.waitingFor).toBe('lazyStep')        
      })
    })

    describe('SET_POPOVER_REF', () => {
      it('should properly update the state', () => {
        // given     
        const ref = {}
        const action = {
          type: SET_POPOVER_REF,
          data: ref         
        }

        // when
        const newState = reducer(state, action)

        // then  
        expect(newState.popoverRef).toBe(ref)
      })
    })
  })
})

