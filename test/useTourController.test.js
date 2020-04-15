import { renderHook, act } from '@testing-library/react-hooks'
import generateActions from '../lib/actions'
import reducer, { generateSelectors } from '../lib/reducer'
import useStepChange from '../lib/useStepChange'
import useTourController from '../lib/useTourController'

jest.mock('../lib/actions')
jest.mock('../lib/reducer')
jest.mock('../lib/useStepChange')

describe('useTourController Hook', () => {
  let tourConfig

  beforeEach(() => {
    tourConfig = {
      stepOrder: []
    }

    reducer.mockImplementation((state, action) => {
      return {
        ...state,
        ...action
      }
    })

    generateSelectors.mockImplementation(state => {
      return {
        public: {
          getSomething: jest.fn(() => 'something'),
          getDone: () => state.done,
          getConfig: key => state.tourConfig[key]
        },
        protected: {
          getSomethingSafe: jest.fn(() => 'safe'),
          getSteps: () => state.steps,
        }        
      }
    })

    generateActions.mockImplementation((selectors, dispatch) => {
      return {
        public: {
          doSomething: () => {
            const something = selectors.getSomething()
            dispatch({
              done: something
            })
            return 'done'
          }
        },
        protected: {
          doSomethingSafe: jest.fn()
        }       
      }
    })
  })

  it('should initialize all steps based on the stepOrder', () => {
    // given
    tourConfig.stepOrder = [{name: 'first'}, 'second', {name: 'third', fetch: () => {}}]
  
    // when
    const { result } = renderHook(() => useTourController(tourConfig))

    // then
    expect(result.current.getSteps()).toEqual({
      first: {
        name: 'first'
      }
    })
  })

  it('should throw if provided an invalid step config', () => {
    // given
    tourConfig.stepOrder = [{name: 'first'}, 'second', {}]
  
    // when
    const { result } = renderHook(() => useTourController(tourConfig))

    // then
    expect(result.error.message).toBe('Step configuration at position 2 is not valid.')
  })

  it('should create a tourController with selectors and actions and return it', () => {
    // when
    const { result } = renderHook(() => useTourController(tourConfig))

    // then
    expect(result.current.getSomething()).toBe('something')
    expect(result.current.getDone()).toBeUndefined()
  })

  it('should use the tourConfig to initialize the reducer state', () => {
    // given
    tourConfig.configOption = 1

    // when
    const { result } = renderHook(() => useTourController(tourConfig))

    // then    
    expect(result.current.getConfig('configOption')).toBe(1)
  })

  it('should share the state between the selectors and actions', () => {
    // given
    const { result } = renderHook(() => useTourController(tourConfig))

    // when
    let something
    act(() => {
      something = result.current.doSomething()
    })

    // then
    expect(something).toBe('done')
    expect(result.current.getDone()).toBe('something')
  })

  it('should use the useStepChangeHook', () => {
    // when
    const { result } = renderHook(() => useTourController(tourConfig))

    // then
    expect(useStepChange).toHaveBeenCalledWith(result.current)
  })
})
