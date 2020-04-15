const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style

export default (referenceElement, popoverElement, options = {}) => {
  const { 
    scrollOffsets: {
      top: offsetTop = 0,
      left: offsetLeft = 0,
      bottom: offsetBottom = 0,
      right: offsetRight = 0,
    } = {}
  } = options

  const isInViewport = element => {
    const bounding = element.getBoundingClientRect();
  
    return (
        bounding.top >= offsetTop &&
        bounding.left >= offsetLeft &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offsetBottom &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) - offsetRight
    )
  }

  // if both the reference and popover are visible, then we're good
  if (isInViewport(referenceElement) && isInViewport(popoverElement)) {
    return
  }

  const referenceBoundary = referenceElement.getBoundingClientRect()
  const popoverBoundary = popoverElement.getBoundingClientRect()

  // creates a bounding rect around both elements
  const boundingUnion = {
    top: Math.min(referenceBoundary.top, popoverBoundary.top) - offsetTop,
    left: Math.min(referenceBoundary.left, popoverBoundary.left) - offsetLeft,
    bottom: (window.innerHeight || document.documentElement.clientHeight) - Math.max(referenceBoundary.bottom, popoverBoundary.bottom) - offsetBottom,
    right: (window.innerWidth || document.documentElement.clientWidth) - Math.max(referenceBoundary.right, popoverBoundary.right) - offsetRight,
  }

  const scrollBy = {
    behavior: 'smooth',
    top: 0,
    left: 0,
  }

  // determine how much to scroll by
  if (boundingUnion.bottom < 0) {
    scrollBy.top = boundingUnion.bottom * -1
  } else if (boundingUnion.top < 0) {
    scrollBy.top = boundingUnion.top    
  }

  if (boundingUnion.right < 0) {
    scrollBy.left = boundingUnion.right * -1
  } else if (boundingUnion.left < 0) {
    scrollBy.left = boundingUnion.left    
  }

  // scroll both elements into view
  if (scrollBy.top !== 0 || scrollBy.left !== 0) {
    if (isSmoothScrollSupported) {
      window.scrollBy(scrollBy)
    } else {
      window.scrollBy(scrollBy.left, scrollBy.top)
    }
  }
}
