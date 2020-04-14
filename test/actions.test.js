import generateActions from '../lib/actions'

describe('Tour Actions', () => {
  describe('generateActions()', () => {
    it('should return a map of actions', () => {
      const actions = generateActions({}, () => {})

      expect(actions).toBeDefined()
    })
  })
})
