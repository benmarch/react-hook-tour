import { useEffect, useState } from 'react'

/**
 * Optional dependency on Hone. 
 * Will return the hone handle if present, otherwise `null`
 */
export default tour => {
  const [ hone, setHone ] = useState(null)

  useEffect(() => {
    import('hone').then(Hone => {
      if (Hone) {
        const hone = new Hone({
          enabled: false,
          classPrefix: tour.getConfig('backdropClassName') || 'tour-backdrop'
        })
        setHone(hone)
      }
    })

    return () => {
      return () => {
        if (hone && hone.status !== 'DESTROYED') {
          hone.destroy()        
          setHone(null)
        }    
      }
    }
  }, [])

  return hone
}
