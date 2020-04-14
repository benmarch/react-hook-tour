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
    if (!hone) { 
      import('hone').then(module => {
        const Hone = module.default || module
        if (Hone) {
          const hone = new Hone(initialOptions)
          setHone(hone)        
        }
      }).catch(e => {
        // hone is not available, but that's ok
      })     
    }

    return () => {      
      if (hone && hone.status !== 'DESTROYED') {
        hone.destroy()        
        setHone(null)
      } 
    }
  }, [hone])

  return hone
}
