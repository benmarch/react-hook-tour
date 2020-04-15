import { useReducer } from 'react'
import useStepChange from './useStepChange'
import generateActions from './actions'
import reducer, { initialState, generateSelectors } from './reducer'

/**
 * A hook that constructs a Tour given initial config.
 * Returns the tourController instance
 */
export default tourConfig => {
  // The reducer manages the state of the tour.
  // The selectors allow state to be retrieved.
  // The actions allow state to be manipulated.
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...tourConfig,
  })
  const selectors = generateSelectors(state)
  const allSelectors = {
    ...selectors.public,
    ...selectors.protected,
  }
  const actions = generateActions(allSelectors, dispatch)
  const allActions = {
    ...actions.public,
    ...actions.protected,
  }

  // construct the Tour
  const tourController = {
    ...allSelectors,
    ...allActions,
    public: {
      ...selectors.public,
      ...actions.public
    }
  }

  // listen for step transitions and properly handle them
  useStepChange(tourController)

  return tourController
}
