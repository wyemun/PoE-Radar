import Server from './server.interface'

export default class Application {
  private server: Server

  constructor(server: Server) {
    this.server = server
  }
   
  async start (): Promise<void> {
    console.log('Hey hey!')
    return this.server.serve()
  }
}
