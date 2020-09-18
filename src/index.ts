import Application from './classes/application'
import SocketServer from './classes/socket-server'


(async () => {
  const server = new SocketServer('8080')
  const app = new Application(server)
  app.start() // * http.Server will prevent exiting here
})()
