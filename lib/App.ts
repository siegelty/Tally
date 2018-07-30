import * as express from 'express'
import * as bodyParser from 'body-parser'
import { poll_router } from './routes/poll'
import { Routes } from './routes/crmRoutes'
import * as mongoose from 'mongoose'

class App {
    public app: express.Application;
    public routesPrv: Routes = new Routes();
    public mongoURL: string = 'mongodb://localhost/CRMdb'

    constructor() {
        this.app = express()
        this.config()
        this.routesPrv.routes(this.app)
        this.mongoSetup();
        // this.mountRoutes()
    }

    // private mountRoutes (): void {
    //     const router = express.Router()
    //     router.get('/', (req, res) => {
    //         res.json({
    //             message: 'Hello World!'
    //         })
    //     })
    //     this.app.use('/', router)

    //     this.app.use('/api/v1.0/poll', poll_router)
    // }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    
    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoURL, { useNewURLParser: true }); 
    }
}

export default new App().app