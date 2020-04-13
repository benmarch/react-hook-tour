import { useEffect, useState } from 'react'

/**
 * Optional dependency on Hone. 
 * Will return the hone handle if present, otherwise `null`
 * 
 * @param {{}} initialOptions The initial options to pass to Hone
 */
export default initialOptions => {
  const [ hone, setHone ] = useState(null)

  useEffect(() => {
    import('hone').then(Hone => {
      if (Hone) {
        const hone = new Hone(initialOptions)
        setHone(hone)
      }
    }).catch(e => {
      // hone is not available, but that's ok
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
