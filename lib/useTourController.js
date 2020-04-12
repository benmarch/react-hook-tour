import { useReducer } from 'react'
import useStepChange from './useStepChange'
import generateActions from './actions'
import reducer, { initialState, generateSelectors } from './reducer'

export default tourConfig => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...tourConfig,
  })

  const selectors = generateSelectors(state)
  const actions = generateActions(selectors, dispatch)

  const tourController = {
    ...selectors,
    ...actions
  }

  useStepChange(tourController)

  return tourController
}
