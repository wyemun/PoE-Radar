import Server from './server.interface'
import io from 'socket.io'
import http from 'http'
import { EventEmitter } from 'events'
import { EventType } from './file-poller'

export default class SocketServer implements Server {
  private port: string
  private httpServer: http.Server
  private ioServer: SocketIO.Server
  private dispatcher: EventEmitter = new EventEmitter()

  constructor (port: string) {
    this.port = port

    this.httpServer = http.createServer()
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
      console.log('Message from FilePoller', msg)
    })
  }

  async serve (): Promise<void> {
    console.log('Starting socket server...')
    this.httpServer.listen(this.port)
  }

  getDispatcher (): EventEmitter {
    return this.dispatcher
  }
}