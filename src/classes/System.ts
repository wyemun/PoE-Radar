import { enumerateValues, HKEY, enumerateKeys } from 'registry-js'

export default class System {
  static findInstallLocation (): string {
    const base = 'SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
    
    const keys = enumerateKeys(
      HKEY.HKEY_LOCAL_MACHINE,
      base
    )
  
    for (const key of keys) {
      // console.log("checking", key)    
      const values = enumerateValues(HKEY.HKEY_LOCAL_MACHINE, `${base}\\${key}`)
  
      const matched = values.find(v => v.name === 'DisplayName' && v.data === 'Path of Exile')
  
      if (matched) {
        const installLocation = values.find(v => v.name === 'InstallLocation')
        if (installLocation) return installLocation.data.toString()
      }
    }

    throw new Error('Cannot find PoE location. Probably non-steam/windows version')
  }
}