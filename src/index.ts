import Application from './classes/Application'
import SocketServer from './classes/SockerServer'


(async () => {
  const server = new SocketServer('8080')
  const app = new Application(server)
  app.start() // * http.Server will prevent exiting here
})()
