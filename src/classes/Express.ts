import express from 'express'

// import Locals from './Locals'
// import Routes from './Routes'
// import Bootstrap from '../middlewares/Kernel'
// import ExceptionHandler from '../exception/Handler'

import indexHtml from '../assets/index.html'

export default class Express {
	private express: express.Application

	constructor () {
		this.express = express()

		this.mountDotEnv()
		this.mountMiddlewares()
		this.mountRoutes()
	}

	private mountDotEnv (): void {
    // this.express = Locals.init(this.express)
	}

	private mountMiddlewares (): void {
    // const options = { maxAge: 31557600000 }
    // this.express.use(express.static(path.join(__dirname, '../public'), options))
	}

	private mountRoutes (): void {
		// this.express = Routes.mountWeb(this.express)
    // this.express = Routes.mountApi(this.express)
    this.express.get('/', (req, res) => {
      res.send(indexHtml)
    })
  }
  
  public getApp (): express.Application {
    return this.express
  }
}