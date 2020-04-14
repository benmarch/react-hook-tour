import Hone from 'hone'
import { renderHook } from '@testing-library/react-hooks'
import useBackdrop from '../lib/useBackdrop'

jest.mock('hone')

describe('useBackdrop Hook', () => {
  it('should instantiate Hone if it is available and return it if it is available', async () => {
    // given 
    const initialOptions = {}    

    // when
    const { result, waitForNextUpdate } = renderHook(() => useBackdrop(initialOptions))
    await waitForNextUpdate()

    // then
    expect(Hone).toHaveBeenCalledWith(initialOptions)
    expect(result.current).toBeInstanceOf(Hone)
  })

  test('should destroy hone when unmounted', async () => {
    // given 
    const initialOptions = {}    

    // when
    const { result, waitForNextUpdate, unmount } = renderHook(() => useBackdrop(initialOptions))
    await waitForNextUpdate()

    // then
    expect(result.current).toBeInstanceOf(Hone)

    // when
    unmount()  

    // then 
    expect(result.current.destroy).toHaveBeenCalled()
  })
})
