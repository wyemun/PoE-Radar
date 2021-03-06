import { NetworkInterfaceInfo, networkInterfaces } from 'os'
import Server from './Server.interface'
import { version } from '../../package.json'
import FilePoller from './FilePoller'
import System from './System'
import { existsSync } from 'fs'

// const { CLIENT_PATH = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Path of Exile\\logs\\Client.txt' } = process.env
const { CLIENT_PATH } = process.env

export default class Application {
  private server: Server
  private poller: FilePoller

  constructor(server: Server) {
    this.server = server

    if (CLIENT_PATH) {
      if (existsSync(CLIENT_PATH)) {
        this.poller = new FilePoller(this.server.getDispatcher(), CLIENT_PATH)
        return
      }
      console.log("Provided client path is invalid, proceeding to auto detection...")
    }

    try {
      const poeDir = System.findInstallLocation()
      const poeClientPath = `${poeDir}\\logs\\Client.txt`
      // console.log('>>>', poeClientPath)
      this.poller = new FilePoller(this.server.getDispatcher(), poeClientPath)
    } catch {
      // do nothing
      console.log("Unable to detect PoE installation location, using exiting now...")
      process.exit(1)
    }
  }

  private async startPoller() {
    return this.poller.start()
  }

  private getLocalIP() {
    const nets = networkInterfaces();

    const ips = Object.entries(nets).reduce((prev, curr) => {
      const inner = curr[1]?.reduce((iPrev, iCurr) => {
        if (iCurr.family === 'IPv4' && iCurr.address !== '127.0.0.1') {
          return [...iPrev, iCurr]
        }
        return iPrev
      }, [] as NetworkInterfaceInfo[])

      if (inner)
        return [...prev, ...inner]

      return prev
    }, [] as NetworkInterfaceInfo[])

    return ips
  }

  async start(): Promise<void> {
    console.log('PoE Radar version: %s', version)
    const port = this.server.getPort()

    const ips = this.getLocalIP().map(i => i.address)

    if (ips.length > 0) {
      console.log(`
Open the following page in your mobile browser:
http://${ips[0]}:${port}
    `)

      if (ips.length > 1) {
        const [, ...theRest] = ips
        const theRestStr = theRest.map(ip => `http://${ip}:${port}`)
        console.log(`If the address above does not work, try any of the following instead:
${theRestStr.join('\n')}
`)
      }
    } else {
      console.log('Unable to retrieve your machine IP in your local network :(')
      return
    }

    this.startPoller()
    return this.server.serve()
  }
}