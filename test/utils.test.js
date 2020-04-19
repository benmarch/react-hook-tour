import { StepConfigType } from '../lib/constants'
import * as utils from '../lib/utils'

describe('Utility Functions', () => {
  describe('getStepConfigType()', () => {
    it('should identify an invalid step config', () => {
      // when
      const stepConfigType1 = utils.getStepConfigType({
        nonsense: 'blah'
      })
      const stepConfigType2 = utils.getStepConfigType({
        fetch: () => {}
      })

      // then
      expect(stepConfigType1).toBe(StepConfigType.INVALID)
      expect(stepConfigType2).toBe(StepConfigType.INVALID)
    })

    it('should identify a simple name reference', () => {
      // when
      const stepConfigType = utils.getStepConfigType('test')

      // then
      expect(stepConfigType).toBe(StepConfigType.NAME)
    })

    it('should identify an asynchronous step config', () => {
      // when
      const stepConfigType = utils.getStepConfigType({
        name: 'blah',
        fetch: () => {}
      })

      // then
      expect(stepConfigType).toBe(StepConfigType.ASYNC)
    })

    it('should identify a predefined step config', () => {
      // when
      const stepConfigType = utils.getStepConfigType({
        name: 'blah'
      })

      // then
      expect(stepConfigType).toBe(StepConfigType.PREDEFINED)
    })

    it('should identify a fully registered step config', () => {
      // when
      const stepConfigType1 = utils.getStepConfigType({
        name: 'blah',
        ref: {
          current: null
        }
      })
      const stepConfigType2 = utils.getStepConfigType({
        name: 'blah',
        fetch: () => {},
        ref: {
          current: null
        }
      })

      // then
      expect(stepConfigType1).toBe(StepConfigType.FULL)
      expect(stepConfigType2).toBe(StepConfigType.FULL)
    })
  })

  describe('get()', () => {
    let target

    beforeEach(() => {
      target = {
          key: 'val',
          top: {
            second: 'woo'
          }
      }
    })

    it('should return undefined when the object is undefined', () => {
      // when
      let empty
      const val = utils.get(empty, 'key')

      // then
      expect(val).toBeUndefined()
    })

    it('should return the default value when the object is undefined', () => {
      // when
      let empty
      const val = utils.get(empty, 'fake', 'default')

      // then
      expect(val).toBe('default')
    })

    it('should return the property if it is defined', () => {
      // when
      const val = utils.get(target, 'key')

      // then
      expect(val).toBe('val')
    })
    
    it('should return undefined when the property is undefined', () => {
      // when
      const val = utils.get(target, 'fake')

      // then
      expect(val).toBeUndefined()
    })

    it('should return the default value when the property is undefined', () => {
      // when
      const val = utils.get(target, 'fake', 'default')

      // then
      expect(val).toBe('default')
    })

    it('should return the second-level property if it is defined', () => {
      // when
      const val = utils.get(target, 'top.second')

      // then
      expect(val).toBe('woo')
    })

    it('should return undefined when the second-level property is undefined', () => {
      // when
      const val = utils.get(target, 'top.fake')

      // then
      expect(val).toBeUndefined()
    })

    it('should return the default value when the second-level property is undefined', () => {
      // when
      const val = utils.get(target, 'top.fake', 'default')

      // then
      expect(val).toBe('default')
    })

    it('should return undefined when the top-level property is undefined', () => {
      // when
      const val = utils.get(target, 'fake.second')

      // then
      expect(val).toBeUndefined()
    })

    it('should return the default value when the top-level property is undefined', () => {
      // when
      const val = utils.get(target, 'fake.second', 'default')

      // then
      expect(val).toBe('default')
    })
  })
})
