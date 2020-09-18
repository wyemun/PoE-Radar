import Server from './Server.interface'
import io from 'socket.io'
import http from 'http'
import { EventEmitter } from 'events'
import Express from './Express'
import { EventType } from './FilePoller'

export default class SocketServer implements Server {
  private port: string
  private httpServer: http.Server
  private ioServer: SocketIO.Server
  private expressApp: Express
  private dispatcher: EventEmitter = new EventEmitter()

  constructor (port: string) {
    this.port = port

    this.expressApp = new Express()

    this.httpServer = http.createServer(this.expressApp.getApp())
    this.ioServer = io(this.httpServer)
    

    this.addIOListeners()
    this.addDispatcherListeners()
  }

  private addIOListeners () : void {
    if (!this.ioServer) {
      throw new Error('IO server not initialized.')
    }

    this.ioServer.on('connection', (socket: SocketIO.Client)  => {
      console.log('New connection: %s', socket.id)
    })
  }

  private addDispatcherListeners (): void {
    this.dispatcher.on(EventType.Start, msg => {
      // console.log('Message from FilePoller', msg)
    })

    this.dispatcher.on(EventType.LocationChanged, msg => {
      this.ioServer.emit('zone', msg)
    })
  }

  public getPort(): string {
    return this.port
  }

  async serve (): Promise<void> {
    console.log('Starting socket server...')
    this.httpServer.listen(this.port)
  }

  getDispatcher (): EventEmitter {
    return this.dispatcher
  }
}