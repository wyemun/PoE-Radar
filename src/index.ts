import Application from './classes/application'
import SocketServer from './classes/socket-server'
import FilePoller from './classes/file-poller'

(async () => {
  const server = new SocketServer('8080')
  const dispatcher = server.getDispatcher()
  const app = new Application(server)
  const poller = new FilePoller(dispatcher)
  
  app.start()
  poller.start()
  
})()
