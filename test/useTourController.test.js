import { renderHook, act } from '@testing-library/react-hooks'
import generateActions from '../lib/actions'
import reducer, { initialState, generateSelectors } from '../lib/reducer'
import useStepChange from '../lib/useStepChange'
import useTourController from '../lib/useTourController'

jest.mock('../lib/actions')
jest.mock('../lib/reducer')
jest.mock('../lib/useStepChange')

describe('useTourController Hook', () => {
  beforeEach(() => {
    reducer.mockImplementation((state, action) => {
      return {
        ...state,
        ...action
      }
    })

    generateSelectors.mockImplementation(state => {
      return {
        getSomething: jest.fn(() => 'something'),
        getDone: () => state.done,
        getConfig: key => state[key]
      }
    })

    generateActions.mockImplementation((selectors, dispatch) => {
      return {
        doSomething: () => {
          const something = selectors.getSomething()
          dispatch({
            done: something
          })
          return 'done'
        }
      }
    })
  })

  it('should create a tourController with selectors and actions and return it', () => {
    // when
    const { result } = renderHook(() => useTourController({}))

    // then
    expect(result.current.getSomething()).toBe('something')
    expect(result.current.getDone()).toBeUndefined()
  })

  it('should use the initialState to initialize the reducer state', () => {
    // given
    initialState.funkyState = 'funky'

    // when
    const { result } = renderHook(() => useTourController({
      configOption: 1
    }))

    // then    
    expect(result.current.getConfig('funkyState')).toBe('funky')
  })

  it('should use the tourConfig to initialize the reducer state', () => {
    // when
    const { result } = renderHook(() => useTourController({
      configOption: 1
    }))

    // then    
    expect(result.current.getConfig('configOption')).toBe(1)
  })

  it('should share the state between the selectors and actions', () => {
    // given
    const { result } = renderHook(() => useTourController({}))

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
    const { result } = renderHook(() => useTourController({}))

    // then
    expect(useStepChange).toHaveBeenCalledWith(result.current)
  })
})
