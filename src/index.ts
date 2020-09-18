import Application from './classes/Application'
import SocketServer from './classes/SockerServer'

const port = process.env.PORT || '8080';

(async () => {
  const server = new SocketServer(port)
  const app = new Application(server)
  app.start() // * http.Server will prevent exiting here
})()
