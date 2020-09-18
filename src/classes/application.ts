import Server from './server.interface'
import { version } from '../../package.json'
import FilePoller from './file-poller'

const { CLIENT_PATH = 'C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/Client.txt'} = process.env

export default class Application {
  private server: Server
  private poller: FilePoller

  constructor(server: Server) {
    this.server = server
    this.poller = new FilePoller(this.server.getDispatcher(), CLIENT_PATH)
  }
  
  private async startPoller () {
    return this.poller.start()
  }

  async start (): Promise<void> {
    console.log('PoE Radar version: %s', version)
    this.startPoller()
    return this.server.serve()
  }
}