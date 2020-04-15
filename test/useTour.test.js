import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { TourContext } from '../lib/TourProvider'
import useTour from '../lib/useTour'

describe('useTour Hook', () => {
  it('should return the tour controller from context', () => {
    // given
    const tourController = {}
    const wrapper = ({ children }) => (
      <TourContext.Provider value={tourController}>{children}</TourContext.Provider>
    )

    // when
    const { result } = renderHook(() => useTour(), { wrapper })

    // then
    expect(result.current).toBe(tourController)
  })
})
