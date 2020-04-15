import smartScroll from '../lib/smartScroll'

describe('smartScroll()', () => {
  const makeElement = (top, left, height, width) => {
    return {
      getBoundingClientRect: () => ({
        top,
        left,
        height,
        width,
        bottom: top + height,
        right: left + width,
      })
    }
  }

  let options

  beforeEach(() => {
    /*
      Note: The default screen dimensions in JSDOM are 1024 x 768, and the tests assume that!
    */
    window.scrollBy = jest.fn()

    options = {
      scrollOffsets: {
        top: 100,
        left: 100,
        bottom: 100,
        right: 100
      }
    }
  })

  it('should do nothing if both the target and popover are in the viewport', () => {
    // given
    const target = makeElement(0, 0, 100, 100)
    const popover = makeElement(0, 120, 100, 100)

    // when
    smartScroll(target, popover)

    // then
    expect(window.scrollBy).not.toHaveBeenCalled()
  })

  it('should scroll up if one or both of the elements is above the viewport', () => {
    // given
    const target = makeElement(-100, 0, 100, 100)
    const popover = makeElement(0, 120, 100, 100)

    // when
    smartScroll(target, popover)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: -100,
      left: 0,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: -100,
      left: 0,
      behavior: 'smooth'
    })
  })

  it('should scroll down if one or both of the elements is below the viewport', () => {
    // given
    const target = makeElement(768, 0, 100, 100)
    const popover = makeElement(668, 0, 100, 100)

    // when
    smartScroll(target, popover)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 100,
      left: 0,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 100,
      left: 0,
      behavior: 'smooth'
    })
  })

  it('should scroll left if one or both of the elements is left of the viewport', () => {
    // given
    const target = makeElement(0, -100, 100, 100)
    const popover = makeElement(0, 20, 100, 100)

    // when
    smartScroll(target, popover)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -100,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -100,
      behavior: 'smooth'
    })
  })

  it('should scroll right if one or both of the elements is right of the viewport', () => {
    // given
    const target = makeElement(0, 1024, 100, 100)
    const popover = makeElement(0, 800, 100, 100)

    // when
    smartScroll(target, popover)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: 100,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: 100,
      behavior: 'smooth'
    })
  })

  it('should do nothing if both the target and popover are in the padded viewport', () => {
    // given
    const target = makeElement(100, 100, 100, 100)
    const popover = makeElement(100, 220, 100, 100)

    // when
    smartScroll(target, popover, options)

    // then
    expect(window.scrollBy).not.toHaveBeenCalled()
  })

  it('should scroll up if one or both of the elements is above the padded viewport', () => {
    // given
    const target = makeElement(0, 100, 100, 100)
    const popover = makeElement(0, 220, 100, 100)

    // when
    smartScroll(target, popover, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: -100,
      left: 0,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: -100,
      left: 0,
      behavior: 'smooth'
    })
  })

  it('should scroll down if one or both of the elements is below the padded viewport', () => {
    // given
    const target = makeElement(668, 100, 100, 100)
    const popover = makeElement(568, 100, 100, 100)

    // when
    smartScroll(target, popover, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 100,
      left: 0,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 100,
      left: 0,
      behavior: 'smooth'
    })
  })

  it('should scroll left if one or both of the elements is left of the padded viewport', () => {
    // given
    const target = makeElement(100, 0, 100, 100)
    const popover = makeElement(100, 120, 100, 100)

    // when
    smartScroll(target, popover, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -100,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -100,
      behavior: 'smooth'
    })
  })

  it('should scroll right if one or both of the elements is right of the padded viewport', () => {
    // given
    const target = makeElement(100, 924, 100, 100)
    const popover = makeElement(100, 700, 100, 100)

    // when
    smartScroll(target, popover, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: 100,
      behavior: 'smooth'
    })

    // when
    // swapped
    smartScroll(popover, target, options)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: 100,
      behavior: 'smooth'
    })
  })
})
